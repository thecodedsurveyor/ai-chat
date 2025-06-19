import type {
	Message,
	Chat,
	MemoryContext,
	ConversationSummary,
	SmartMemoryState,
} from '../types';

/**
 * Smart Memory System for maintaining conversation context and continuity
 */
export class SmartMemory {
	private static readonly MAX_MEMORY_ENTRIES = 1000;
	private static readonly CONTEXT_RELEVANCE_THRESHOLD = 0.3;

	/**
	 * Extracts memory contexts from a message
	 */
	static extractMemoryFromMessage(
		message: Message,
		chatId: string
	): MemoryContext[] {
		const contexts: MemoryContext[] = [];

		// Extract user preferences
		const preferences = this.extractUserPreferences(
			message.text
		);
		if (preferences.length > 0) {
			contexts.push(
				...preferences.map((pref) =>
					this.createMemoryContext(
						chatId,
						'user_preference',
						pref.content,
						pref.keywords,
						0.8
					)
				)
			);
		}

		// Extract important facts
		const facts = this.extractImportantFacts(
			message.text
		);
		if (facts.length > 0) {
			contexts.push(
				...facts.map((fact) =>
					this.createMemoryContext(
						chatId,
						'important_fact',
						fact.content,
						fact.keywords,
						0.7
					)
				)
			);
		}

		// Extract conversation context
		if (message.type === 'prompt') {
			const contextInfo =
				this.extractConversationContext(
					message.text
				);
			if (contextInfo) {
				contexts.push(
					this.createMemoryContext(
						chatId,
						'conversation_context',
						contextInfo.content,
						contextInfo.keywords,
						0.6
					)
				);
			}
		}

		return contexts;
	}

