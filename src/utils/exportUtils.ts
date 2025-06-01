import type {
	Chat,
	ExportOptions,
	ExportData,
	ExportFormat,
} from '../types';

export class ExportManager {
	/**
	 * Export chats based on the provided options
	 */
	static async exportChats(
		chats: Chat[],
		options: ExportOptions
	): Promise<void> {
		const filteredChats = this.filterChats(
			chats,
			options
		);
		const exportData = this.createExportData(
			filteredChats,
			options
		);

		let content: string;
		let filename: string;
		let mimeType: string;

		switch (options.format) {
			case 'json':
				content = this.exportToJSON(exportData);
				filename = `ai-chat-export-${this.getDateString()}.json`;
				mimeType = 'application/json';
				break;
			case 'txt':
				content = this.exportToTXT(
					exportData,
					options
				);
				filename = `ai-chat-export-${this.getDateString()}.txt`;
				mimeType = 'text/plain';
				break;
			case 'csv':
				content = this.exportToCSV(
					exportData,
					options
				);
				filename = `ai-chat-export-${this.getDateString()}.csv`;
				mimeType = 'text/csv';
				break;
			case 'markdown':
				content = this.exportToMarkdown(
					exportData,
					options
				);
				filename = `ai-chat-export-${this.getDateString()}.md`;
				mimeType = 'text/markdown';
				break;
			default:
				throw new Error(
					`Unsupported export format: ${options.format}`
				);
		}

		this.downloadFile(content, filename, mimeType);
	}

	/**
	 * Filter chats based on export options
	 */
	private static filterChats(
		chats: Chat[],
		options: ExportOptions
	): Chat[] {
		let filtered = chats;

		// Filter by specific chat IDs
		if (options.chatIds && options.chatIds.length > 0) {
			filtered = filtered.filter((chat) =>
				options.chatIds!.includes(chat.id)
			);
		}

		// Filter by date range
		if (options.dateRange) {
			const startDate = new Date(
				options.dateRange.start
			);
			const endDate = new Date(options.dateRange.end);
			endDate.setHours(23, 59, 59, 999); // Include entire end date

			filtered = filtered.filter((chat) => {
				if (!chat.createdAt) return false;
				const chatDate = new Date(chat.createdAt);
				return (
					chatDate >= startDate &&
					chatDate <= endDate
				);
			});
		}

		return filtered;
	}

	/**
	 * Create export data structure
	 */
	private static createExportData(
		chats: Chat[],
		options: ExportOptions
	): ExportData {
		const totalMessages = chats.reduce(
			(sum, chat) => sum + chat.messages.length,
			0
		);

		return {
			exportedAt: new Date().toISOString(),
			totalChats: chats.length,
			totalMessages,
			chats,
			metadata: options.includeMetadata
				? {
						exportOptions: options,
						version: '1.0.0',
				  }
				: undefined,
		};
	}

	/**
	 * Export to JSON format
	 */
	private static exportToJSON(
		exportData: ExportData
	): string {
		return JSON.stringify(exportData, null, 2);
	}

	/**
	 * Export to plain text format
	 */
	private static exportToTXT(
		exportData: ExportData,
		options: ExportOptions
	): string {
		let content = `AI Chat Export - ${new Date().toLocaleDateString()}\n`;
		content += `Total Chats: ${exportData.totalChats}\n`;
		content += `Total Messages: ${exportData.totalMessages}\n`;
		content += '='.repeat(50) + '\n\n';

		exportData.chats.forEach((chat, index) => {
			content += `CHAT ${index + 1}: ${
				chat.displayId
			}\n`;
			if (options.includeMetadata) {
				content += `Created: ${
					chat.createdAt
						? new Date(
								chat.createdAt
						  ).toLocaleString()
						: 'Unknown'
				}\n`;
				if (chat.category)
					content += `Category: ${chat.category}\n`;
				if (chat.tags && chat.tags.length > 0)
					content += `Tags: ${chat.tags.join(
						', '
					)}\n`;
			}
			content += '-'.repeat(30) + '\n';

			chat.messages.forEach((message) => {
				const speaker =
					message.type === 'prompt'
						? 'USER'
						: 'AI';
				content += `[${speaker}]`;
				if (options.includeTimestamps) {
					content += ` (${message.timestamp})`;
				}
				content += `\n${message.text}\n\n`;
			});

			content += '\n';
		});

		return content;
	}

	/**
	 * Export to CSV format
	 */
	private static exportToCSV(
		exportData: ExportData,
		options: ExportOptions
	): string {
		const headers = [
			'Chat ID',
			'Chat Title',
			'Message Type',
			'Message Text',
			'Timestamp',
		];

		if (options.includeMetadata) {
			headers.push('Category', 'Tags', 'Is Favorite');
		}

		let content = headers.join(',') + '\n';

		exportData.chats.forEach((chat) => {
			chat.messages.forEach((message) => {
				const row = [
					this.escapeCSV(chat.id),
					this.escapeCSV(chat.displayId),
					this.escapeCSV(message.type),
					this.escapeCSV(message.text),
					options.includeTimestamps
						? this.escapeCSV(message.timestamp)
						: '',
				];

				if (options.includeMetadata) {
					row.push(
						this.escapeCSV(chat.category || ''),
						this.escapeCSV(
							chat.tags
								? chat.tags.join(';')
								: ''
						),
						this.escapeCSV(
							message.isFavorite
								? 'Yes'
								: 'No'
						)
					);
				}

				content += row.join(',') + '\n';
			});
		});

		return content;
	}

