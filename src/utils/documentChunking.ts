import type { DocumentChunk } from '../stores/documentStore';

// Configuration for chunking
const CHUNK_CONFIG = {
	MAX_CHUNK_SIZE: 1000, // Maximum tokens per chunk
	OVERLAP_SIZE: 100, // Overlap between chunks for context
	MIN_CHUNK_SIZE: 200, // Minimum chunk size
	CHARS_PER_TOKEN: 4, // Approximate character to token ratio
};

/**
 * Estimates token count from text (simple approximation)
 */
export function estimateTokens(text: string): number {
	return Math.ceil(
		text.length / CHUNK_CONFIG.CHARS_PER_TOKEN
	);
}

/**
 * Splits text into sentences for better chunking boundaries
 */
function splitIntoSentences(text: string): string[] {
	// Enhanced sentence splitting that handles various punctuation
	const sentenceEnders = /[.!?]+\s+/g;

	// Add back the punctuation
	const result: string[] = [];
	let match;
	let lastIndex = 0;

	sentenceEnders.lastIndex = 0;

	while ((match = sentenceEnders.exec(text)) !== null) {
		const sentence = text
			.slice(lastIndex, match.index + match[0].length)
			.trim();
		if (sentence) result.push(sentence);
		lastIndex = match.index + match[0].length;
	}

	// Add the last sentence if it exists
	const lastSentence = text.slice(lastIndex).trim();
	if (lastSentence) result.push(lastSentence);

	return result;
}

/**
 * Creates document chunks optimized for AI context
 */
export function createDocumentChunks(
	content: string,
	documentId: string
): DocumentChunk[] {
	if (!content || content.trim().length === 0) {
		return [];
	}

	const chunks: DocumentChunk[] = [];
	const sentences = splitIntoSentences(content);

	if (sentences.length === 0) {
		// Fallback for content without clear sentence structure
		return createFallbackChunks(content, documentId);
	}

	let currentChunk = '';
	let currentStartIndex = 0;
	let chunkIndex = 0;

	for (let i = 0; i < sentences.length; i++) {
		const sentence = sentences[i];
		const potentialChunk =
			currentChunk +
			(currentChunk ? ' ' : '') +
			sentence;
		const tokenCount = estimateTokens(potentialChunk);

		if (tokenCount <= CHUNK_CONFIG.MAX_CHUNK_SIZE) {
			// Add sentence to current chunk
			currentChunk = potentialChunk;
		} else {
			// Create chunk if we have content
			if (currentChunk) {
				const chunk = createChunk(
					currentChunk,
					currentStartIndex,
					documentId,
					chunkIndex++
				);
				chunks.push(chunk);

				// Start new chunk with overlap
				const overlap = createOverlap(currentChunk);
				currentChunk =
					overlap +
					(overlap ? ' ' : '') +
					sentence;
				currentStartIndex = Math.max(
					0,
					chunk.endIndex - overlap.length
				);
			} else {
				// Sentence is too long, split it forcefully
				const forcedChunks = createForcedChunks(
					sentence,
					currentStartIndex,
					documentId,
					chunkIndex
				);
				chunks.push(...forcedChunks);
				chunkIndex += forcedChunks.length;
				currentStartIndex += sentence.length;
				currentChunk = '';
			}
		}
	}

	// Add final chunk if exists
	if (currentChunk) {
		chunks.push(
			createChunk(
				currentChunk,
				currentStartIndex,
				documentId,
				chunkIndex
			)
		);
	}

	return chunks;
}

/**
 * Creates a document chunk with metadata
 */
function createChunk(
	content: string,
	startIndex: number,
	documentId: string,
	index: number
): DocumentChunk {
	return {
		id: `${documentId}_chunk_${index}`,
		content: content.trim(),
		startIndex,
		endIndex: startIndex + content.length,
		tokenCount: estimateTokens(content),
	};
}

/**
 * Creates overlap text from the end of current chunk
 */
function createOverlap(text: string): string {
	const overlapChars =
		CHUNK_CONFIG.OVERLAP_SIZE *
		CHUNK_CONFIG.CHARS_PER_TOKEN;
	if (text.length <= overlapChars) return text;

	// Try to find a good break point (sentence or word boundary)
	const overlapText = text.slice(-overlapChars);
	const lastSentence = overlapText.lastIndexOf('. ');
	const lastWord = overlapText.lastIndexOf(' ');

	if (lastSentence > overlapChars / 2) {
		return overlapText.slice(lastSentence + 2);
	} else if (lastWord > overlapChars / 2) {
		return overlapText.slice(lastWord + 1);
	}

	return overlapText;
}

