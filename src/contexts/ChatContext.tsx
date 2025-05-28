import React, {
	createContext,
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

type ChatContextType = {
	chats: Chat[];
	activeChat: string;
	messages: Message[];
	isTyping: boolean;
	searchResults: SearchResult[];
	isSearching: boolean;
	setActiveChat: (id: string) => void;
	createNewChat: (initialMessage?: string) => void;
	deleteChat: (id: string) => void;
	sendMessage: (text: string) => void;
	handleMessageAction: (
		action: MessageAction,
		messageId: string,
		newText?: string
	) => void;
	updateChat: (
		chatId: string,
		updates: Partial<Chat>,
		updateLastActivity?: boolean
	) => void;
	searchChats: (filters: SearchFilters) => void;
	clearSearch: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext<
	ChatContextType | undefined
>(undefined);

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

	// Load chats from localStorage on mount
	useEffect(() => {
		const savedChats = localStorage.getItem('chats');
		if (savedChats) {
			const parsedChats = JSON.parse(savedChats);
			setChats(parsedChats);
			if (parsedChats.length > 0) {
				setActiveChat(parsedChats[0].id);
			}
		}
		// Start with empty chats array - no sample data
		// Users will create real chats through the interface
	}, []);

	// Load messages when active chat changes
	useEffect(() => {
		if (activeChat) {
			const savedMessages =
				localStorage.getItem(activeChat);
			if (savedMessages) {
				setMessages(JSON.parse(savedMessages));
			} else {
				setMessages([]);
			}
		}
	}, [activeChat]);

	// Save chats to localStorage whenever they change
	useEffect(() => {
		if (chats.length > 0) {
			localStorage.setItem(
				'chats',
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

	const createNewChat = (initialMessage?: string) => {
		const newChat: Chat = {
			id: crypto.randomUUID(),
			displayId: `Chat ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
			messages: [],
			createdAt: new Date().toISOString(),
			lastActivity: new Date().toISOString(),
		};

		const updatedChats = [newChat, ...chats];
		setChats(updatedChats);
		setActiveChat(newChat.id);

		if (initialMessage) {
			// If there's an initial message, send it
			setTimeout(
				() => sendMessage(initialMessage),
				100
			);
		}
	};

	const deleteChat = (chatId: string) => {
		const updatedChats = chats.filter(
			(chat) => chat.id !== chatId
		);
		setChats(updatedChats);

		if (chatId === activeChat) {
			setActiveChat(
				updatedChats.length > 0
					? updatedChats[0].id
					: ''
			);
		}

		localStorage.removeItem(chatId);
	};

	const updateChat = (
		chatId: string,
		updates: Partial<Chat>,
		updateLastActivity?: boolean
	) => {
		setChats((prev) =>
			prev.map((chat) =>
				chat.id === chatId
					? {
							...chat,
							...updates,
							// Only update lastActivity if explicitly requested (for message-related updates)
							...(updateLastActivity && {
								lastActivity:
									new Date().toISOString(),
							}),
					  }
					: chat
			)
		);
	};

	const sendMessage = (text: string) => {
		// Ensure text is a string and handle edge cases
		const messageText =
			typeof text === 'string'
				? text
				: String(text || '');
		if (!messageText.trim()) return;

		// Add user message immediately
		const userMessage: Message = {
			id: crypto.randomUUID(),
			type: 'prompt',
			text: messageText.trim(),
			timestamp: new Date().toLocaleTimeString(),
			status: 'sending',
		};

		const updatedMessages = [...messages, userMessage];
		setMessages(updatedMessages);
		setIsTyping(true);

		// Update last activity
		updateChat(
			activeChat,
			{
				lastActivity: new Date().toISOString(),
			},
			true
		);

		// Save to localStorage
		localStorage.setItem(
			activeChat,
			JSON.stringify(updatedMessages)
		);

		// Update chat in chats array
		setChats((prev) =>
			prev.map((chat) =>
				chat.id === activeChat
					? {
							...chat,
							messages: updatedMessages,
							lastActivity:
								new Date().toISOString(),
					  }
					: chat
			)
		);

		// Send to API
		sendMessageMutation.mutate(messageText);
	};

	// Search functionality
	const searchChats = useCallback(
		(filters: SearchFilters) => {
			setIsSearching(true);

			try {
				// Perform search synchronously - no need for setTimeout
				const results = SearchEngine.search(
					chats,
					filters
				);
				setSearchResults(results);
			} catch (error) {
				console.error('Search error:', error);
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		},
		[chats]
	);

	const clearSearch = useCallback(() => {
		setSearchResults([]);
		setIsSearching(false);
	}, []);

	const handleMessageAction = (
		action: MessageAction,
		messageId: string,
		newText?: string
	) => {
		const updatedMessages = messages.map((message) => {
			if (message.id === messageId) {
				switch (action) {
					case 'edit':
						return {
							...message,
							text: newText || message.text,
							isEdited: true,
							originalText:
								message.originalText ||
								message.text,
						};
					case 'favorite':
						return {
							...message,
							isFavorite: true,
						};
					case 'unfavorite':
						return {
							...message,
							isFavorite: false,
						};
					default:
						return message;
				}
			}
			return message;
		});

		if (action === 'delete') {
			const filteredMessages = messages.filter(
				(message) => message.id !== messageId
			);
			setMessages(filteredMessages);
			localStorage.setItem(
				activeChat,
				JSON.stringify(filteredMessages)
			);

			// Update chat in chats array
			setChats((prev) =>
				prev.map((chat) =>
					chat.id === activeChat
						? {
								...chat,
								messages: filteredMessages,
						  }
						: chat
				)
			);
		} else {
			setMessages(updatedMessages);
			localStorage.setItem(
				activeChat,
				JSON.stringify(updatedMessages)
			);

			// Update chat in chats array
			setChats((prev) =>
				prev.map((chat) =>
					chat.id === activeChat
						? {
								...chat,
								messages: updatedMessages,
						  }
						: chat
				)
			);
		}
	};

	return (
		<ChatContext.Provider
			value={{
				chats: sortedChats,
				activeChat,
				messages,
				isTyping,
				searchResults,
				isSearching,
				setActiveChat,
				createNewChat,
				deleteChat,
				sendMessage,
				handleMessageAction,
				updateChat,
				searchChats,
				clearSearch,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};
