import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
	Message,
	Chat,
	SearchFilters,
	SearchResult,
} from '../types';
import {
	callOpenRouter,
	DEFAULT_CONFIG,
	type OpenRouterConfig,
	buildConversationHistory,
} from '../utils/openRouter';

interface ChatState {
	// Chat data state
	messages: Message[];
	chats: Chat[];
	activeChat: string | null;
	isTyping: boolean;
	searchResults: SearchResult[];
	isSearching: boolean;

	// Add model configuration
	modelConfig: OpenRouterConfig;
	setModelConfig: (
		config: Partial<OpenRouterConfig>
	) => void;

	// Actions
	setMessages: (messages: Message[]) => void;
	addMessage: (message: Message) => void;
	setChats: (chats: Chat[]) => void;
	addChat: (chat: Chat) => void;
	setActiveChat: (chatId: string | null) => void;
	deleteChat: (chatId: string) => void;
	updateChat: (
		chatId: string,
		updates: Partial<Chat>
	) => void;
	setIsTyping: (isTyping: boolean) => void;
	setSearchResults: (results: SearchResult[]) => void;
	setIsSearching: (isSearching: boolean) => void;
	clearSearch: () => void;

	// Complex actions
	createNewChat: (initialMessage?: string) => void;
	sendMessage: (text: string) => void;
	searchChats: (filters: SearchFilters) => void;
	handleMessageAction: (
		action: string,
		messageId: string,
		data?: string
	) => void;
}