/**
 * Fallback chunking for content without clear sentence structure
 */
function createFallbackChunks(
	content: string,
	documentId: string
): DocumentChunk[] {
	const chunks: DocumentChunk[] = [];
	const maxChunkChars =
		CHUNK_CONFIG.MAX_CHUNK_SIZE *
		CHUNK_CONFIG.CHARS_PER_TOKEN;
	const overlapChars =
		CHUNK_CONFIG.OVERLAP_SIZE *
		CHUNK_CONFIG.CHARS_PER_TOKEN;

	let startIndex = 0;
	let chunkIndex = 0;

	while (startIndex < content.length) {
		let endIndex = Math.min(
			startIndex + maxChunkChars,
			content.length
		);

		// Try to find a good break point if not at the end
		if (endIndex < content.length) {
			const searchStart = Math.max(
				startIndex + maxChunkChars - 100,
				startIndex
			);
			const lastSpace = content.lastIndexOf(
				' ',
				endIndex
			);
			const lastNewline = content.lastIndexOf(
				'\n',
				endIndex
			);

			const bestBreak = Math.max(
				lastSpace,
				lastNewline
			);
			if (bestBreak > searchStart) {
				endIndex = bestBreak;
			}
		}

		const chunkContent = content.slice(
			startIndex,
			endIndex
		);
		chunks.push(
			createChunk(
				chunkContent,
				startIndex,
				documentId,
				chunkIndex++
			)
		);

		// Move start index with overlap
		startIndex = Math.max(
			startIndex + 1,
			endIndex - overlapChars
		);
	}

	return chunks;
}

/**
 * Forces splitting of overly long sentences
 */
function createForcedChunks(
	sentence: string,
	startIndex: number,
	documentId: string,
	startChunkIndex: number
): DocumentChunk[] {
	const chunks: DocumentChunk[] = [];
	const maxChunkChars =
		CHUNK_CONFIG.MAX_CHUNK_SIZE *
		CHUNK_CONFIG.CHARS_PER_TOKEN;

	let currentIndex = 0;
	let chunkIndex = startChunkIndex;

	while (currentIndex < sentence.length) {
		const endIndex = Math.min(
			currentIndex + maxChunkChars,
			sentence.length
		);
		const chunkContent = sentence.slice(
			currentIndex,
			endIndex
		);

		chunks.push(
			createChunk(
				chunkContent,
				startIndex + currentIndex,
				documentId,
				chunkIndex++
			)
		);
		currentIndex = endIndex;
	}

	return chunks;
}

/**
 * Gets relevant chunks for a query (future enhancement for semantic search)
 */
export function getRelevantChunks(
	chunks: DocumentChunk[],
	query: string,
	maxChunks: number = 3
): DocumentChunk[] {
	// Simple keyword-based relevance for now
	// This can be enhanced with semantic similarity in the future

	const queryWords = query
		.toLowerCase()
		.split(/\s+/)
		.filter((word) => word.length > 2);

	if (queryWords.length === 0) {
		// Return first few chunks if no meaningful query
		return chunks.slice(0, maxChunks);
	}

	const scoredChunks = chunks.map((chunk) => {
		const content = chunk.content.toLowerCase();
		let score = 0;

		queryWords.forEach((word) => {
			const matches = (
				content.match(new RegExp(word, 'g')) || []
			).length;
			score += matches;
		});

		return { chunk, score };
	});

	// Sort by relevance and return top chunks
	return scoredChunks
		.sort((a, b) => b.score - a.score)
		.slice(0, maxChunks)
		.map((item) => item.chunk);
}

/**
 * Combines chunks into context for AI
 */
export function combineChunksForContext(
	chunks: DocumentChunk[],
	maxTokens: number = 2000
): string {
	let totalTokens = 0;
	const selectedChunks: DocumentChunk[] = [];

	for (const chunk of chunks) {
		if (totalTokens + chunk.tokenCount <= maxTokens) {
			selectedChunks.push(chunk);
			totalTokens += chunk.tokenCount;
		} else {
			break;
		}
	}

	return selectedChunks
		.sort((a, b) => a.startIndex - b.startIndex) // Maintain document order
		.map((chunk) => chunk.content)
		.join('\n\n');
}
