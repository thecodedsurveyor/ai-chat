import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import type {
	Message,
	Chat,
	MessageAction,
	SearchFilters,
	SearchResult,
} from '../types';
import { SearchEngine } from '../utils/searchUtils';
import {
	callOpenRouter,
	buildConversationHistory,
} from '../utils/openRouter';
import authService from '../services/authService';

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
				// User logged out - clear all state
				setChats([]);
				setActiveChat('');
				setMessages([]);
				setSearchResults([]);
				setIsSearching(false);
			}
		};

		// Listen for auth changes
		window.addEventListener(
			'storage',
			handleStorageChange
		);

		return () => {
			window.removeEventListener(
				'storage',
				handleStorageChange
			);
		};
	}, []);

	// Load chats from user-specific localStorage on mount
	useEffect(() => {
		const user = authService.getUser();
		if (!user) {
			// No user logged in - clear everything
			setChats([]);
			setActiveChat('');
			setMessages([]);
			return;
		}

		const userChatsKey = getUserStorageKey('chats');
		const savedChats =
			localStorage.getItem(userChatsKey);
		if (savedChats) {
			try {
				const parsedChats = JSON.parse(savedChats);
				setChats(parsedChats);
				if (parsedChats.length > 0) {
					setActiveChat(parsedChats[0].id);
				}
			} catch (error) {
				console.error(
					'Error parsing saved chats:',
					error
				);
				// Clear corrupted data
				localStorage.removeItem(userChatsKey);
				setChats([]);
			}
		}
	}, []);

	// Load messages when active chat changes
	useEffect(() => {
		const user = authService.getUser();
		if (!user || !activeChat) {
			setMessages([]);
			return;
		}

		const userChatKey = getUserStorageKey(activeChat);
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
				// Clear corrupted data
				localStorage.removeItem(userChatKey);
				setMessages([]);
			}
		} else {
			setMessages([]);
		}
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

	// API call mutation
	const sendMessageMutation = useMutation({
		mutationFn: async (messageText: string) => {
			const startTime = Date.now(); // Track start time

			// Get current chat for context-aware messaging
			const currentChat = chats.find(
				(chat) => chat.id === activeChat
			);

			// Build conversation history with proper context management
			const conversationHistory =
				buildConversationHistory(
					currentChat,
					messageText
				);

			// Call OpenRouter API with conversation history
			const content = await callOpenRouter(
				conversationHistory
			);
			const responseTime = Date.now() - startTime;

			return { content, responseTime };
		},
		onSuccess: (response) => {
			// Add AI response with response time and word count
			const aiMessage: Message = {
				id: crypto.randomUUID(),
				type: 'response',
				text: response.content,
				timestamp: new Date().toLocaleTimeString(),
				status: 'delivered',
				responseTime: response.responseTime,
				wordCount: response.content
					.trim()
					.split(/\s+/)
					.filter(
						(word: string) => word.length > 0
					).length,
			};

			const updatedMessages = [
				...messages,
				aiMessage,
			];
			setMessages(updatedMessages);
			setIsTyping(false);

			// Update the last user message status to delivered and add word count
			const messagesWithUpdatedStatus =
				updatedMessages.map((msg, index) =>
					index === updatedMessages.length - 2 &&
					msg.type === 'prompt'
						? {
								...msg,
								status: 'delivered' as const,
								wordCount:
									msg.wordCount ||
									msg.text
										.trim()
										.split(/\s+/)
										.filter(
											(
												word: string
											) =>
												word.length >
												0
										).length,
						  }
						: msg
				);
			setMessages(messagesWithUpdatedStatus);

			// Save to localStorage
			localStorage.setItem(
				activeChat,
				JSON.stringify(messagesWithUpdatedStatus)
			);

			// Update chat in chats array with analytics data
			setChats((prev) =>
				prev.map((chat) =>
					chat.id === activeChat
						? {
								...chat,
								messages:
									messagesWithUpdatedStatus,
								totalMessages:
									messagesWithUpdatedStatus.length,
								averageResponseTime:
									messagesWithUpdatedStatus
										.filter(
											(m) =>
												m.type ===
													'response' &&
												m.responseTime
										)
										.reduce(
											(sum, m) =>
												sum +
												(m.responseTime ||
													0),
											0
										) /
										messagesWithUpdatedStatus.filter(
											(m) =>
												m.type ===
													'response' &&
												m.responseTime
										).length || 0,
						  }
						: chat
				)
			);
		},
		onError: () => {
			setIsTyping(false);
			// Update message status to error
			setMessages((prev) =>
				prev.map((msg, index) =>
					index === prev.length - 1 &&
					msg.type === 'prompt'
						? {
								...msg,
								status: 'error' as const,
						  }
						: msg
				)
			);
		},
	});

	const addMessage = (message: Message) => {
		const user = authService.getUser();
		if (!user) return;

		const newMessages = [...messages, message];
		setMessages(newMessages);

		// Save to user-specific localStorage
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
		}
	};

	const createNewChat = () => {
		const user = authService.getUser();
		if (!user) return;

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
					chatMessages.forEach(
						(message, index) => {
							if (
								message.content
									.toLowerCase()
									.includes(
										query.toLowerCase()
									)
							) {
								results.push({
									chatId: chat.id,
									messageIndex: index,
									message,
									chatTitle:
										chat.displayId,
									preview: message.content
										.substring(0, 100)
										.trim(),
								});
							}
						}
					);
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
		(window as any).clearChatData = clearUserData;

		return () => {
			delete (window as any).clearChatData;
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
