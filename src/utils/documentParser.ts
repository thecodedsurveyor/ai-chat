import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { UploadedDocument } from '../stores/documentStore';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseDocument = async (
	file: File
): Promise<string> => {
	try {
		const fileType = file.type.toLowerCase();
		const fileName = file.name.toLowerCase();

		if (
			fileType === 'application/pdf' ||
			fileName.endsWith('.pdf')
		) {
			return await parsePDF(file);
		} else if (
			fileType ===
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
			fileName.endsWith('.docx')
		) {
			return await parseDocx(file);
		} else if (
			fileType === 'application/msword' ||
			fileName.endsWith('.doc')
		) {
			// For .doc files, we'll show a message asking to convert to .docx
			throw new Error(
				'Please convert .doc files to .docx format for better compatibility'
			);
		} else {
			throw new Error(
				'Unsupported file format. Please upload PDF or DOCX files.'
			);
		}
	} catch (error) {
		console.error('Error parsing document:', error);
		throw new Error(
			`Failed to parse ${file.name}: ${
				error instanceof Error
					? error.message
					: 'Unknown error'
			}`
		);
	}
};

async function parsePDF(file: File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer();
	const pdf = await pdfjsLib.getDocument({
		data: arrayBuffer,
	}).promise;
	let fullText = '';

	for (
		let pageNum = 1;
		pageNum <= pdf.numPages;
		pageNum++
	) {
		const page = await pdf.getPage(pageNum);
		const textContent = await page.getTextContent();
		const pageText = textContent.items
			.map((item) => ('str' in item ? item.str : ''))
			.join(' ');
		fullText += pageText + '\n';
	}

	return fullText.trim();
}

async function parseDocx(file: File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer();
	const result = await mammoth.extractRawText({
		arrayBuffer,
	});
	return result.value;
}

export const createDocumentFromFile = async (
	file: File
): Promise<UploadedDocument> => {
	const content = await parseDocument(file);

	return {
		id: `doc_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`,
		name: file.name,
		type: file.type || 'unknown',
		size: file.size,
		content,
		uploadedAt: new Date(),
	};
};

export const isValidDocumentType = (
	file: File
): boolean => {
	const validTypes = [
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
		'application/msword', // .doc (will show conversion message)
	];

	const validExtensions = ['.pdf', '.doc', '.docx'];

	return (
		validTypes.includes(file.type) ||
		validExtensions.some((ext) =>
			file.name.toLowerCase().endsWith(ext)
		)
	);
};

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return (
		parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
		' ' +
		sizes[i]
	);
};
