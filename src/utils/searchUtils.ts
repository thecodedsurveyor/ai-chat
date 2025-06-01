import type {
	Chat,
	SearchFilters,
	SearchResult,
} from '../types';

export class SearchEngine {
	/**
	 * Performs full-text search across chats and messages
	 */
	static search(
		chats: Chat[],
		filters: SearchFilters
	): SearchResult[] {
		if (!chats || chats.length === 0) {
			return [];
		}

		const results: SearchResult[] = [];
		const {
			query,
			category,
			tags,
			dateRange,
			favoritesOnly,
			messageType,
		} = filters;

		// Track which chats have already been added as chat results
		const addedChatIds = new Set<string>();

		for (const chat of chats) {
			try {
				// Filter by category
				if (category && chat.category !== category)
					continue;

				// Filter by tags
				if (tags && tags.length > 0) {
					const chatTags = chat.tags || [];
					const hasMatchingTag = tags.some(
						(tag) =>
							chatTags.some((chatTag) =>
								chatTag
									.toLowerCase()
									.includes(
										tag.toLowerCase()
									)
							)
					);
					if (!hasMatchingTag) continue;
				}

				// Filter by date range
				if (
					dateRange &&
					dateRange.start &&
					dateRange.end
				) {
					const chatDate = new Date(
						chat.createdAt
					);
					const startDate = new Date(
						dateRange.start
					);
					const endDate = new Date(dateRange.end);
					endDate.setHours(23, 59, 59, 999); // Include the entire end date
					if (
						chatDate < startDate ||
						chatDate > endDate
					)
						continue;
				}

				// Search in chat title/displayId if query exists
				if (query && query.trim()) {
					const chatTitleMatch =
						this.searchInText(
							chat.displayId,
							query
						);
					if (chatTitleMatch.isMatch) {
						results.push({
							type: 'chat',
							chat,
							relevanceScore:
								chatTitleMatch.score,
							matchedText:
								chatTitleMatch.matchedText,
						});
						addedChatIds.add(chat.id);
					}
				}

				// Search in messages
				let hasMatchingMessages = false;
				for (const message of chat.messages) {
					try {
						// Filter by message type
						if (
							messageType !== 'all' &&
							message.type !== messageType
						)
							continue;

						// Filter by favorites
						if (
							favoritesOnly &&
							!message.isFavorite
						)
							continue;

						// If we have a query, search in message text
						if (query && query.trim()) {
							const messageMatch =
								this.searchInText(
									message.text,
									query
								);
							if (messageMatch.isMatch) {
								results.push({
									type: 'message',
									chat,
									message,
									relevanceScore:
										messageMatch.score,
									matchedText:
										messageMatch.matchedText,
								});
								hasMatchingMessages = true;
							}
						} else {
							// If no query but other filters match, mark as having matching messages
							hasMatchingMessages = true;
						}
					} catch {
						// Silent error handling - skip message and continue
						continue;
					}
				}

				// If no query but other filters are applied and we haven't added this chat yet
				if (
					!query &&
					!addedChatIds.has(chat.id) &&
					hasMatchingMessages
				) {
					results.push({
						type: 'chat',
						chat,
						relevanceScore: 1,
					});
				}
			} catch {
				// Silent error handling - skip chat and continue
				continue;
			}
		}

		// Sort by relevance score (highest first), then by type (chats first)
		return results.sort((a, b) => {
			const scoreA = a.relevanceScore || 0;
			const scoreB = b.relevanceScore || 0;

			if (scoreA !== scoreB) {
				return scoreB - scoreA;
			}

			// If scores are equal, prioritize chats over messages
			if (a.type !== b.type) {
				return a.type === 'chat' ? -1 : 1;
			}

			return 0;
		});
	}

	/**
	 * Searches for query in text and returns match information
	 */
	private static searchInText(
		text: string,
		query: string
	): {
		isMatch: boolean;
		score: number;
		matchedText?: string;
	} {
		if (!query || !query.trim() || !text) {
			return { isMatch: false, score: 0 };
		}

		const normalizedText = text.toLowerCase();
		const normalizedQuery = query.toLowerCase().trim();

		// Exact match gets highest score
		if (normalizedText.includes(normalizedQuery)) {
			const index =
				normalizedText.indexOf(normalizedQuery);
			const contextStart = Math.max(0, index - 50);
			const contextEnd = Math.min(
				text.length,
				index + normalizedQuery.length + 50
			);

			return {
				isMatch: true,
				score: this.calculateRelevanceScore(
					text,
					query,
					index
				),
				matchedText: text.substring(
					contextStart,
					contextEnd
				),
			};
		}

		// Fuzzy matching for partial matches
		const words = normalizedQuery
			.split(/\s+/)
			.filter((word) => word.length > 0);
		const matchedWords = words.filter((word) =>
			normalizedText.includes(word)
		);

		if (matchedWords.length > 0) {
			const score =
				(matchedWords.length / words.length) * 0.7; // Lower score for partial matches
			return {
				isMatch: true,
				score,
				matchedText:
					text.substring(0, 100) +
					(text.length > 100 ? '...' : ''),
			};
		}

		return { isMatch: false, score: 0 };
	}

