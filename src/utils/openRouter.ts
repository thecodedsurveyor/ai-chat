import type { Chat, Message, AIPersona } from '../types';
import type { UploadedDocument } from '../stores/documentStore';

// Available OpenRouter models - All FREE
export const OPENROUTER_MODELS = {
	DEEPSEEK_R1T_CHIMERA_FREE:
		'tngtech/deepseek-r1t-chimera:free',
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

// Default configuration - optimized for speed
export const DEFAULT_CONFIG: OpenRouterConfig = {
	model: OPENROUTER_MODELS.DEEPSEEK_R1T_CHIMERA_FREE,
	max_tokens: 750, // Reduced for faster responses
	temperature: 0.7,
	top_p: 0.9,
};

// Fast response configuration for quick queries
export const FAST_CONFIG: OpenRouterConfig = {
	model: OPENROUTER_MODELS.LLAMA_3_8B_GROQ, // Faster model
	max_tokens: 500,
	temperature: 0.5, // Lower for more focused responses
	top_p: 0.8,
};

// Context-aware memory configuration - optimized for speed
const CONTEXT_CONFIG = {
	MAX_TOKENS: 6000, // Reduced from 8000 for faster processing
	RESERVE_FOR_RESPONSE: 750, // Matches max_tokens
	CHARS_PER_TOKEN: 4, // Approximate character to token ratio
	MIN_MESSAGES: 2, // Minimum messages to include
	MAX_MESSAGES: 20, // Reduced from 50 for faster processing
};

// Performance optimization: Faster models for specific use cases
export const FAST_MODELS = {
	QUICK_RESPONSES: OPENROUTER_MODELS.LLAMA_3_8B_GROQ,
	CODE_ANALYSIS: OPENROUTER_MODELS.LLAMA_3_8B_GROQ,
	SIMPLE_QUESTIONS: OPENROUTER_MODELS.LLAMA_3_8B_GROQ,
	COMPLEX_REASONING:
		OPENROUTER_MODELS.DEEPSEEK_R1T_CHIMERA_FREE,
	CREATIVE_WRITING: OPENROUTER_MODELS.LLAMA_3_1_8B_FREE, // Fixed model name
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
	newMessage: string,
	persona?: AIPersona | null,
	activeDocument?: UploadedDocument | null
): Array<{
	role: 'user' | 'assistant' | 'system';
	content: string;
}> {
	const messages: Array<{
		role: 'user' | 'assistant' | 'system';
		content: string;
	}> = [];

	// Add system message - use persona if available, otherwise default
	let systemContent =
		persona?.systemPrompt ||
		`You are a helpful AI assistant. You have memory of our previous conversation in this chat. Use this context to provide relevant, personalized responses. If the user refers to something from earlier in our conversation, acknowledge and build upon that context.`;

	// Add document context if available
	if (activeDocument) {
		systemContent += `\n\nIMPORTANT: The user has uploaded a document "${activeDocument.name}" for analysis. Here is the content of the document:\n\n--- DOCUMENT CONTENT ---\n${activeDocument.content}\n--- END DOCUMENT CONTENT ---\n\nWhen answering questions, prioritize information from this document. If the user asks questions about the document content, refer to it directly and provide accurate information based on what's in the document.`;
	}

	const systemMessage = {
		role: 'system' as const,
		content: systemContent,
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
 * Enhanced API call with streaming support for faster responses
 */
export async function callOpenRouter(
	messageOrMessages:
		| string
		| Array<{
				role: 'user' | 'assistant' | 'system';
				content: string;
		  }>,
	config: Partial<OpenRouterConfig> = {},
	onToken?: (token: string) => void
): Promise<string> {
	const API_URL =
		'https://openrouter.ai/api/v1/chat/completions';
	const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

	// More comprehensive API key validation
	if (!API_KEY) {
		throw new Error(
			'OpenRouter API key is missing. Please set VITE_OPENROUTER_API_KEY in your .env file. Make sure to restart your development server after adding the API key.'
		);
	}

	if (API_KEY === 'your_openrouter_api_key_here') {
		throw new Error(
			'OpenRouter API key is not configured. Please replace "your_openrouter_api_key_here" with your actual OpenRouter API key in your .env file. Get your API key from: https://openrouter.ai/keys'
		);
	}

	if (API_KEY.length < 10) {
		throw new Error(
			'OpenRouter API key appears to be invalid (too short). Please check your API key in the .env file. Get your API key from: https://openrouter.ai/keys'
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

	// Enable streaming if onToken callback is provided
	const shouldStream = !!onToken;

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
				stream: shouldStream,
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

			// Add more specific error guidance based on status codes
			if (response.status === 401) {
				errorMessage +=
					'\n\n🔑 Authentication failed. Please check:\n1. Your OpenRouter API key is correct\n2. The API key is properly set in your .env file\n3. You have restarted your development server\n4. Get a new API key from: https://openrouter.ai/keys';
			} else if (response.status === 403) {
				errorMessage +=
					'\n\n🚫 Access forbidden. Your API key may not have permission to use this model.';
			} else if (response.status === 429) {
				errorMessage +=
					'\n\n⏰ Rate limit exceeded. Please wait a moment before trying again.';
			} else if (response.status >= 500) {
				errorMessage +=
					'\n\n🛠️ OpenRouter server error. Please try again in a few moments.';
			}

			throw new Error(errorMessage);
		}

		// Handle streaming response
		if (shouldStream && response.body) {
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let content = '';

			try {
				while (true) {
					const { done, value } =
						await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, {
						stream: true,
					});
					const lines = chunk.split('\n');

					for (const line of lines) {
						if (line.startsWith('data: ')) {
							const data = line.slice(6);

							if (data === '[DONE]') {
								return content;
							}

							try {
								const parsed =
									JSON.parse(data);
								const delta =
									parsed.choices?.[0]
										?.delta?.content;

								if (delta) {
									content += delta;
									onToken(delta);
								}
							} catch {
								// Skip invalid JSON lines
								continue;
							}
						}
					}
				}
			} finally {
				reader.releaseLock();
			}

			return content;
		}

		// Handle non-streaming response (fallback)
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

/**
 * Suggests the optimal model based on query characteristics for faster responses
 */
export function suggestOptimalModel(
	query: string
): OpenRouterModel {
	const lowercaseQuery = query.toLowerCase();

	// Short queries (< 50 chars) - use fastest model
	if (query.length < 50) {
		return FAST_MODELS.QUICK_RESPONSES;
	}

	// Code-related queries
	if (
		lowercaseQuery.includes('code') ||
		lowercaseQuery.includes('function') ||
		lowercaseQuery.includes('debug') ||
		lowercaseQuery.includes('programming')
	) {
		return FAST_MODELS.CODE_ANALYSIS;
	}

	// Simple question patterns
	if (
		lowercaseQuery.startsWith('what') ||
		lowercaseQuery.startsWith('how') ||
		lowercaseQuery.startsWith('why') ||
		lowercaseQuery.startsWith('when') ||
		lowercaseQuery.startsWith('where')
	) {
		return FAST_MODELS.SIMPLE_QUESTIONS;
	}

	// Creative tasks
	if (
		lowercaseQuery.includes('write') ||
		lowercaseQuery.includes('create') ||
		lowercaseQuery.includes('story') ||
		lowercaseQuery.includes('poem')
	) {
		return FAST_MODELS.CREATIVE_WRITING;
	}

	// Default to balanced model for complex queries
	return FAST_MODELS.COMPLEX_REASONING;
}

/**
 * Get optimized config based on query type
 */
export function getOptimizedConfig(
	query: string
): OpenRouterConfig {
	const suggestedModel = suggestOptimalModel(query);

	// Fast config for simple queries
	if (query.length < 100) {
		return {
			...FAST_CONFIG,
			model: suggestedModel,
			max_tokens: 300, // Even shorter for quick responses
		};
	}

	// Standard optimized config
	return {
		...DEFAULT_CONFIG,
		model: suggestedModel,
	};
}
