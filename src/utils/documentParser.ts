import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { createDocumentChunks } from './documentChunking';
import type {
	UploadedDocument,
	DocumentMetadata,
} from '../stores/documentStore';

// Configure PDF.js worker to use local copy
pdfjsLib.GlobalWorkerOptions.workerSrc = `/assets/pdf.worker.min.js`;

/**
 * Enhanced document parser that returns content with metadata
 */
export async function parseDocumentWithMetadata(
	file: File,
	documentId: string
): Promise<UploadedDocument> {
	const startTime = Date.now();
	let content = '';
	let pageCount: number | undefined;

	try {
		if (
			file.type === 'application/pdf' ||
			file.name.toLowerCase().endsWith('.pdf')
		) {
			const result = await parsePDF(file);
			content = result.content;
			pageCount = result.pageCount;
		} else if (
			file.name.toLowerCase().endsWith('.docx')
		) {
			content = await parseDocx(file);
		} else {
			throw new Error(
				`Unsupported file type: ${
					file.type || 'unknown'
				}`
			);
		}

		const parseTime = Date.now() - startTime;
		const words = content
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0);
		const preview =
			content.trim().slice(0, 200) +
			(content.length > 200 ? '...' : '');

		// Create document chunks
		const chunks = createDocumentChunks(
			content,
			documentId
		);

		const metadata: DocumentMetadata = {
			pageCount,
			wordCount: words.length,
			characterCount: content.length,
			uploadTime: new Date(),
			lastAccessed: new Date(),
			parseTime,
			preview,
		};

		const document: UploadedDocument = {
			id: documentId,
			name: file.name,
			type: file.type || 'unknown',
			size: file.size,
			content,
			chunks,
			metadata,
			uploadedAt: new Date(),
			isLoaded: true,
			isProcessing: false,
			progress: 100,
		};

		return document;
	} catch (error) {
		throw error;
	}
}

// Keep the original function for backwards compatibility
export async function parseDocument(
	file: File
): Promise<string> {
	if (
		file.type === 'application/pdf' ||
		file.name.toLowerCase().endsWith('.pdf')
	) {
		const result = await parsePDF(file);
		return result.content;
	} else if (file.name.toLowerCase().endsWith('.docx')) {
		return await parseDocx(file);
	} else {
		throw new Error(
			`Unsupported file type: ${
				file.type || 'unknown'
			}`
		);
	}
}

interface PDFParseResult {
	content: string;
	pageCount: number;
}

async function parsePDF(
	file: File
): Promise<PDFParseResult> {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const pdf = await pdfjsLib.getDocument({
			data: arrayBuffer,
		}).promise;

		let fullText = '';
		const pageCount = pdf.numPages;

		for (let i = 1; i <= pageCount; i++) {
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();

			// Extract text with proper spacing
			const pageText = textContent.items
				.map((item) => {
					// Handle TextItem type from PDF.js
					if (
						typeof item === 'object' &&
						item !== null &&
						'str' in item
					) {
						return (item as { str: string })
							.str;
					}
					return '';
				})
				.join(' ')
				.replace(/\s+/g, ' ')
				.trim();

			if (pageText) {
				fullText +=
					(fullText ? '\n\n' : '') +
					`[Page ${i}]\n${pageText}`;
			}
		}

		if (!fullText.trim()) {
			throw new Error(
				'No text content found in PDF. The PDF might be image-based or corrupted.'
			);
		}

		return {
			content: fullText.trim(),
			pageCount,
		};
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes('Invalid PDF')) {
				throw new Error(
					'Invalid PDF file. Please ensure the file is not corrupted.'
				);
			}
			if (error.message.includes('password')) {
				throw new Error(
					'Password-protected PDFs are not supported.'
				);
			}
		}
		throw new Error(
			'Failed to parse PDF. Please try a different file.'
		);
	}
}

async function parseDocx(file: File): Promise<string> {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const result = await mammoth.extractRawText({
			arrayBuffer,
		});

		if (!result.value.trim()) {
			throw new Error(
				'No text content found in the document.'
			);
		}

		// Clean up the text
		const cleanText = result.value
			.replace(/\r\n/g, '\n')
			.replace(/\n{3,}/g, '\n\n')
			.trim();

		return cleanText;
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes('not a valid zip file')
		) {
			throw new Error(
				'Invalid DOCX file. Please ensure the file is not corrupted.'
			);
		}
		throw new Error(
			'Failed to parse DOCX file. Please try a different file.'
		);
	}
}

export const isValidDocumentType = (
	file: File
): boolean => {
	const validTypes = [
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
	];

	const validExtensions = ['.pdf', '.docx'];

	return (
		validTypes.includes(file.type) ||
		validExtensions.some((ext) =>
			file.name.toLowerCase().endsWith(ext)
		)
	);
};
