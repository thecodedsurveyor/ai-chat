import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
	Message,
	Chat,
	SearchFilters,
	SearchResult,
	AIPersona,
} from '../types';
import {
	callOpenRouter,
	DEFAULT_CONFIG,
	type OpenRouterConfig,
	buildConversationHistory,
} from '../utils/openRouter';
import { generatePersonaGreeting } from '../utils/aiPersonas';
import { useDocumentStore } from './documentStore';
import { authService } from '../services/authService';

// Helper function to get user-specific storage key
const getUserStorageKey = () => {
	const user = authService.getUser();
	if (user?.id) {
		return `chat-store-user-${user.id}`;
	}
	// For guest users, use a session-specific key
	let guestId = localStorage.getItem('guest-session-id');
	if (!guestId) {
		guestId = `guest-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;
		localStorage.setItem('guest-session-id', guestId);
	}
	return `chat-store-${guestId}`;
};

// Helper function to clear guest data when user registers/logs in
const clearGuestDataOnAuth = () => {
	const guestId = localStorage.getItem(
		'guest-session-id'
	);
	if (guestId) {
		const guestStorageKey = `chat-store-${guestId}`;
		localStorage.removeItem(guestStorageKey);
		localStorage.removeItem('guest-session-id');
	}
};

interface ChatState {
	// Chat data state
	messages: Message[];
	chats: Chat[];
	activeChat: string | null;
	isTyping: boolean;
	searchResults: SearchResult[];
	isSearching: boolean;
	activePersona: AIPersona | null;

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
	setActivePersona: (persona: AIPersona | null) => void;
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
		messageId: string
	) => void;

	// User management
	clearAllData: () => void;
	migrateGuestDataToUser: () => void;
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
				activePersona: null,
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
				setActivePersona: (persona) => {
					const state = get();
					set({ activePersona: persona });

					if (persona && state.activeChat) {
						// Create persona greeting as AI response
						const greetingMessage: Message = {
							id: Date.now().toString(),
							type: 'response',
							text: generatePersonaGreeting(
								persona
							),
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

						// Add greeting message
						const updatedMessages = [
							...state.messages,
							greetingMessage,
						];
						set({ messages: updatedMessages });

						// Update chat with new message
						get().updateChat(state.activeChat, {
							messages: updatedMessages,
							persona: persona,
						});
					} else if (
						persona &&
						!state.activeChat
					) {
						// Create new chat if none exists
						get().createNewChat();

						// Add greeting after chat creation
						setTimeout(() => {
							const greetingMessage: Message =
								{
									id: Date.now().toString(),
									type: 'response',
									text: generatePersonaGreeting(
										persona
									),
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
							const updatedMessages = [
								...currentState.messages,
								greetingMessage,
							];
							set({
								messages: updatedMessages,
							});

							if (currentState.activeChat) {
								get().updateChat(
									currentState.activeChat,
									{
										messages:
											updatedMessages,
										persona: persona,
									}
								);
							}
						}, 100);
					}
				},
				deleteChat: (chatId) =>
					set((state) => {
						const updatedChats =
							state.chats.filter(
								(chat) => chat.id !== chatId
							);
						const newActiveChat =
							state.activeChat === chatId
								? updatedChats.length > 0
									? updatedChats[0].id
									: null
								: state.activeChat;

						return {
							chats: updatedChats,
							activeChat: newActiveChat,
							messages:
								newActiveChat ===
								state.activeChat
									? state.messages
									: updatedChats.find(
											(c) =>
												c.id ===
												newActiveChat
									  )?.messages || [],
						};
					}),

				updateChat: (chatId, updates) =>
					set((state) => ({
						chats: state.chats.map((chat) =>
							chat.id === chatId
								? { ...chat, ...updates }
								: chat
						),
					})),

				setIsTyping: (isTyping) =>
					set({ isTyping }),
				setSearchResults: (searchResults) =>
					set({ searchResults }),
				setIsSearching: (isSearching) =>
					set({ isSearching }),
				clearSearch: () =>
					set({
						searchResults: [],
						isSearching: false,
					}),

				createNewChat: (
					initialMessage?: string
				) => {
					const state = get();
					const newChatId = `chat-${Date.now()}`;
					const newChat: Chat = {
						id: newChatId,
						displayId: `Chat ${
							state.chats.length + 1
						}`,
						messages: [],
						createdAt: new Date().toISOString(),
						lastActivity:
							new Date().toISOString(),
						totalMessages: 0,
					};

					const updatedChats = [
						newChat,
						...state.chats,
					];
					set({
						chats: updatedChats,
						activeChat: newChatId,
						messages: [],
					});

					// Send initial message if provided
					if (initialMessage) {
						setTimeout(() => {
							get().sendMessage(
								initialMessage
							);
						}, 100);
					}
				},

				sendMessage: async (text: string) => {
					const state = get();
					if (!state.activeChat) return;

					// Add user message
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

					const messagesWithUser = [
						...state.messages,
						userMessage,
					];
					set({
						messages: messagesWithUser,
						isTyping: true,
					});

					// Update chat with user message
					get().updateChat(state.activeChat, {
						messages: messagesWithUser,
						lastActivity:
							new Date().toISOString(),
						totalMessages:
							messagesWithUser.length,
					});

					// Just show typing indicator first, don't add empty message yet
					set({
						messages: messagesWithUser,
						isTyping: true,
					});

					// Prepare AI message ID for when streaming starts
					const aiMessageId = (
						Date.now() + 1
					).toString();

					try {
						// Get active document if available
						const documentStore =
							useDocumentStore.getState();
						const activeDocument =
							documentStore.activeDocument;

						// Build conversation history for API
						const currentChat =
							state.chats.find(
								(c) =>
									c.id ===
									state.activeChat
							);
						const conversationHistory =
							buildConversationHistory(
								currentChat,
								text,
								state.activePersona,
								activeDocument
							);

						// Get optimized config for faster responses
						const { getOptimizedConfig } =
							await import(
								'../utils/openRouter'
							);
						const optimizedConfig = {
							...state.modelConfig,
							...getOptimizedConfig(text),
							stream: true, // Enable streaming
						};

						// Call API with streaming
						let isFirstToken = true;
						const response =
							await callOpenRouter(
								conversationHistory,
								optimizedConfig,
								(token: string) => {
									// On first token: stop typing indicator and create AI message
									if (isFirstToken) {
										isFirstToken =
											false;
										const initialAiMessage: Message =
											{
												id: aiMessageId,
												type: 'response',
												text: token,
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

										const currentState =
											get();
										set({
											messages: [
												...currentState.messages,
												initialAiMessage,
											],
											isTyping: false,
										});
									} else {
										// Update the AI message with each subsequent token
										const currentState =
											get();
										const updatedMessages =
											currentState.messages.map(
												(msg) =>
													msg.id ===
													aiMessageId
														? {
																...msg,
																text:
																	msg.text +
																	token,
														  }
														: msg
											);
										set({
											messages:
												updatedMessages,
										});
									}
								}
							);

						// Final update with complete response
						const currentState = get();
						const finalMessages =
							currentState.messages.map(
								(msg) =>
									msg.id === aiMessageId
										? {
												...msg,
												text: response,
												status: 'delivered' as const,
										  }
										: msg
							);

						set({
							messages: finalMessages,
							isTyping: false,
						});

						// Update chat with final AI response
						get().updateChat(state.activeChat, {
							messages: finalMessages,
							lastActivity:
								new Date().toISOString(),
							totalMessages:
								finalMessages.length,
						});
					} catch (error) {
						// Handle error
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
											) ||
											error.message.includes(
												'auth credentials'
											)
												? '**🔧 Setup Required**: \n\n1. Create a `.env` file in your project root\n2. Add your OpenRouter API key:\n```\nVITE_OPENROUTER_API_KEY=your_actual_api_key_here\n```\n3. Get your API key from: https://openrouter.ai/keys\n4. Restart your development server\n\n📖 **Need help?** Check the `ENV_SETUP.md` file for detailed instructions.'
												: error.message.includes(
														'Rate limit'
												  )
												? '**⏰ Rate Limited**: Please wait a moment before sending another message.'
												: error.message.includes(
														'server error'
												  )
												? '**🛠️ Server Error**: OpenRouter is experiencing issues. Please try again in a few moments.'
												: '**🌐 Connection Error**: Please check your internet connection and try again.'
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

						// Remove the incomplete AI message and add error message
						const currentState = get();
						const messagesWithoutIncomplete =
							currentState.messages.filter(
								(msg) =>
									msg.id !== aiMessageId
							);
						const newMessages = [
							...messagesWithoutIncomplete,
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
					messageId
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

				// User management functions
				clearAllData: () => {
					set({
						messages: [],
						chats: [],
						activeChat: null,
						searchResults: [],
						isSearching: false,
						activePersona: null,
						modelConfig: DEFAULT_CONFIG,
					});
				},

				migrateGuestDataToUser: () => {
					const guestId = localStorage.getItem(
						'guest-session-id'
					);
					if (
						guestId &&
						authService.isAuthenticated()
					) {
						const guestStorageKey = `chat-store-${guestId}`;
						const guestData =
							localStorage.getItem(
								guestStorageKey
							);

						if (guestData) {
							try {
								const parsedData =
									JSON.parse(guestData);
								// Set the guest data as initial data for the authenticated user
								set({
									chats:
										parsedData.state
											?.chats || [],
									activeChat:
										parsedData.state
											?.activeChat ||
										null,
									modelConfig:
										parsedData.state
											?.modelConfig ||
										DEFAULT_CONFIG,
								});
							} catch (error) {
								console.error(
									'Error migrating guest data:',
									error
								);
							}
						}

						// Clean up guest data
						clearGuestDataOnAuth();
					}
				},
			}),
			{
				name: getUserStorageKey(),
				partialize: (state) => ({
					chats: state.chats,
					activeChat: state.activeChat,
					modelConfig: state.modelConfig,
				}),
				onRehydrateStorage: () => (state) => {
					// Clear messages on rehydration since they're stored in chat objects
					if (state) {
						state.messages = [];
						state.searchResults = [];
						state.isSearching = false;
						state.isTyping = false;
					}
				},
			}
		),
		{
			name: 'chat-store',
		}
	)
);

// Selector hooks for easier usage
export const useMessages = () =>
	useChatStore((state) => state.messages);
export const useChats = () =>
	useChatStore((state) => state.chats);
export const useActiveChat = () =>
	useChatStore((state) => state.activeChat);
export const useActivePersona = () =>
	useChatStore((state) => state.activePersona);
export const useIsTyping = () =>
	useChatStore((state) => state.isTyping);
export const useSearchResults = () =>
	useChatStore((state) => state.searchResults);
export const useIsSearching = () =>
	useChatStore((state) => state.isSearching);

// Export model config selector
export const useModelConfig = () =>
	useChatStore((state) => state.modelConfig);