	/**
	 * Extracts user preferences from message text
	 */
	private static extractUserPreferences(
		text: string
	): Array<{
		content: string;
		keywords: string[];
	}> {
		const preferences: Array<{
			content: string;
			keywords: string[];
		}> = [];

		const preferencePatterns = [
			/i (prefer|like|love|enjoy|favor|choose)\s+([^.!?]+)/gi,
			/my (preference|choice|style|approach) is\s+([^.!?]+)/gi,
			/i (don't like|dislike|hate|avoid)\s+([^.!?]+)/gi,
			/i'm (interested in|into|passionate about)\s+([^.!?]+)/gi,
			/i (work with|use|specialize in)\s+([^.!?]+)/gi,
		];

		preferencePatterns.forEach((pattern) => {
			let match;
			while ((match = pattern.exec(text)) !== null) {
				const content = match[0];
				const keywords =
					this.extractKeywords(content);
				if (keywords.length > 0) {
					preferences.push({ content, keywords });
				}
			}
		});

		return preferences;
	}

	/**
	 * Extracts important facts from message text
	 */
	private static extractImportantFacts(
		text: string
	): Array<{
		content: string;
		keywords: string[];
	}> {
		const facts: Array<{
			content: string;
			keywords: string[];
		}> = [];

		const factPatterns = [
			/the (answer|solution|result) is\s+([^.!?]+)/gi,
			/(remember|note|important):\s*([^.!?]+)/gi,
			/you (need|should|must)\s+([^.!?]+)/gi,
			/the (key|main|primary) (point|thing|factor) is\s+([^.!?]+)/gi,
		];

		factPatterns.forEach((pattern) => {
			let match;
			while ((match = pattern.exec(text)) !== null) {
				const content = match[0];
				const keywords =
					this.extractKeywords(content);
				if (keywords.length > 0) {
					facts.push({ content, keywords });
				}
			}
		});

		return facts;
	}

	/**
	 * Extracts conversation context
	 */
	private static extractConversationContext(
		text: string
	): {
		content: string;
		keywords: string[];
	} | null {
		const contextPatterns = [
			/i'm (working on|building|creating|developing)\s+([^.!?]+)/gi,
			/i need help with\s+([^.!?]+)/gi,
			/i'm trying to\s+([^.!?]+)/gi,
			/my (project|task|goal) is\s+([^.!?]+)/gi,
		];

		for (const pattern of contextPatterns) {
			const match = pattern.exec(text);
			if (match) {
				const content = match[0];
				const keywords =
					this.extractKeywords(content);
				if (keywords.length > 0) {
					return { content, keywords };
				}
			}
		}

		return null;
	}

	/**
	 * Extracts keywords from text
	 */
	private static extractKeywords(text: string): string[] {
		const stopWords = new Set([
			'i',
			'me',
			'my',
			'myself',
			'we',
			'our',
			'ours',
			'ourselves',
			'you',
			'your',
			'yours',
			'yourself',
			'yourselves',
			'he',
			'him',
			'his',
			'himself',
			'she',
			'her',
			'hers',
			'herself',
			'it',
			'its',
			'itself',
			'they',
			'them',
			'their',
			'theirs',
			'themselves',
			'what',
			'which',
			'who',
			'whom',
			'this',
			'that',
			'these',
			'those',
			'am',
			'is',
			'are',
			'was',
			'were',
			'be',
			'been',
			'being',
			'have',
			'has',
			'had',
			'having',
			'do',
			'does',
			'did',
			'doing',
			'a',
			'an',
			'the',
			'and',
			'but',
			'if',
			'or',
			'because',
			'as',
			'until',
			'while',
			'of',
			'at',
			'by',
			'for',
			'with',
			'about',
			'against',
			'between',
			'into',
			'through',
			'during',
			'before',
			'after',
			'above',
			'below',
			'up',
			'down',
			'in',
			'out',
			'on',
			'off',
			'over',
			'under',
			'again',
			'further',
			'then',
			'once',
		]);

		return text
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.split(/\s+/)
			.filter(
				(word) =>
					word.length > 2 && !stopWords.has(word)
			)
			.slice(0, 10); // Limit to top 10 keywords
	}

	/**
	 * Creates a memory context object
	 */
	private static createMemoryContext(
		chatId: string,
		type: MemoryContext['type'],
		content: string,
		keywords: string[],
		relevanceScore: number
	): MemoryContext {
		return {
			id: this.generateMemoryId(),
			chatId,
			type,
			content,
			keywords,
			relevanceScore,
			lastUpdated: new Date().toISOString(),
		};
	}

	/**
	 * Finds relevant memory contexts for a new message
	 */
	static findRelevantContext(
		message: Message,
		memoryState: SmartMemoryState
	): MemoryContext[] {
		const messageKeywords = this.extractKeywords(
			message.text
		);

		return memoryState.contextMemory
			.filter((context) => {
				// Calculate relevance based on keyword overlap
				const commonKeywords =
					context.keywords.filter((keyword) =>
						messageKeywords.some(
							(msgKeyword) =>
								msgKeyword.includes(
									keyword
								) ||
								keyword.includes(msgKeyword)
						)
					);

				const relevance =
					commonKeywords.length /
					Math.max(context.keywords.length, 1);
				return (
					relevance >=
					this.CONTEXT_RELEVANCE_THRESHOLD
				);
			})
			.sort(
				(a, b) =>
					b.relevanceScore - a.relevanceScore
			)
			.slice(0, 5); // Limit to top 5 most relevant contexts
	}

	/**
	 * Creates a conversation summary
	 */
	static createConversationSummary(
		chat: Chat,
		startIndex: number = 0,
		endIndex?: number
	): ConversationSummary {
		const messages = chat.messages.slice(
			startIndex,
			endIndex
		);

		const keyTopics =
			this.extractTopicsFromMessages(messages);
		const importantPoints =
			this.extractImportantPoints(messages);
		const decisions = this.extractDecisions(messages);
		const followUps = this.extractFollowUps(messages);

		const summary = this.generateSummaryText(
			messages,
			keyTopics,
			importantPoints
		);

		return {
			id: this.generateSummaryId(),
			chatId: chat.id,
			summary,
			keyTopics,
			importantPoints,
			decisions,
			followUps,
			createdAt: new Date().toISOString(),
			messageRange: {
				startId: messages[0]?.id || '',
				endId:
					messages[messages.length - 1]?.id || '',
				count: messages.length,
			},
		};
	}

	/**
	 * Extracts main topics from messages
	 */
	private static extractTopicsFromMessages(
		messages: Message[]
	): string[] {
		const allKeywords = messages.flatMap((msg) =>
			this.extractKeywords(msg.text)
		);
		const keywordCounts: Record<string, number> = {};

		allKeywords.forEach((keyword) => {
			keywordCounts[keyword] =
				(keywordCounts[keyword] || 0) + 1;
		});

		return Object.entries(keywordCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)
			.map(([keyword]) => keyword);
	}

	/**
	 * Extracts important points from messages
	 */
	private static extractImportantPoints(
		messages: Message[]
	): string[] {
		const points: string[] = [];

		messages.forEach((message) => {
			const text = message.text;

			// Look for sentences with importance indicators
			const sentences = text.split(/[.!?]+/);
			sentences.forEach((sentence) => {
				const lower = sentence.toLowerCase();
				if (
					lower.includes('important') ||
					lower.includes('key') ||
					lower.includes('remember') ||
					lower.includes('note') ||
					lower.includes('crucial') ||
					lower.includes('essential')
				) {
					points.push(sentence.trim());
				}
			});
		});

		return points.slice(0, 10);
	}

	/**
	 * Extracts decisions from messages
	 */
	private static extractDecisions(
		messages: Message[]
	): string[] {
		const decisions: string[] = [];

		messages.forEach((message) => {
			const text = message.text;
			const decisionPatterns = [
				/we (decided|agreed|chose) to\s+([^.!?]+)/gi,
				/the (decision|choice|plan) is\s+([^.!?]+)/gi,
				/i will\s+([^.!?]+)/gi,
				/let's\s+([^.!?]+)/gi,
			];

			decisionPatterns.forEach((pattern) => {
				let match;
				while (
					(match = pattern.exec(text)) !== null
				) {
					decisions.push(match[0]);
				}
			});
		});

		return decisions.slice(0, 5);
	}

	/**
	 * Extracts follow-up items from messages
	 */
	private static extractFollowUps(
		messages: Message[]
	): string[] {
		const followUps: string[] = [];

		messages.forEach((message) => {
			const text = message.text;
			const followUpPatterns = [
				/next,?\s+(i will|we will|you should)\s+([^.!?]+)/gi,
				/todo:\s*([^.!?]+)/gi,
				/action item:\s*([^.!?]+)/gi,
				/follow up\s+([^.!?]+)/gi,
			];

			followUpPatterns.forEach((pattern) => {
				let match;
				while (
					(match = pattern.exec(text)) !== null
				) {
					followUps.push(match[0]);
				}
			});
		});

		return followUps.slice(0, 5);
	}

	/**
	 * Generates summary text
	 */
	private static generateSummaryText(
		messages: Message[],
		keyTopics: string[],
		importantPoints: string[]
	): string {
		const userMessages = messages.filter(
			(msg) => msg.type === 'prompt'
		);
		const aiMessages = messages.filter(
			(msg) => msg.type === 'response'
		);

		let summary = `Conversation summary (${messages.length} messages):\n\n`;

		if (keyTopics.length > 0) {
			summary += `Key topics discussed: ${keyTopics.join(
				', '
			)}\n\n`;
		}

		if (userMessages.length > 0) {
			summary += `Main user queries: ${userMessages.length} questions/requests\n`;
		}

		if (aiMessages.length > 0) {
			summary += `AI responses: ${aiMessages.length} detailed answers\n`;
		}

		if (importantPoints.length > 0) {
			summary += `\nImportant points:\n`;
			importantPoints
				.slice(0, 3)
				.forEach((point, index) => {
					summary += `${index + 1}. ${point}\n`;
				});
		}

		return summary;
	}

	/**
	 * Updates user profile based on message patterns
	 */
	static updateUserProfile(
		memoryState: SmartMemoryState,
		newContexts: MemoryContext[]
	): SmartMemoryState['userProfile'] {
		const updatedProfile = {
			...memoryState.userProfile,
		};

		newContexts.forEach((context) => {
			if (context.type === 'user_preference') {
				// Extract preference information
				const keywords = context.keywords;
				keywords.forEach((keyword) => {
					if (
						!updatedProfile.interests.includes(
							keyword
						)
					) {
						updatedProfile.interests.push(
							keyword
						);
					}
				});
			}
		});

		// Update frequent topics
		const allKeywords = newContexts.flatMap(
			(ctx) => ctx.keywords
		);
		allKeywords.forEach((keyword) => {
			const existingIndex =
				updatedProfile.frequentTopics.findIndex(
					(topic) => topic === keyword
				);

			if (existingIndex === -1) {
				updatedProfile.frequentTopics.push(keyword);
			}
		});

		// Keep only top 20 interests and topics
		updatedProfile.interests =
			updatedProfile.interests.slice(0, 20);
		updatedProfile.frequentTopics =
			updatedProfile.frequentTopics.slice(0, 20);

		return updatedProfile;
	}

	/**
	 * Cleans up old memory entries
	 */
	static cleanupMemory(
		memoryState: SmartMemoryState
	): SmartMemoryState {
		const now = new Date();
		const thirtyDaysAgo = new Date(
			now.getTime() - 30 * 24 * 60 * 60 * 1000
		);

		const filteredMemory =
			memoryState.contextMemory.filter((context) => {
				const lastUpdated = new Date(
					context.lastUpdated
				);

				// Keep if not expired or is important
				return (
					!context.expiresAt ||
					new Date(context.expiresAt) > now ||
					context.type === 'user_preference' ||
					lastUpdated > thirtyDaysAgo
				);
			});

		// Sort by relevance and keep only the most recent/relevant entries
		const sortedMemory = filteredMemory
			.sort(
				(a, b) =>
					b.relevanceScore - a.relevanceScore
			)
			.slice(0, this.MAX_MEMORY_ENTRIES);

		return {
			...memoryState,
			contextMemory: sortedMemory,
			lastUpdated: new Date().toISOString(),
		};
	}

	/**
	 * Generates unique memory ID
	 */
	private static generateMemoryId(): string {
		return `memory_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;
	}

	/**
	 * Generates unique summary ID
	 */
	private static generateSummaryId(): string {
		return `summary_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;
	}

	/**
	 * Formats memory context for AI prompt
	 */
	static formatContextForAI(
		contexts: MemoryContext[]
	): string {
		if (contexts.length === 0) {
			return '';
		}

		let formatted =
			'\n--- Context from previous conversations ---\n';

		contexts.forEach((context) => {
			formatted += `${context.type.replace(
				/_/g,
				' '
			)}: ${context.content}\n`;
		});

		formatted += '--- End of context ---\n';

		return formatted;
	}

	/**
	 * Creates initial memory state
	 */
	static createInitialMemoryState(): SmartMemoryState {
		return {
			userProfile: {
				preferences: {},
				expertise: [],
				interests: [],
				communicationStyle: 'conversational',
				frequentTopics: [],
			},
			contextMemory: [],
			summaries: [],
			totalMemoryEntries: 0,
			lastUpdated: new Date().toISOString(),
		};
	}
}