	/**
	 * Export to Markdown format
	 */
	private static exportToMarkdown(
		exportData: ExportData,
		options: ExportOptions
	): string {
		let content = `# AI Chat Export\n\n`;
		content += `**Export Date:** ${new Date().toLocaleDateString()}\n`;
		content += `**Total Chats:** ${exportData.totalChats}\n`;
		content += `**Total Messages:** ${exportData.totalMessages}\n\n`;
		content += '---\n\n';

		exportData.chats.forEach((chat, index) => {
			content += `## ${index + 1}. ${
				chat.displayId
			}\n\n`;

			if (options.includeMetadata) {
				content += `**Created:** ${
					chat.createdAt
						? new Date(
								chat.createdAt
						  ).toLocaleString()
						: 'Unknown'
				}\n`;
				if (chat.category)
					content += `**Category:** ${chat.category}\n`;
				if (chat.tags && chat.tags.length > 0) {
					content += `**Tags:** ${chat.tags
						.map((tag) => `\`${tag}\``)
						.join(', ')}\n`;
				}
				content += '\n';
			}

			chat.messages.forEach((message) => {
				const speaker =
					message.type === 'prompt'
						? '🧑‍💻 **User**'
						: '🤖 **AI Assistant**';
				content += `### ${speaker}`;

				if (options.includeTimestamps) {
					content += ` *(${message.timestamp})*`;
				}

				content += '\n\n';
				content += `${message.text}\n\n`;

				if (message.isFavorite) {
					content +=
						'⭐ *Marked as favorite*\n\n';
				}
			});

			content += '---\n\n';
		});

		return content;
	}

	/**
	 * Escape CSV field content
	 */
	private static escapeCSV(field: string): string {
		if (
			field.includes(',') ||
			field.includes('"') ||
			field.includes('\n')
		) {
			return `"${field.replace(/"/g, '""')}"`;
		}
		return field;
	}

	/**
	 * Download file to user's computer
	 */
	private static downloadFile(
		content: string,
		filename: string,
		mimeType: string
	): void {
		const blob = new Blob([content], {
			type: mimeType,
		});
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Clean up the URL object
		setTimeout(() => URL.revokeObjectURL(url), 100);
	}

	/**
	 * Get formatted date string for filenames
	 */
	private static getDateString(): string {
		const now = new Date();
		return now.toISOString().split('T')[0]; // YYYY-MM-DD format
	}

	/**
	 * Calculate export statistics
	 */
	static getExportStats(
		chats: Chat[],
		options?: Partial<ExportOptions>
	) {
		const filteredChats = options
			? this.filterChats(
					chats,
					options as ExportOptions
			  )
			: chats;
		const totalMessages = filteredChats.reduce(
			(sum, chat) => sum + chat.messages.length,
			0
		);
		const totalWords = filteredChats.reduce(
			(sum, chat) =>
				sum +
				chat.messages.reduce(
					(msgSum, msg) =>
						msgSum +
						msg.text
							.trim()
							.split(/\s+/)
							.filter(
								(word) => word.length > 0
							).length,
					0
				),
			0
		);

		return {
			totalChats: filteredChats.length,
			totalMessages,
			totalWords,
			estimatedFileSize: this.estimateFileSize(
				filteredChats,
				options?.format || 'json'
			),
		};
	}

	/**
	 * Estimate file size for different formats
	 */
	private static estimateFileSize(
		chats: Chat[],
		format: ExportFormat
	): string {
		const totalTextLength = chats.reduce(
			(sum, chat) =>
				sum + JSON.stringify(chat).length,
			0
		);

		let multiplier = 1;
		switch (format) {
			case 'json':
				multiplier = 1.2; // JSON formatting overhead
				break;
			case 'txt':
				multiplier = 0.8; // Plain text is more compact
				break;
			case 'csv':
				multiplier = 0.6; // CSV is quite compact
				break;
			case 'markdown':
				multiplier = 1.1; // Markdown formatting adds some overhead
				break;
		}

		const estimatedBytes = totalTextLength * multiplier;

		if (estimatedBytes < 1024) {
			return `${Math.round(estimatedBytes)} B`;
		} else if (estimatedBytes < 1024 * 1024) {
			return `${Math.round(
				estimatedBytes / 1024
			)} KB`;
		} else {
			return `${Math.round(
				estimatedBytes / (1024 * 1024)
			)} MB`;
		}
	}
}
