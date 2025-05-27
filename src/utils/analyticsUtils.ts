import type {
	Chat,
	ChatCategory,
	AnalyticsData,
	UsageStatistics,
	CategoryStatistics,
	TagStatistics,
	ConversationTrend,
	ResponseTimeMetrics,
	TopicAnalysis,
	FavoriteTopics,
	AnalyticsTimeRange,
} from '../types';

export class AnalyticsEngine {
	/**
	 * Generate comprehensive analytics from chat data
	 */
	static generateAnalytics(
		chats: Chat[],
		timeRange: AnalyticsTimeRange = 'all'
	): AnalyticsData {
		const filteredChats = this.filterChatsByTimeRange(
			chats,
			timeRange
		);

		return {
			usageStatistics:
				this.calculateUsageStatistics(
					filteredChats
				),
			categoryStatistics:
				this.calculateCategoryStatistics(
					filteredChats
				),
			tagStatistics:
				this.calculateTagStatistics(filteredChats),
			conversationTrends:
				this.calculateConversationTrends(chats), // Use all chats for trends
			responseTimeMetrics:
				this.calculateResponseTimeMetrics(
					filteredChats
				),
			topicAnalysis:
				this.calculateTopicAnalysis(filteredChats),
			favoriteTopics:
				this.calculateFavoriteTopics(filteredChats),
			lastUpdated: new Date().toISOString(),
		};
	}

	/**
	 * Filter chats by time range
	 */
	private static filterChatsByTimeRange(
		chats: Chat[],
		timeRange: AnalyticsTimeRange
	): Chat[] {
		if (timeRange === 'all') return chats;

		const now = new Date();
		let startDate: Date;

		switch (timeRange) {
			case 'today':
				startDate = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate()
				);
				break;
			case 'week':
				startDate = new Date(
					now.getTime() - 7 * 24 * 60 * 60 * 1000
				);
				break;
			case 'month':
				startDate = new Date(
					now.getFullYear(),
					now.getMonth(),
					1
				);
				break;
			default:
				return chats;
		}