export const useChatStore = create<ChatState>()(
	devtools(
		persist(
			(set, get) => ({
				// Initial state
				messages: [],
				chats: [],
				activeChat: null,
				isTyping: false,
				searchResults: [],
				isSearching: false,
				modelConfig: DEFAULT_CONFIG,

				// Model configuration action
				setModelConfig: (config) =>
					set((state) => ({
						modelConfig: {
							...state.modelConfig,
							...config,
						},
					})),

				// Basic actions
				setMessages: (messages) =>
					set({ messages }),
				addMessage: (message) =>
					set((state) => ({
						messages: [
							...state.messages,
							message,
						],
					})),
				setChats: (chats) => set({ chats }),
				addChat: (chat) =>
					set((state) => ({
						chats: [...state.chats, chat],
					})),
				setActiveChat: (chatId) => {
					set({ activeChat: chatId });
					// Load messages for the active chat
					const state = get();
					const chat = state.chats.find(
						(c) => c.id === chatId
					);
					if (chat) {
						set({
							messages: chat.messages || [],
						});
					} else {
						set({ messages: [] });
					}
				},
				deleteChat: (chatId) =>
					set((state) => {
						const newChats = state.chats.filter(
							(chat) => chat.id !== chatId
						);
						const newActiveChat =
							state.activeChat === chatId
								? null
								: state.activeChat;
						return {
							chats: newChats,
							activeChat: newActiveChat,
							messages: newActiveChat
								? state.messages
								: [],
						};
					}),
				updateChat: (chatId, updates) =>
					set((state) => ({
						chats: state.chats.map((chat) =>
							chat.id === chatId
								? {
										...chat,
										...updates,
										lastActivity:
											new Date().toISOString(),
								  }
								: chat
						),
					})),
				setIsTyping: (isTyping) =>
					set({ isTyping }),
				setSearchResults: (results) =>
					set({ searchResults: results }),
				setIsSearching: (isSearching) =>
					set({ isSearching }),
				clearSearch: () =>
					set({
						searchResults: [],
						isSearching: false,
					}),

				// Complex actions
				createNewChat: (initialMessage) => {
					const newChat: Chat = {
						id: Date.now().toString(),
						displayId: initialMessage
							? initialMessage.slice(0, 50) +
							  (initialMessage.length > 50
									? '...'
									: '')
							: 'New Chat',
						messages: [],
						createdAt: new Date().toISOString(),
						lastActivity:
							new Date().toISOString(),
						category: 'general',
					};

					set((state) => ({
						chats: [newChat, ...state.chats],
						activeChat: newChat.id,
						messages: [],
					}));

					// If there's an initial message, send it
					if (initialMessage) {
						get().sendMessage(initialMessage);
					}
				},

				sendMessage: async (text) => {
					const state = get();
					if (!state.activeChat) {
						// Create new chat if none exists
						get().createNewChat(text);
						return;
					}

					const userMessage: Message = {
						id: Date.now().toString(),
						type: 'prompt',
						text,
						timestamp:
							new Date().toLocaleTimeString(
								[],
								{
									hour: '2-digit',
									minute: '2-digit',
								}
							),
						status: 'sent',
					};

					// Add user message
					set((state) => ({
						messages: [
							...state.messages,
							userMessage,
						],
						isTyping: true,
					}));

					// Update chat with new message
					get().updateChat(state.activeChat!, {
						messages: [
							...state.messages,
							userMessage,
						],
						lastActivity:
							new Date().toISOString(),
					});

					try {
						// Get current chat for context-aware messaging
						const currentChat =
							state.chats.find(
								(chat) =>
									chat.id ===
									state.activeChat
							);

						// Build conversation history with proper context management
						const conversationHistory =
							buildConversationHistory(
								currentChat,
								text
							);

						// Call OpenRouter API with current model config and conversation history
						const aiResponse =
							await callOpenRouter(
								conversationHistory,
								state.modelConfig
							);

						const aiMessage: Message = {
							id: (Date.now() + 1).toString(),
							type: 'response',
							text: aiResponse,
							timestamp:
								new Date().toLocaleTimeString(
									[],
									{
										hour: '2-digit',
										minute: '2-digit',
									}
								),
							status: 'delivered',
						};

						const currentState = get();
						const updatedMessages =
							currentState.messages.map(
								(msg, index) =>
									index ===
										currentState
											.messages
											.length -
											1 &&
									msg.type === 'prompt'
										? {
												...msg,
												status: 'delivered' as const,
										  }
										: msg
							);

						const newMessages = [
							...updatedMessages,
							aiMessage,
						];

						set({
							messages: newMessages,
							isTyping: false,
						});

						// Update chat with AI response
						get().updateChat(
							currentState.activeChat!,
							{
								messages: newMessages,
								lastActivity:
									new Date().toISOString(),
							}
						);
					} catch (error) {
						console.error('Error:', error);

						// Create error message for user
						const errorMessage: Message = {
							id: (Date.now() + 2).toString(),
							type: 'response',
							text:
								error instanceof Error
									? `❌ **Error**: ${
											error.message
									  }\n\n${
											error.message.includes(
												'API key'
											)
												? '**Setup Required**: Please create a `.env` file in your project root with:\n```\nVITE_OPENROUTER_API_KEY=your_api_key_here\n```\n\nGet your API key from: https://openrouter.ai/keys'
												: 'Please check your internet connection and try again.'
									  }`
									: '❌ An unexpected error occurred. Please try again.',
							timestamp:
								new Date().toLocaleTimeString(
									[],
									{
										hour: '2-digit',
										minute: '2-digit',
									}
								),
							status: 'error',
						};

						const currentState = get();
						const newMessages = [
							...currentState.messages,
							errorMessage,
						];

						set({
							messages: newMessages,
							isTyping: false,
						});

						// Update chat with error message
						if (currentState.activeChat) {
							get().updateChat(
								currentState.activeChat,
								{
									messages: newMessages,
									lastActivity:
										new Date().toISOString(),
								}
							);
						}
					}
				},

				searchChats: (filters) => {
					set({ isSearching: true });

					// Simulate search (this would be replaced with actual search logic)
					setTimeout(() => {
						const state = get();
						const results: SearchResult[] =
							state.chats
								.filter(
									(chat) =>
										chat.displayId
											.toLowerCase()
											.includes(
												filters.query?.toLowerCase() ||
													''
											) ||
										chat.messages?.some(
											(msg) =>
												msg.text
													.toLowerCase()
													.includes(
														filters.query?.toLowerCase() ||
															''
													)
										)
								)
								.map((chat) => ({
									type: 'chat' as const,
									chat,
									matchedMessages:
										chat.messages?.filter(
											(msg) =>
												msg.text
													.toLowerCase()
													.includes(
														filters.query?.toLowerCase() ||
															''
													)
										) || [],
								}));

						set({
							searchResults: results,
							isSearching: false,
						});
					}, 500);
				},

				handleMessageAction: (
					action,
					messageId,
					data
				) => {
					const state = get();
					if (!state.activeChat) return;

					const updatedMessages = state.messages
						.map((msg) => {
							if (msg.id === messageId) {
								switch (action) {
									case 'copy':
										// Copy to clipboard (would be handled in UI)
										return msg;
									case 'edit':
										return {
											...msg,
											text:
												data ||
												msg.text,
											isEdited: true,
											originalText:
												msg.text,
										};
									case 'delete':
										// Mark as deleted or remove from array
										return null;
									case 'favorite':
										return {
											...msg,
											isFavorite:
												true,
										};
									case 'unfavorite':
										return {
											...msg,
											isFavorite:
												false,
										};
									default:
										return msg;
								}
							}
							return msg;
						})
						.filter(Boolean) as Message[];

					set({ messages: updatedMessages });

					// Update the chat with new messages
					get().updateChat(state.activeChat, {
						messages: updatedMessages,
					});
				},
			}),
			{
				name: 'chat-store',
				partialize: (state) => ({
					chats: state.chats,
					activeChat: state.activeChat,
					modelConfig: state.modelConfig,
				}),
			}
		),
		{
			name: 'chat-store',
		}
	)
);

// Performance selectors
export const useMessages = () =>
	useChatStore((state) => state.messages);
export const useChats = () =>
	useChatStore((state) => state.chats);
export const useActiveChat = () =>
	useChatStore((state) => state.activeChat);
export const useIsTyping = () =>
	useChatStore((state) => state.isTyping);
export const useSearchResults = () =>
	useChatStore((state) => state.searchResults);
export const useIsSearching = () =>
	useChatStore((state) => state.isSearching);

// Export model config selector
export const useModelConfig = () =>
	useChatStore((state) => state.modelConfig);
