import type {
	Message,
	MessageBookmark,
	BookmarkType,
} from '../types';

/**
 * Smart Bookmarks system for automatically suggesting important moments
 */
export class SmartBookmarks {
	private static readonly IMPORTANCE_KEYWORDS = {
		high: [
			'important',
			'critical',
			'urgent',
			'key',
			'essential',
			'crucial',
			'remember',
			'note',
			'todo',
			'action',
			'decision',
			'conclusion',
			'solution',
			'answer',
			'summary',
			'result',
			'outcome',
			'final',
			'breakthrough',
			'discovery',
			'insight',
			'realization',
		],
		medium: [
			'interesting',
			'useful',
			'helpful',
			'good',
			'nice',
			'valuable',
			'relevant',
			'significant',
			'notable',
			'worth',
			'consider',
			'suggest',
			'recommend',
			'tip',
			'idea',
			'thought',
			'point',
		],
		low: [
			'maybe',
			'perhaps',
			'possibly',
			'might',
			'could',
			'somewhat',
			'slightly',
			'minor',
			'small',
			'basic',
			'simple',
		],
	};

	private static readonly TOPIC_INDICATORS = [
		'about',
		'regarding',
		'concerning',
		'related to',
		'in terms of',
		'with respect to',
		'as for',
		'speaking of',
		'when it comes to',
	];

	private static readonly QUESTION_PATTERNS = [
		/how\s+(do|does|can|to|should)/i,
		/what\s+(is|are|does|do|should|would|could)/i,
		/why\s+(is|are|does|do|should|would|could)/i,
		/when\s+(is|are|does|do|should|would|could)/i,
		/where\s+(is|are|does|do|should|would|could)/i,
		/which\s+(is|are|does|do|should|would|could)/i,
		/who\s+(is|are|does|do|should|would|could)/i,
		/\?$/,
	];

	/**
	 * Analyzes a message and suggests if it should be bookmarked
	 */
	static analyzeMessageForBookmark(
		message: Message
	): MessageBookmark | null {
		if (message.type !== 'response') {
			return null; // Only bookmark AI responses for now
		}

		const analysis = this.analyzeMessageContent(
			message.text
		);

		if (analysis.shouldBookmark) {
			return {
				id: this.generateBookmarkId(),
				messageId: message.id,
				chatId: '', // Will be set by the calling component
				type: 'ai_suggested',
				title: analysis.suggestedTitle,
				description: analysis.description,
				tags: analysis.tags,
				importance: analysis.importance,
				createdAt: new Date().toISOString(),
				aiConfidence: analysis.confidence,
				isAccepted: false,
			};
		}

		return null;
	}

	/**
	 * Analyzes message content for bookmark worthiness
	 */
	private static analyzeMessageContent(text: string): {
		shouldBookmark: boolean;
		suggestedTitle: string;
		description?: string;
		tags: string[];
		importance: 'low' | 'medium' | 'high';
		confidence: number;
	} {
		const words = text.toLowerCase().split(/\s+/);
		let score = 0;
		let importance: 'low' | 'medium' | 'high' = 'low';
		const tags: string[] = [];

		// Check for importance keywords
		const highKeywords = words.filter((word) =>
			this.IMPORTANCE_KEYWORDS.high.some(
				(keyword) =>
					word.includes(keyword) ||
					keyword.includes(word)
			)
		);

		const mediumKeywords = words.filter((word) =>
			this.IMPORTANCE_KEYWORDS.medium.some(
				(keyword) =>
					word.includes(keyword) ||
					keyword.includes(word)
			)
		);

		// Score based on keywords
		score += highKeywords.length * 3;
		score += mediumKeywords.length * 2;

		// Check for questions and answers
		const hasQuestion = this.QUESTION_PATTERNS.some(
			(pattern) => pattern.test(text)
		);
		if (hasQuestion) {
			score += 2;
			tags.push('question');
		}

		// Check for code blocks
		if (text.includes('```') || text.includes('`')) {
			score += 3;
			tags.push('code');
		}

		// Check for lists or numbered items
		if (
			/^\d+\./m.test(text) ||
			/^[-*+]\s/m.test(text)
		) {
			score += 2;
			tags.push('list');
		}

		// Check for URLs
		if (/https?:\/\//.test(text)) {
			score += 1;
			tags.push('resource');
		}

		// Check message length (longer messages might be more comprehensive)
		if (text.length > 500) {
			score += 1;
			tags.push('detailed');
		}

		// Check for step-by-step instructions
		if (
			/step\s*\d+/i.test(text) ||
			/first.*second.*third/i.test(text)
		) {
			score += 3;
			tags.push('instructions');
		}

		// Determine importance level
		if (score >= 6) {
			importance = 'high';
		} else if (score >= 3) {
			importance = 'medium';
		}

		// Generate title
		const suggestedTitle = this.generateBookmarkTitle(
			text,
			tags
		);

		// Calculate confidence (0-1)
		const confidence = Math.min(score / 10, 1);

		return {
			shouldBookmark: score >= 2, // Minimum threshold
			suggestedTitle,
			description: this.generateDescription(text),
			tags,
			importance,
			confidence,
		};
	}

