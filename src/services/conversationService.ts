import { API_BASE_URL } from '../config';

export interface Conversation {
	id: string;
	userId: string;
	title: string;
	isArchived: boolean;
	isPinned: boolean;
	isFavorite: boolean;
	totalMessages: number;
	lastMessageAt?: string;
	createdAt: string;
	updatedAt: string;
	_count?: {
		messages: number;
	};
}

export interface Message {
	id: string;
	conversationId: string;
	role: 'user' | 'assistant';
	content: string;
	tokens?: number;
	model?: string;
	metadata?: unknown;
	createdAt: string;
}

export interface ConversationResponse {
	success: boolean;
	message?: string;
	data?: {
		conversation?: Conversation;
		conversations?: Conversation[];
	};
}

export interface MessageResponse {
	success: boolean;
	message?: string;
	data?: {
		message?: Message;
		messages?: Message[];
		pagination?: {
			currentPage: number;
			totalPages: number;
			totalMessages: number;
			hasMore: boolean;
		};
	};
}

class ConversationService {
	private getAuthToken(): string | null {
		return localStorage.getItem('authToken');
	}

	private getAuthHeaders() {
		const token = this.getAuthToken();
		return {
			'Content-Type': 'application/json',
			...(token && {
				Authorization: `Bearer ${token}`,
			}),
		};
	}

	/**
	 * Get all conversations for the current user
	 */
	async getConversations(): Promise<ConversationResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/conversations`,
				{
					method: 'GET',
					headers: this.getAuthHeaders(),
				}
			);

			const result: ConversationResponse =
				await response.json();
			return result;
		} catch (error) {
			console.error(
				'Get conversations error:',
				error
			);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Get a specific conversation with its messages
	 */
	async getConversation(
		conversationId: string
	): Promise<ConversationResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/conversations/${conversationId}`,
				{
					method: 'GET',
					headers: this.getAuthHeaders(),
				}
			);

			const result: ConversationResponse =
				await response.json();
			return result;
		} catch (error) {
			console.error('Get conversation error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Create a new conversation
	 */
	async createConversation(
		title?: string
	): Promise<ConversationResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/conversations`,
				{
					method: 'POST',
					headers: this.getAuthHeaders(),
					body: JSON.stringify({ title }),
				}
			);

			const result: ConversationResponse =
				await response.json();
			return result;
		} catch (error) {
			console.error(
				'Create conversation error:',
				error
			);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Update a conversation
	 */
	async updateConversation(
		conversationId: string,
		updates: Partial<
			Pick<
				Conversation,
				| 'title'
				| 'isArchived'
				| 'isPinned'
				| 'isFavorite'
			>
		>
	): Promise<ConversationResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/conversations/${conversationId}`,
				{
					method: 'PUT',
					headers: this.getAuthHeaders(),
					body: JSON.stringify(updates),
				}
			);

			const result: ConversationResponse =
				await response.json();
			return result;
		} catch (error) {
			console.error(
				'Update conversation error:',
				error
			);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Delete a conversation
	 */
	async deleteConversation(
		conversationId: string
	): Promise<ConversationResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/conversations/${conversationId}`,
				{
					method: 'DELETE',
					headers: this.getAuthHeaders(),
				}
			);

			const result: ConversationResponse =
				await response.json();
			return result;
		} catch (error) {
			console.error(
				'Delete conversation error:',
				error
			);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Get messages for a conversation
	 */
	async getMessages(
		conversationId: string,
		page = 1,
		limit = 50
	): Promise<MessageResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/messages/conversation/${conversationId}?page=${page}&limit=${limit}`,
				{
					method: 'GET',
					headers: this.getAuthHeaders(),
				}
			);

			const result: MessageResponse =
				await response.json();
			return result;
		} catch (error) {
			console.error('Get messages error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Add a message to a conversation
	 */
	async addMessage(
		conversationId: string,
		role: 'user' | 'assistant',
		content: string,
		tokens?: number,
		model?: string,
		metadata?: unknown
	): Promise<MessageResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/messages/conversation/${conversationId}`,
				{
					method: 'POST',
					headers: this.getAuthHeaders(),
					body: JSON.stringify({
						role,
						content,
						tokens,
						model,
						metadata,
					}),
				}
			);

			const result: MessageResponse =
				await response.json();
			return result;
		} catch (error) {
			console.error('Add message error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Delete a message
	 */
	async deleteMessage(
		messageId: string
	): Promise<MessageResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/messages/${messageId}`,
				{
					method: 'DELETE',
					headers: this.getAuthHeaders(),
				}
			);

			const result: MessageResponse =
				await response.json();
			return result;
		} catch (error) {
			console.error('Delete message error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Search messages across all conversations
	 */
	async searchMessages(
		query: string,
		page = 1,
		limit = 20
	): Promise<MessageResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/messages/search?query=${encodeURIComponent(
					query
				)}&page=${page}&limit=${limit}`,
				{
					method: 'GET',
					headers: this.getAuthHeaders(),
				}
			);

			const result: MessageResponse =
				await response.json();
			return result;
		} catch (error) {
			console.error('Search messages error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}
}

export const conversationService =
	new ConversationService();