	/**
	 * Calculates relevance score based on match position and context
	 */
	private static calculateRelevanceScore(
		text: string,
		query: string,
		matchIndex: number
	): number {
		let score = 1.0;

		// Boost score for matches at the beginning
		if (matchIndex === 0) {
			score += 0.3;
		} else if (matchIndex < 10) {
			score += 0.2;
		}

		// Boost score for exact case match
		if (text.includes(query)) {
			score += 0.1;
		}

		// Boost score for whole word matches
		const beforeChar =
			matchIndex > 0 ? text[matchIndex - 1] : ' ';
		const afterChar =
			matchIndex + query.length < text.length
				? text[matchIndex + query.length]
				: ' ';
		if (/\s/.test(beforeChar) && /\s/.test(afterChar)) {
			score += 0.2;
		}

		// Penalize very long texts (less relevant)
		if (text.length > 1000) {
			score *= 0.9;
		}

		return Math.min(score, 2.0); // Cap at 2.0
	}

	/**
	 * Extracts and suggests tags from chat content
	 */
	static extractSuggestedTags(chats: Chat[]): string[] {
		const tagCounts = new Map<string, number>();

		// Extract existing tags
		for (const chat of chats) {
			if (chat.tags) {
				for (const tag of chat.tags) {
					tagCounts.set(
						tag,
						(tagCounts.get(tag) || 0) + 1
					);
				}
			}
		}

		// Extract potential tags from message content
		const commonWords = new Set([
			'the',
			'and',
			'or',
			'but',
			'in',
			'on',
			'at',
			'to',
			'for',
			'of',
			'with',
			'by',
			'is',
			'are',
			'was',
			'were',
			'be',
			'been',
			'have',
			'has',
			'had',
			'do',
			'does',
			'did',
			'will',
			'would',
			'could',
			'should',
			'may',
			'might',
			'can',
			'must',
			'shall',
			'this',
			'that',
			'these',
			'those',
			'a',
			'an',
			'i',
			'you',
			'he',
			'she',
			'it',
			'we',
			'they',
		]);

		for (const chat of chats) {
			for (const message of chat.messages) {
				const words =
					message.text
						.toLowerCase()
						.match(/\b\w{3,}\b/g) || [];
				for (const word of words) {
					if (
						!commonWords.has(word) &&
						word.length >= 3 &&
						word.length <= 20 &&
						!/^\d+$/.test(word) // Exclude pure numbers
					) {
						tagCounts.set(
							word,
							(tagCounts.get(word) || 0) + 1
						);
					}
				}
			}
		}

		// Return most frequent tags
		return Array.from(tagCounts.entries())
			.filter(([, count]) => count >= 2) // Only tags that appear at least twice
			.sort(([, a], [, b]) => b - a)
			.slice(0, 20) // Top 20 suggestions
			.map(([tag]) => tag);
	}

	/**
	 * Groups search results by chat for better organization
	 */
	static groupResultsByChat(
		results: SearchResult[]
	): Map<string, SearchResult[]> {
		const grouped = new Map<string, SearchResult[]>();

		for (const result of results) {
			const chatId = result.chat.id;
			if (!grouped.has(chatId)) {
				grouped.set(chatId, []);
			}
			grouped.get(chatId)!.push(result);
		}

		return grouped;
	}

	/**
	 * Highlights search terms in text
	 */
	static highlightSearchTerms(
		text: string,
		query: string
	): string {
		if (!query || !query.trim()) return text;

		const words = query
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0);
		let highlightedText = text;

		for (const word of words) {
			const regex = new RegExp(
				`(${word.replace(
					/[.*+?^${}()|[\]\\]/g,
					'\\$&'
				)})`,
				'gi'
			);
			highlightedText = highlightedText.replace(
				regex,
				'<mark class="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">$1</mark>'
			);
		}

		return highlightedText;
	}
}
