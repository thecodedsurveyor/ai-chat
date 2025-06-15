// Document processing web worker
// This worker handles document parsing in the background to prevent UI blocking

// Configuration
const CHUNK_CONFIG = {
	MAX_CHUNK_SIZE: 1000,
	OVERLAP_SIZE: 100,
	CHARS_PER_TOKEN: 4,
};

// Progress tracking
let currentProgress = 0;

function updateProgress(progress, message) {
	currentProgress = progress;
	self.postMessage({
		type: 'progress',
		progress,
		message,
	});
}

function estimateTokens(text) {
	return Math.ceil(
		text.length / CHUNK_CONFIG.CHARS_PER_TOKEN
	);
}

function createPreview(content) {
	const preview = content.trim().slice(0, 200);
	return preview + (content.length > 200 ? '...' : '');
}

function calculateMetadata(content, parseTime) {
	const words = content
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0);

	return {
		wordCount: words.length,
		characterCount: content.length,
		uploadTime: new Date(),
		lastAccessed: new Date(),
		parseTime,
		preview: createPreview(content),
	};
}

function createDocumentChunks(content, documentId) {
	updateProgress(60, 'Creating document chunks...');

	if (!content || content.trim().length === 0) {
		return [];
	}

	const chunks = [];
	const maxChunkChars =
		CHUNK_CONFIG.MAX_CHUNK_SIZE *
		CHUNK_CONFIG.CHARS_PER_TOKEN;
	const overlapChars =
		CHUNK_CONFIG.OVERLAP_SIZE *
		CHUNK_CONFIG.CHARS_PER_TOKEN;

	let startIndex = 0;
	let chunkIndex = 0;

	// Split by paragraphs first for better chunking
	const paragraphs = content
		.split(/\n\s*\n/)
		.filter((p) => p.trim().length > 0);
	let currentChunk = '';
	let currentStartIndex = 0;

	for (let i = 0; i < paragraphs.length; i++) {
		const paragraph = paragraphs[i].trim();
		const potentialChunk =
			currentChunk +
			(currentChunk ? '\n\n' : '') +
			paragraph;

		if (potentialChunk.length <= maxChunkChars) {
			currentChunk = potentialChunk;
		} else {
			// Create chunk if we have content
			if (currentChunk) {
				chunks.push({
					id: `${documentId}_chunk_${chunkIndex}`,
					content: currentChunk.trim(),
					startIndex: currentStartIndex,
					endIndex:
						currentStartIndex +
						currentChunk.length,
					tokenCount:
						estimateTokens(currentChunk),
				});
				chunkIndex++;

				// Start new chunk with current paragraph
				currentChunk = paragraph;
				currentStartIndex = content.indexOf(
					currentChunk,
					currentStartIndex
				);
			} else {
				// Paragraph is too long, split it
				const words = paragraph.split(/\s+/);
				let wordChunk = '';
				let wordStartIndex = content.indexOf(
					paragraph,
					currentStartIndex
				);

				for (const word of words) {
					const potentialWordChunk =
						wordChunk +
						(wordChunk ? ' ' : '') +
						word;

					if (
						potentialWordChunk.length <=
						maxChunkChars
					) {
						wordChunk = potentialWordChunk;
					} else {
						if (wordChunk) {
							chunks.push({
								id: `${documentId}_chunk_${chunkIndex}`,
								content: wordChunk.trim(),
								startIndex: wordStartIndex,
								endIndex:
									wordStartIndex +
									wordChunk.length,
								tokenCount:
									estimateTokens(
										wordChunk
									),
							});
							chunkIndex++;
						}
						wordChunk = word;
						wordStartIndex +=
							wordChunk.length + 1;
					}
				}

				if (wordChunk) {
					currentChunk = wordChunk;
					currentStartIndex = wordStartIndex;
				}
			}
		}

		// Update progress
		updateProgress(
			60 + (i / paragraphs.length) * 20,
			`Processing chunk ${i + 1} of ${
				paragraphs.length
			}...`
		);
	}

	// Add final chunk if exists
	if (currentChunk) {
		chunks.push({
			id: `${documentId}_chunk_${chunkIndex}`,
			content: currentChunk.trim(),
			startIndex: currentStartIndex,
			endIndex:
				currentStartIndex + currentChunk.length,
			tokenCount: estimateTokens(currentChunk),
		});
	}

	updateProgress(
		80,
		'Document chunks created successfully'
	);
	return chunks;
}