		return chats.filter(
			(chat) =>
				chat.createdAt &&
				new Date(chat.createdAt) >= startDate
		);
	}

	/**
	 * Calculate usage statistics
	 */
	private static calculateUsageStatistics(
		chats: Chat[]
	): UsageStatistics {
		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);
		const weekAgo = new Date(
			now.getTime() - 7 * 24 * 60 * 60 * 1000
		);
		const monthStart = new Date(
			now.getFullYear(),
			now.getMonth(),
			1
		);

		const totalMessages = chats.reduce(
			(sum, chat) => sum + chat.messages.length,
			0
		);
		const userMessages = chats.reduce(
			(sum, chat) =>
				sum +
				chat.messages.filter(
					(m) => m.type === 'prompt'
				).length,
			0
		);
		const aiMessages = chats.reduce(
			(sum, chat) =>
				sum +
				chat.messages.filter(
					(m) => m.type === 'response'
				).length,
			0
		);

		// Calculate word counts
		const totalWords = chats.reduce(
			(sum, chat) =>
				sum +
				chat.messages.reduce(
					(msgSum, msg) =>
						msgSum + this.countWords(msg.text),
					0
				),
			0
		);

		// Time-based counts
		const chatsCreatedToday = chats.filter(
			(chat) =>
				chat.createdAt &&
				new Date(chat.createdAt) >= today
		).length;

		const chatsCreatedThisWeek = chats.filter(
			(chat) =>
				chat.createdAt &&
				new Date(chat.createdAt) >= weekAgo
		).length;

		const chatsCreatedThisMonth = chats.filter(
			(chat) =>
				chat.createdAt &&
				new Date(chat.createdAt) >= monthStart
		).length;

		// Messages sent today/week/month (counting user messages)
		const messagessentToday = chats.reduce(
			(sum, chat) => {
				if (!chat.createdAt) return sum;
				const todayMessages = chat.messages.filter(
					(msg) =>
						msg.type === 'prompt' &&
						new Date(chat.createdAt) >= today
				);
				return sum + todayMessages.length;
			},
			0
		);

		const messagesSentThisWeek = chats.reduce(
			(sum, chat) => {
				if (!chat.createdAt) return sum;
				const weekMessages = chat.messages.filter(
					(msg) =>
						msg.type === 'prompt' &&
						new Date(chat.createdAt) >= weekAgo
				);
				return sum + weekMessages.length;
			},
			0
		);

		const messagesSentThisMonth = chats.reduce(
			(sum, chat) => {
				if (!chat.createdAt) return sum;
				const monthMessages = chat.messages.filter(
					(msg) =>
						msg.type === 'prompt' &&
						new Date(chat.createdAt) >=
							monthStart
				);
				return sum + monthMessages.length;
			},
			0
		);

		return {
			totalChats: chats.length,
			totalMessages,
			totalUserMessages: userMessages,
			totalAIMessages: aiMessages,
			averageMessagesPerChat:
				chats.length > 0
					? totalMessages / chats.length
					: 0,
			averageWordsPerMessage:
				totalMessages > 0
					? totalWords / totalMessages
					: 0,
			totalWords,
			chatsCreatedToday,
			chatsCreatedThisWeek,
			chatsCreatedThisMonth,
			messagessentToday,
			messagesSentThisWeek,
			messagesSentThisMonth,
		};
	}

	/**
	 * Calculate category statistics
	 */
	private static calculateCategoryStatistics(
		chats: Chat[]
	): CategoryStatistics[] {
		const categories: Record<
			ChatCategory,
			{
				count: number;
				totalMessages: number;
				totalWords: number;
			}
		> = {
			work: {
				count: 0,
				totalMessages: 0,
				totalWords: 0,
			},
			personal: {
				count: 0,
				totalMessages: 0,
				totalWords: 0,
			},
			research: {
				count: 0,
				totalMessages: 0,
				totalWords: 0,
			},
			general: {
				count: 0,
				totalMessages: 0,
				totalWords: 0,
			},
		};

		chats.forEach((chat) => {
			const category = chat.category || 'general';
			categories[category].count++;
			categories[category].totalMessages +=
				chat.messages.length;
			categories[category].totalWords +=
				chat.messages.reduce(
					(sum, msg) =>
						sum + this.countWords(msg.text),
					0
				);
		});

		const totalChats = chats.length;

		return Object.entries(categories).map(
			([category, data]) => ({
				category: category as ChatCategory,
				count: data.count,
				percentage:
					totalChats > 0
						? (data.count / totalChats) * 100
						: 0,
				averageMessages:
					data.count > 0
						? data.totalMessages / data.count
						: 0,
				totalWords: data.totalWords,
			})
		);
	}

	/**
	 * Calculate tag statistics
	 */
	private static calculateTagStatistics(
		chats: Chat[]
	): TagStatistics[] {
		const tagCounts = new Map<
			string,
			{ count: number; chats: string[] }
		>();

		chats.forEach((chat) => {
			if (chat.tags) {
				chat.tags.forEach((tag) => {
					if (!tagCounts.has(tag)) {
						tagCounts.set(tag, {
							count: 0,
							chats: [],
						});
					}
					const tagData = tagCounts.get(tag)!;
					tagData.count++;
					tagData.chats.push(chat.id);
				});
			}
		});

		const totalTaggedChats = chats.filter(
			(chat) => chat.tags && chat.tags.length > 0
		).length;

		return Array.from(tagCounts.entries())
			.map(([tag, data]) => ({
				tag,
				count: data.count,
				percentage:
					totalTaggedChats > 0
						? (data.count / totalTaggedChats) *
						  100
						: 0,
				chats: data.chats,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 20); // Top 20 tags
	}

	/**
	 * Calculate conversation trends over time
	 */
	private static calculateConversationTrends(
		chats: Chat[]
	): ConversationTrend[] {
		const last30Days = Array.from(
			{ length: 30 },
			(_, i) => {
				const date = new Date();
				date.setDate(date.getDate() - i);
				return date.toISOString().split('T')[0];
			}
		).reverse();

		return last30Days.map((date) => {
			const dayChats = chats.filter(
				(chat) =>
					chat.createdAt &&
					chat.createdAt.startsWith(date)
			);

			const totalMessages = dayChats.reduce(
				(sum, chat) => sum + chat.messages.length,
				0
			);
			const averageLength =
				dayChats.length > 0
					? totalMessages / dayChats.length
					: 0;

			const categories: Record<ChatCategory, number> =
				{
					work: 0,
					personal: 0,
					research: 0,
					general: 0,
				};

			dayChats.forEach((chat) => {
				const category = chat.category || 'general';
				categories[category]++;
			});

			return {
				date,
				chatsCreated: dayChats.length,
				messagesSent: totalMessages,
				averageLength,
				categories,
			};
		});
	}

	/**
	 * Calculate response time metrics
	 */
	private static calculateResponseTimeMetrics(
		chats: Chat[]
	): ResponseTimeMetrics {
		const responseTimes: number[] = [];
		const responseTimesByHour: Record<
			string,
			number[]
		> = {};
		const responseTimesByDay: Record<string, number[]> =
			{};
		const responseTimeTrend: {
			date: string;
			time: number;
		}[] = [];

		chats.forEach((chat) => {
			chat.messages.forEach((message) => {
				if (
					message.type === 'response' &&
					message.responseTime &&
					chat.createdAt
				) {
					responseTimes.push(
						message.responseTime
					);

					// Group by hour
					const hour = new Date(chat.createdAt)
						.getHours()
						.toString();
					if (!responseTimesByHour[hour])
						responseTimesByHour[hour] = [];
					responseTimesByHour[hour].push(
						message.responseTime
					);

					// Group by day
					const day =
						chat.createdAt.split('T')[0];
					if (!responseTimesByDay[day])
						responseTimesByDay[day] = [];
					responseTimesByDay[day].push(
						message.responseTime
					);
				}
			});
		});

		// Calculate averages
		const avgByHour: Record<string, number> = {};
		Object.entries(responseTimesByHour).forEach(
			([hour, times]) => {
				avgByHour[hour] =
					times.reduce(
						(sum, time) => sum + time,
						0
					) / times.length;
			}
		);

		const avgByDay: Record<string, number> = {};
		Object.entries(responseTimesByDay).forEach(
			([day, times]) => {
				avgByDay[day] =
					times.reduce(
						(sum, time) => sum + time,
						0
					) / times.length;
			}
		);

		// Create trend data for last 7 days
		const last7Days = Array.from(
			{ length: 7 },
			(_, i) => {
				const date = new Date();
				date.setDate(date.getDate() - i);
				return date.toISOString().split('T')[0];
			}
		).reverse();

		last7Days.forEach((date) => {
			const dayTimes = responseTimesByDay[date] || [];
			const avgTime =
				dayTimes.length > 0
					? dayTimes.reduce(
							(sum, time) => sum + time,
							0
					  ) / dayTimes.length
					: 0;
			responseTimeTrend.push({ date, time: avgTime });
		});

		return {
			averageResponseTime:
				responseTimes.length > 0
					? responseTimes.reduce(
							(sum, time) => sum + time,
							0
					  ) / responseTimes.length
					: 0,
			fastestResponse:
				responseTimes.length > 0
					? Math.min(...responseTimes)
					: 0,
			slowestResponse:
				responseTimes.length > 0
					? Math.max(...responseTimes)
					: 0,
			responseTimesByHour: avgByHour,
			responseTimesByDay: avgByDay,
			responseTimeTrend,
		};
	}

	/**
	 * Calculate topic analysis
	 */
	private static calculateTopicAnalysis(
		chats: Chat[]
	): TopicAnalysis[] {
		const topicCounts = new Map<
			string,
			{
				frequency: number;
				chats: string[];
				totalLength: number;
			}
		>();

		chats.forEach((chat) => {
			// Extract keywords from messages
			const keywords = this.extractKeywords(
				chat.messages.map((m) => m.text).join(' ')
			);

			keywords.forEach((keyword) => {
				if (!topicCounts.has(keyword)) {
					topicCounts.set(keyword, {
						frequency: 0,
						chats: [],
						totalLength: 0,
					});
				}
				const topicData = topicCounts.get(keyword)!;
				topicData.frequency++;
				if (!topicData.chats.includes(chat.id)) {
					topicData.chats.push(chat.id);
					topicData.totalLength +=
						chat.messages.length;
				}
			});
		});

		return Array.from(topicCounts.entries())
			.map(([keyword, data]) => ({
				topicKeyword: keyword,
				frequency: data.frequency,
				relatedChats: data.chats,
				averageConversationLength:
					data.chats.length > 0
						? data.totalLength /
						  data.chats.length
						: 0,
			}))
			.sort((a, b) => b.frequency - a.frequency)
			.slice(0, 15); // Top 15 topics
	}

	/**
	 * Calculate favorite topics analysis
	 */
	private static calculateFavoriteTopics(
		chats: Chat[]
	): FavoriteTopics {
		const favoriteMessages = chats.reduce(
			(sum, chat) =>
				sum +
				chat.messages.filter((m) => m.isFavorite)
					.length,
			0
		);

		// Extract keywords from favorite messages
		const favoriteKeywords = new Map<string, number>();
		const favoritesByCategory: Record<
			ChatCategory,
			number
		> = {
			work: 0,
			personal: 0,
			research: 0,
			general: 0,
		};

		chats.forEach((chat) => {
			const chatFavorites = chat.messages.filter(
				(m) => m.isFavorite
			);
			if (chatFavorites.length > 0) {
				const category = chat.category || 'general';
				favoritesByCategory[category] +=
					chatFavorites.length;

				chatFavorites.forEach((msg) => {
					const keywords = this.extractKeywords(
						msg.text
					);
					keywords.forEach((keyword) => {
						favoriteKeywords.set(
							keyword,
							(favoriteKeywords.get(
								keyword
							) || 0) + 1
						);
					});
				});
			}
		});

		const topFavoriteKeywords = Array.from(
			favoriteKeywords.entries()
		)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([keyword]) => keyword);

		// Favorites over time (last 30 days)
		const last30Days = Array.from(
			{ length: 30 },
			(_, i) => {
				const date = new Date();
				date.setDate(date.getDate() - i);
				return date.toISOString().split('T')[0];
			}
		).reverse();

		const favoritesOverTime = last30Days.map((date) => {
			const dayFavorites = chats.reduce(
				(sum, chat) => {
					if (
						chat.createdAt &&
						chat.createdAt.startsWith(date)
					) {
						return (
							sum +
							chat.messages.filter(
								(m) => m.isFavorite
							).length
						);
					}
					return sum;
				},
				0
			);

			return { date, count: dayFavorites };
		});

		return {
			favoriteMessages,
			topFavoriteKeywords,
			favoritesOverTime,
			favoritesByCategory,
		};
	}

	/**
	 * Extract keywords from text
	 */
	private static extractKeywords(text: string): string[] {
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
			'me',
			'him',
			'her',
			'us',
			'them',
			'my',
			'your',
			'his',
			'her',
			'its',
			'our',
			'their',
		]);

		return text
			.toLowerCase()
			.replace(/[^\w\s]/g, ' ')
			.split(/\s+/)
			.filter(
				(word) =>
					word.length >= 3 &&
					word.length <= 15 &&
					!commonWords.has(word) &&
					!/^\d+$/.test(word)
			)
			.slice(0, 50); // Limit to prevent performance issues
	}

	/**
	 * Count words in text
	 */
	private static countWords(text: string): number {
		return text
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0).length;
	}

	/**
	 * Format time duration
	 */
	static formatDuration(milliseconds: number): string {
		if (milliseconds < 1000) {
			return `${Math.round(milliseconds)}ms`;
		}
		const seconds = milliseconds / 1000;
		if (seconds < 60) {
			return `${seconds.toFixed(1)}s`;
		}
		const minutes = seconds / 60;
		return `${minutes.toFixed(1)}m`;
	}

	/**
	 * Format large numbers
	 */
	static formatNumber(num: number): string {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		}
		if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	}

	/**
	 * Get color for category
	 */
	static getCategoryColor(
		category: ChatCategory
	): string {
		const colors = {
			work: '#3B82F6',
			personal: '#10B981',
			research: '#8B5CF6',
			general: '#6B7280',
		};
		return colors[category];
	}
}
