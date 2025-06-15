import { useDocumentStore } from '../stores/documentStore';
import {
	getRelevantChunks,
	combineChunksForContext,
} from '../utils/documentChunking';

interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export const buildConversationHistory = (
	messages: ChatMessage[],
	systemPrompt?: string,
	userMessage?: string
): ChatMessage[] => {
	const conversationHistory: ChatMessage[] = [];

	// Add system prompt first
	if (systemPrompt) {
		conversationHistory.push({
			role: 'system',
			content: systemPrompt,
		});
	}

	// Get active document context with enhanced chunking
	const { activeDocument } = useDocumentStore.getState();
	if (activeDocument && activeDocument.content) {
		let documentContext = '';

		if (
			activeDocument.chunks &&
			activeDocument.chunks.length > 0
		) {
			// Use intelligent chunking if available
			if (userMessage) {
				// Get relevant chunks based on user's query
				const relevantChunks = getRelevantChunks(
					activeDocument.chunks,
					userMessage,
					3 // Maximum chunks to include
				);

				// Combine chunks optimally for context
				documentContext = combineChunksForContext(
					relevantChunks,
					2000
				);
			} else {
				// Use first few chunks if no specific query
				const firstChunks =
					activeDocument.chunks.slice(0, 3);
				documentContext = combineChunksForContext(
					firstChunks,
					2000
				);
			}
		} else {
			// Fallback to truncated content
			documentContext =
				activeDocument.content.length > 3000
					? activeDocument.content.substring(
							0,
							3000
					  ) + '\n\n[Content truncated...]'
					: activeDocument.content;
		}

		// Add document context with metadata
		const documentMetadata = activeDocument.metadata
			? `\n\nDocument Metadata:
- File: ${activeDocument.name}
- Type: ${
					activeDocument.type.includes('pdf')
						? 'PDF'
						: 'Word Document'
			  }
- Pages: ${activeDocument.metadata.pageCount || 'N/A'}
- Words: ${activeDocument.metadata.wordCount.toLocaleString()}
- Uploaded: ${new Date(
					activeDocument.metadata.uploadTime
			  ).toLocaleDateString()}`
			: '';

		conversationHistory.push({
			role: 'system',
			content: `You have access to the following document content. Use this information to provide accurate, specific answers about the document. When referencing the document, be specific about which sections or pages you're referring to when possible.

Document: "${activeDocument.name}"

Content:
${documentContext}${documentMetadata}

Instructions:
- Answer questions specifically based on the document content above
- If the user asks about something not covered in the document, clearly state that
- When quoting from the document, use quotation marks
- Reference page numbers when available (shown as [Page X] in the content)
- If the document content seems incomplete due to chunking, mention that you're working with a portion of the document`,
		});
	}

	// Add conversation messages
	messages.forEach((message) => {
		if (
			message.role === 'user' ||
			message.role === 'assistant'
		) {
			conversationHistory.push({
				role: message.role,
				content: message.content,
			});
		}
	});

	// Add the current user message if provided
	if (userMessage) {
		conversationHistory.push({
			role: 'user',
			content: userMessage,
		});
	}

	return conversationHistory;
};