async function generateSummary(content) {
	updateProgress(85, 'Generating document summary...');

	// Simple extractive summary - take first few sentences and key points
	const sentences = content
		.split(/[.!?]+/)
		.filter((s) => s.trim().length > 20);
	const summary = sentences.slice(0, 3).join('. ').trim();

	updateProgress(90, 'Summary generated');
	return summary + (summary ? '.' : '');
}

// Message handler
self.onmessage = async function (e) {
	const { type, data } = e.data;

	try {
		switch (type) {
			case 'parseDocument':
				await parseDocument(data);
				break;

			case 'generateSummary':
				const summary = await generateSummary(
					data.content
				);
				self.postMessage({
					type: 'summaryComplete',
					documentId: data.documentId,
					summary,
				});
				break;

			default:
				throw new Error(
					`Unknown message type: ${type}`
				);
		}
	} catch (error) {
		self.postMessage({
			type: 'error',
			error:
				error.message || 'Unknown error occurred',
		});
	}
};

async function parseDocument(data) {
	const { file, documentId } = data;
	const startTime = Date.now();

	updateProgress(10, 'Starting document processing...');

	try {
		let content = '';
		let metadata = {};

		if (
			file.type === 'application/pdf' ||
			file.name.toLowerCase().endsWith('.pdf')
		) {
			content = await parsePDFInWorker(file);
		} else if (
			file.name.toLowerCase().endsWith('.docx')
		) {
			content = await parseDocxInWorker(file);
		} else {
			throw new Error('Unsupported file type');
		}

		updateProgress(
			50,
			'Document parsed, processing content...'
		);

		const parseTime = Date.now() - startTime;
		metadata = calculateMetadata(content, parseTime);

		const chunks = createDocumentChunks(
			content,
			documentId
		);
		const summary = await generateSummary(content);

		updateProgress(95, 'Finalizing document...');

		const result = {
			id: documentId,
			name: file.name,
			type: file.type || 'unknown',
			size: file.size,
			content,
			chunks,
			metadata: {
				...metadata,
				summary,
			},
			uploadedAt: new Date(),
			isLoaded: true,
			isProcessing: false,
			progress: 100,
		};

		updateProgress(
			100,
			'Document processing complete!'
		);

		self.postMessage({
			type: 'parseComplete',
			document: result,
		});
	} catch (error) {
		self.postMessage({
			type: 'error',
			error:
				error.message ||
				'Failed to process document',
		});
	}
}

async function parsePDFInWorker(file) {
	updateProgress(20, 'Reading PDF file...');

	try {
		// For now, we'll indicate that PDF parsing should be handled in the main thread
		// since PDF.js has complex worker dependencies that are better handled there
		throw new Error('PDF_MAIN_THREAD_REQUIRED');
	} catch (error) {
		if (error.message === 'PDF_MAIN_THREAD_REQUIRED') {
			throw error;
		}
		throw new Error(
			`Failed to parse PDF: ${error.message}`
		);
	}
}

async function parseDocxInWorker(file) {
	updateProgress(20, 'Reading DOCX file...');

	try {
		// DOCX parsing requires mammoth library which has complex dependencies
		// Better to handle this in main thread where all libraries are available
		throw new Error('DOCX_MAIN_THREAD_REQUIRED');
	} catch (error) {
		if (error.message === 'DOCX_MAIN_THREAD_REQUIRED') {
			throw error;
		}
		throw new Error(
			`Failed to parse DOCX: ${error.message}`
		);
	}
}
