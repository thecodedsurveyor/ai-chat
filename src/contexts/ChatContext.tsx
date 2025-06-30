import React, {
	createContext,
	useContext,
	useState,
	useEffect,
} from 'react';
import type { Message, Chat, SearchResult } from '../types';
import { authService } from '../services/authService';

interface ChatContextType {
	// Chat management
	chats: Chat[];
	setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
	activeChat: string;
	setActiveChat: React.Dispatch<
		React.SetStateAction<string>
	>;

	// Message management
	messages: Message[];
	setMessages: React.Dispatch<
		React.SetStateAction<Message[]>
	>;
	isTyping: boolean;
	setIsTyping: React.Dispatch<
		React.SetStateAction<boolean>
	>;

	// Search functionality
	searchResults: SearchResult[];
	setSearchResults: React.Dispatch<
		React.SetStateAction<SearchResult[]>
	>;
	isSearching: boolean;
	setIsSearching: React.Dispatch<
		React.SetStateAction<boolean>
	>;

	// Chat operations
	addMessage: (message: Message) => void;
	createNewChat: () => void;
	deleteChat: (chatId: string) => void;
	searchMessages: (query: string) => void;
	clearSearch: () => void;
}

const ChatContext = createContext<ChatContextType | null>(
	null
);

export const ChatProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [chats, setChats] = useState<Chat[]>([]);
	const [activeChat, setActiveChat] =
		useState<string>('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [searchResults, setSearchResults] = useState<
		SearchResult[]
	>([]);
	const [isSearching, setIsSearching] = useState(false);

	// Helper function to get user-specific localStorage keys
	const getUserStorageKey = (key: string): string => {
		const user = authService.getUser();
		if (!user) return key; // Fallback, but should not happen in authenticated context
		return `${key}_user_${user.id}`;
	};

	// Helper function to clear all user-specific data from localStorage
	const clearUserData = () => {
		const user = authService.getUser();
		if (!user) return;

		const userPrefix = `_user_${user.id}`;
		const keysToRemove: string[] = [];

		// Find all keys belonging to this user
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.includes(userPrefix)) {
				keysToRemove.push(key);
			}
		}

		// Remove user-specific keys
		keysToRemove.forEach((key) =>
			localStorage.removeItem(key)
		);
	};

	// Clear data when user changes or logs out
	useEffect(() => {
		const handleStorageChange = () => {
			const currentUser = authService.getUser();
			if (!currentUser) {
				// User logged out - clear all state immediately
				setChats([]);
				setActiveChat('');
				setMessages([]);
				setSearchResults([]);
				setIsSearching(false);
			}
		};

		const handleUserLogout = () => {
			// Force clear all state immediately when user logs out
			setChats([]);
			setActiveChat('');
			setMessages([]);
			setSearchResults([]);
			setIsSearching(false);
		};

		// Listen for auth changes
		window.addEventListener(
			'storage',
			handleStorageChange
		);
		window.addEventListener(
			'userLogout',
			handleUserLogout
		);

		return () => {
			window.removeEventListener(
				'storage',
				handleStorageChange
			);
			window.removeEventListener(
				'userLogout',
				handleUserLogout
			);
		};
	}, []);

	// Load chats from backend when user changes or on mount
	useEffect(() => {
		const loadUserChats = async () => {
			const user = authService.getUser();
			if (!user) {
				// No user logged in - clear everything
				setChats([]);
				setActiveChat('');
				setMessages([]);
				return;
			}

			// Try to load chats from backend first
			try {
				const { conversationService } =
					await import(
						'../services/conversationService'
					);
				const response =
					await conversationService.getConversations();

				if (
					response.success &&
					response.data?.conversations
				) {
					const backendChats =
						response.data.conversations.map(
							(conv) => ({
								id: conv.id,
								displayId: conv.title,
								messages: [], // Will be loaded when chat is selected
								createdAt: conv.createdAt,
								lastActivity:
									conv.lastMessageAt ||
									conv.updatedAt,
								totalMessages:
									conv.totalMessages,
								isPinned: conv.isPinned,
							})
						);

					setChats(backendChats);

					// Set active chat to the most recent one
					if (backendChats.length > 0) {
						const mostRecent =
							backendChats.sort(
								(a, b) =>
									new Date(
										b.lastActivity ||
											b.createdAt
									).getTime() -
									new Date(
										a.lastActivity ||
											a.createdAt
									).getTime()
							)[0];
						setActiveChat(mostRecent.id);
					}
					return;
				}
			} catch (error) {
				console.error(
					'Failed to load chats from backend:',
					error
				);
			}

			// Fallback to localStorage if backend fails
			const userChatsKey = getUserStorageKey('chats');
			const savedChats =
				localStorage.getItem(userChatsKey);
			if (savedChats) {
				try {
					const parsedChats =
						JSON.parse(savedChats);
					setChats(parsedChats);
					if (parsedChats.length > 0) {
						setActiveChat(parsedChats[0].id);
					}
				} catch (error) {
					console.error(
						'Error parsing saved chats:',
						error
					);
					localStorage.removeItem(userChatsKey);
					setChats([]);
				}
			}
		};

		loadUserChats();
	}, []);

	// Load messages when active chat changes
	useEffect(() => {
		const loadChatMessages = async () => {
			const user = authService.getUser();
			if (!user || !activeChat) {
				setMessages([]);
				return;
			}

			// Try to load messages from backend first
			try {
				const { conversationService } =
					await import(
						'../services/conversationService'
					);
				const response =
					await conversationService.getMessages(
						activeChat
					);

				if (
					response.success &&
					response.data?.messages
				) {
					const backendMessages =
						response.data.messages.map(
							(msg) => ({
								id: msg.id,
								type:
									msg.role === 'user'
										? ('prompt' as const)
										: ('response' as const),
								text: msg.content,
								timestamp: new Date(
									msg.createdAt
								).toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit',
								}),
								status: 'delivered' as const,
							})
						);

					setMessages(backendMessages);
					return;
				}
			} catch (error) {
				console.error(
					'Failed to load messages from backend:',
					error
				);
			}

			// Fallback to localStorage if backend fails
			const userChatKey =
				getUserStorageKey(activeChat);
			const savedMessages =
				localStorage.getItem(userChatKey);
			if (savedMessages) {
				try {
					setMessages(JSON.parse(savedMessages));
				} catch (error) {
					console.error(
						'Error parsing saved messages:',
						error
					);
					localStorage.removeItem(userChatKey);
					setMessages([]);
				}
			} else {
				setMessages([]);
			}
		};

		loadChatMessages();
	}, [activeChat]);

	// Save chats to user-specific localStorage whenever they change
	useEffect(() => {
		const user = authService.getUser();
		if (!user) return;

		if (chats.length > 0) {
			const userChatsKey = getUserStorageKey('chats');
			localStorage.setItem(
				userChatsKey,
				JSON.stringify(chats)
			);
		}
	}, [chats]);

	// Sort chats: pinned first, then by last activity
	const sortedChats = React.useMemo(() => {
		return [...chats].sort((a, b) => {
			// Pinned chats first
			if (a.isPinned && !b.isPinned) return -1;
			if (!a.isPinned && b.isPinned) return 1;

			// Then by last activity or creation date
			const aDate = new Date(
				a.lastActivity || a.createdAt
			);
			const bDate = new Date(
				b.lastActivity || b.createdAt
			);
			return bDate.getTime() - aDate.getTime();
		});
	}, [chats]);

	const createNewChat = async () => {
		const user = authService.getUser();
		if (!user) return;

		try {
			// Try to create chat in backend first
			const { conversationService } = await import(
				'../services/conversationService'
			);
			const response =
				await conversationService.createConversation(
					`Chat ${chats.length + 1}`
				);

			if (
				response.success &&
				response.data?.conversation
			) {
				const backendChat =
					response.data.conversation;
				const newChat: Chat = {
					id: backendChat.id,
					displayId: backendChat.title,
					messages: [],
					createdAt: backendChat.createdAt,
					lastActivity: backendChat.updatedAt,
					totalMessages: 0,
					isPinned: backendChat.isPinned,
				};

				const updatedChats = [newChat, ...chats];
				setChats(updatedChats);
				setActiveChat(newChat.id);
				setMessages([]);

				// Also save to localStorage as backup
				const userChatsKey =
					getUserStorageKey('chats');
				localStorage.setItem(
					userChatsKey,
					JSON.stringify(updatedChats)
				);
				return;
			}
		} catch (error) {
			console.error(
				'Failed to create chat in backend:',
				error
			);
		}

		// Fallback to local-only chat creation
		const newChat: Chat = {
			id: `chat-${Date.now()}`,
			displayId: `Chat ${chats.length + 1}`,
			messages: [],
			createdAt: new Date().toISOString(),
			lastActivity: new Date().toISOString(),
			totalMessages: 0,
		};

		const updatedChats = [newChat, ...chats];
		setChats(updatedChats);
		setActiveChat(newChat.id);
		setMessages([]);

		// Save to user-specific localStorage
		const userChatsKey = getUserStorageKey('chats');
		localStorage.setItem(
			userChatsKey,
			JSON.stringify(updatedChats)
		);
	};

	const addMessage = async (message: Message) => {
		const user = authService.getUser();
		if (!user) return;

		const newMessages = [...messages, message];
		setMessages(newMessages);

		// Save to user-specific localStorage immediately
		if (activeChat) {
			const userChatKey =
				getUserStorageKey(activeChat);
			localStorage.setItem(
				userChatKey,
				JSON.stringify(newMessages)
			);

			// Update chat's last activity
			const updatedChats = chats.map((chat) =>
				chat.id === activeChat
					? {
							...chat,
							lastActivity:
								new Date().toISOString(),
							totalMessages:
								newMessages.length,
					  }
					: chat
			);
			setChats(updatedChats);

			// Try to save message to backend
			try {
				const { conversationService } =
					await import(
						'../services/conversationService'
					);
				await conversationService.addMessage(
					activeChat,
					message.type === 'prompt'
						? 'user'
						: 'assistant',
					message.text
				);
			} catch (error) {
				console.error(
					'Failed to save message to backend:',
					error
				);
				// Message is still saved locally, so we continue
			}
		}
	};

	const deleteChat = (chatId: string) => {
		const user = authService.getUser();
		if (!user) return;

		// Remove from chats array
		const updatedChats = chats.filter(
			(chat) => chat.id !== chatId
		);
		setChats(updatedChats);

		// Remove messages from user-specific localStorage
		const userChatKey = getUserStorageKey(chatId);
		localStorage.removeItem(userChatKey);

		// If deleting active chat, switch to another or clear
		if (activeChat === chatId) {
			if (updatedChats.length > 0) {
				setActiveChat(updatedChats[0].id);
			} else {
				setActiveChat('');
				setMessages([]);
			}
		}
	};

	const searchMessages = (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			setIsSearching(false);
			return;
		}

		setIsSearching(true);
		const results: SearchResult[] = [];

		chats.forEach((chat) => {
			const user = authService.getUser();
			if (!user) return;

			const userChatKey = getUserStorageKey(chat.id);
			const savedMessages =
				localStorage.getItem(userChatKey);
			if (savedMessages) {
				try {
					const chatMessages: Message[] =
						JSON.parse(savedMessages);
					chatMessages.forEach((message) => {
						if (
							message.text
								.toLowerCase()
								.includes(
									query.toLowerCase()
								)
						) {
							results.push({
								type: 'message',
								chat: chat,
								message,
								matchedText: message.text
									.substring(0, 100)
									.trim(),
								relevanceScore: 1,
							});
						}
					});
				} catch (error) {
					console.error(
						'Error parsing messages for search:',
						error
					);
				}
			}
		});

		setSearchResults(results);
		setIsSearching(false);
	};

	const clearSearch = () => {
		setSearchResults([]);
		setIsSearching(false);
	};

	// Expose function to clear user data when logging out
	React.useEffect(() => {
		// Add a global function to clear user data on logout
		(
			window as unknown as {
				clearChatData?: () => void;
			}
		).clearChatData = clearUserData;

		return () => {
			delete (
				window as unknown as {
					clearChatData?: () => void;
				}
			).clearChatData;
		};
	}, []);

	const value: ChatContextType = {
		chats: sortedChats,
		setChats,
		activeChat,
		setActiveChat,
		messages,
		setMessages,
		isTyping,
		setIsTyping,
		searchResults,
		setSearchResults,
		isSearching,
		setIsSearching,
		addMessage,
		createNewChat,
		deleteChat,
		searchMessages,
		clearSearch,
	};

	return (
		<ChatContext.Provider value={value}>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error(
			'useChat must be used within a ChatProvider'
		);
	}
	return context;
};
