import type { Chat, Message } from '../types';

// Available OpenRouter models - All FREE
export const OPENROUTER_MODELS = {
	GEMINI_2_FLASH_FREE: 'google/gemini-2.0-flash-exp:free',
	LLAMA_3_8B_GROQ: 'meta-llama/llama-3-8b-instruct',
	LLAMA_3_70B_GROQ: 'meta-llama/llama-3-70b-instruct',
	LLAMA_3_1_8B_FREE:
		'meta-llama/llama-3.1-8b-instruct:free',
	QWEN_2_5_7B_FREE: 'qwen/qwen-2.5-7b-instruct:free',
} as const;

export type OpenRouterModel =
	(typeof OPENROUTER_MODELS)[keyof typeof OPENROUTER_MODELS];

export interface OpenRouterConfig {
	model: OpenRouterModel;
	max_tokens?: number;
	temperature?: number;
	top_p?: number;
	stream?: boolean;
}

// Default configuration
export const DEFAULT_CONFIG: OpenRouterConfig = {
	model: OPENROUTER_MODELS.GEMINI_2_FLASH_FREE,
	max_tokens: 1000,
	temperature: 0.7,
	top_p: 0.9,
};

// Context-aware memory configuration
const CONTEXT_CONFIG = {
	MAX_TOKENS: 8000, // Conservative limit for context window
	RESERVE_FOR_RESPONSE: 1000, // Reserve tokens for AI response
	CHARS_PER_TOKEN: 4, // Approximate character to token ratio
	MIN_MESSAGES: 2, // Minimum messages to include
	MAX_MESSAGES: 50, // Maximum messages to prevent infinite loops
};

/**
 * Estimates token count from text (simple approximation)
 */
function estimateTokens(text: string): number {
	return Math.ceil(
		text.length / CONTEXT_CONFIG.CHARS_PER_TOKEN
	);
}

/**
 * Converts app messages to OpenRouter API format
 */
function convertToApiMessage(message: Message): {
	role: 'user' | 'assistant';
	content: string;
} {
	return {
		role:
			message.type === 'prompt'
				? 'user'
				: 'assistant',
		content: message.text,
	};
}

/**
 * Builds context-aware conversation history with smart token management
 * Following the "memory facade" pattern from the tutorials
 */
export function buildConversationHistory(
	currentChat: Chat | undefined,
	newMessage: string
): Array<{
	role: 'user' | 'assistant' | 'system';
	content: string;
}> {
	const messages: Array<{
		role: 'user' | 'assistant' | 'system';
		content: string;
	}> = [];

	// Add system message for context awareness
	const systemMessage = {
		role: 'system' as const,
		content: `You are a helpful AI assistant. You have memory of our previous conversation in this chat. Use this context to provide relevant, personalized responses. If the user refers to something from earlier in our conversation, acknowledge and build upon that context.`,
	};
	messages.push(systemMessage);

	// Calculate available tokens for conversation history
	const availableTokens =
		CONTEXT_CONFIG.MAX_TOKENS -
		CONTEXT_CONFIG.RESERVE_FOR_RESPONSE;
	const systemTokens = estimateTokens(
		systemMessage.content
	);
	const newMessageTokens = estimateTokens(newMessage);
	const remainingTokens =
		availableTokens - systemTokens - newMessageTokens;

	// Get conversation history from current chat
	if (currentChat && currentChat.messages.length > 0) {
		// Work backwards from most recent messages
		const chatMessages = [
			...currentChat.messages,
		].reverse();
		let tokenCount = 0;
		const selectedMessages: Message[] = [];

		for (const message of chatMessages) {
			const messageTokens = estimateTokens(
				message.text
			);

			// Stop if adding this message would exceed token limit
			if (
				tokenCount + messageTokens >
				remainingTokens
			) {
				break;
			}

			// Stop if we've reached maximum message limit
			if (
				selectedMessages.length >=
				CONTEXT_CONFIG.MAX_MESSAGES
			) {
				break;
			}

			selectedMessages.unshift(message); // Add to beginning to maintain order
			tokenCount += messageTokens;
		}

		// Ensure we have at least minimum messages if possible
		if (
			selectedMessages.length <
				CONTEXT_CONFIG.MIN_MESSAGES &&
			chatMessages.length >=
				CONTEXT_CONFIG.MIN_MESSAGES
		) {
			// Take the last few messages regardless of token count for minimal context
			const minMessages = chatMessages.slice(
				-CONTEXT_CONFIG.MIN_MESSAGES
			);
			selectedMessages.splice(
				0,
				selectedMessages.length,
				...minMessages
			);
		}

		// Convert to API format
		const historyMessages = selectedMessages.map(
			convertToApiMessage
		);
		messages.push(...historyMessages);
	}

	// Add the new user message
	messages.push({
		role: 'user',
		content: newMessage,
	});

	return messages;
}

/**
 * DEPRECATED: Old memory function - kept for backward compatibility but should not be used
 * @deprecated Use buildConversationHistory instead
 */
export function getAIMemory(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_chats: Chat[],
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_currentChatId: string | null
): string {
	// Return empty string to disable old broken implementation
	return '';
}

/**
 * DEPRECATED: Old context formatting function
 * @deprecated Use buildConversationHistory instead
 */
export function formatContextAwareMessage(
	memory: string | null,
	currentMessage: string
): string {
	// Just return the current message to avoid breaking existing code
	return currentMessage;
}

/**
 * Enhanced API call with proper conversation history
 */
export async function callOpenRouter(
	messageOrMessages:
		| string
		| Array<{
				role: 'user' | 'assistant' | 'system';
				content: string;
		  }>,
	config: Partial<OpenRouterConfig> = {}
): Promise<string> {
	const API_URL =
		'https://openrouter.ai/api/v1/chat/completions';
	const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

	if (
		!API_KEY ||
		API_KEY === 'your_openrouter_api_key_here'
	) {
		throw new Error(
			'OpenRouter API key is not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.'
		);
	}

	const finalConfig = { ...DEFAULT_CONFIG, ...config };

	// Handle both old string format and new messages array format
	const messages =
		typeof messageOrMessages === 'string'
			? [
					{
						role: 'user' as const,
						content: messageOrMessages,
					},
			  ]
			: messageOrMessages;

	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				'HTTP-Referer': window.location.origin,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: finalConfig.model,
				messages: messages,
				max_tokens: finalConfig.max_tokens,
				temperature: finalConfig.temperature,
				top_p: finalConfig.top_p,
				stream: finalConfig.stream || false,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();

			let errorMessage = `OpenRouter API error (${response.status}): ${response.statusText}`;

			try {
				const errorData = JSON.parse(errorText);
				if (errorData.error?.message) {
					errorMessage = `OpenRouter API error: ${errorData.error.message}`;
				}
			} catch {
				// If we can't parse the error as JSON, use the raw text
				if (errorText) {
					errorMessage = `OpenRouter API error: ${errorText}`;
				}
			}

			throw new Error(errorMessage);
		}

		const data = await response.json();

		if (
			!data.choices ||
			!data.choices[0] ||
			!data.choices[0].message
		) {
			throw new Error(
				'Invalid response format from OpenRouter API'
			);
		}

		const content =
			data.choices[0].message.content.trim();
		return content;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error(
			'Unknown error occurred while calling OpenRouter API'
		);
	}
}