	/**
	 * Generates a concise title for the bookmark
	 */
	private static generateBookmarkTitle(
		text: string,
		tags: string[]
	): string {
		// Try to extract the first sentence or meaningful phrase
		const sentences = text
			.split(/[.!?]+/)
			.filter((s) => s.trim().length > 0);

		if (sentences.length > 0) {
			let title = sentences[0].trim();

			// Limit title length
			if (title.length > 60) {
				title = title.substring(0, 57) + '...';
			}

			return title;
		}

		// Fallback based on tags
		if (tags.includes('code')) {
			return 'Code Example';
		} else if (tags.includes('instructions')) {
			return 'Step-by-step Instructions';
		} else if (tags.includes('question')) {
			return 'Q&A Response';
		} else if (tags.includes('list')) {
			return 'List/Summary';
		}

		return 'Important Information';
	}

	/**
	 * Generates a description for the bookmark
	 */
	private static generateDescription(
		text: string
	): string {
		// Extract key phrases or create a summary
		const words = text.split(/\s+/);
		if (words.length <= 15) {
			return text;
		}

		// Create a brief summary
		return words.slice(0, 15).join(' ') + '...';
	}

	/**
	 * Generates unique bookmark ID
	 */
	private static generateBookmarkId(): string {
		return `bookmark_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;
	}

	/**
	 * Filters and sorts bookmarks by relevance
	 */
	static filterBookmarks(
		bookmarks: MessageBookmark[],
		query?: string,
		tags?: string[],
		importance?: 'low' | 'medium' | 'high'
	): MessageBookmark[] {
		let filtered = [...bookmarks];

		// Filter by search query
		if (query) {
			const searchTerm = query.toLowerCase();
			filtered = filtered.filter(
				(bookmark) =>
					bookmark.title
						.toLowerCase()
						.includes(searchTerm) ||
					bookmark.description
						?.toLowerCase()
						.includes(searchTerm) ||
					bookmark.tags.some((tag) =>
						tag
							.toLowerCase()
							.includes(searchTerm)
					)
			);
		}

		// Filter by tags
		if (tags && tags.length > 0) {
			filtered = filtered.filter((bookmark) =>
				tags.some((tag) =>
					bookmark.tags.includes(tag)
				)
			);
		}

		// Filter by importance
		if (importance) {
			filtered = filtered.filter(
				(bookmark) =>
					bookmark.importance === importance
			);
		}

		// Sort by importance and creation date
		return filtered.sort((a, b) => {
			const importanceOrder = {
				high: 3,
				medium: 2,
				low: 1,
			};
			const importanceDiff =
				importanceOrder[b.importance] -
				importanceOrder[a.importance];

			if (importanceDiff !== 0) {
				return importanceDiff;
			}

			// If same importance, sort by date (newest first)
			return (
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime()
			);
		});
	}

	/**
	 * Gets all unique tags from bookmarks
	 */
	static getAllTags(
		bookmarks: MessageBookmark[]
	): string[] {
		const allTags = bookmarks.flatMap(
			(bookmark) => bookmark.tags
		);
		return [...new Set(allTags)].sort();
	}

	/**
	 * Gets bookmark statistics
	 */
	static getBookmarkStats(bookmarks: MessageBookmark[]): {
		total: number;
		byImportance: Record<
			'high' | 'medium' | 'low',
			number
		>;
		byType: Record<BookmarkType, number>;
		mostUsedTags: { tag: string; count: number }[];
	} {
		const stats = {
			total: bookmarks.length,
			byImportance: { high: 0, medium: 0, low: 0 },
			byType: {
				user: 0,
				ai_suggested: 0,
				system: 0,
			} as Record<BookmarkType, number>,
			mostUsedTags: [] as {
				tag: string;
				count: number;
			}[],
		};

		bookmarks.forEach((bookmark) => {
			stats.byImportance[bookmark.importance]++;
			stats.byType[bookmark.type]++;
		});

		// Calculate tag frequency
		const tagCounts: Record<string, number> = {};
		bookmarks.forEach((bookmark) => {
			bookmark.tags.forEach((tag) => {
				tagCounts[tag] = (tagCounts[tag] || 0) + 1;
			});
		});

		stats.mostUsedTags = Object.entries(tagCounts)
			.map(([tag, count]) => ({ tag, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		return stats;
	}

	/**
	 * Creates a user bookmark manually
	 */
	static createUserBookmark(
		messageId: string,
		chatId: string,
		title: string,
		description?: string,
		tags: string[] = []
	): MessageBookmark {
		return {
			id: this.generateBookmarkId(),
			messageId,
			chatId,
			type: 'user',
			title,
			description,
			tags,
			importance: 'medium',
			createdAt: new Date().toISOString(),
			isAccepted: true,
		};
	}
}
