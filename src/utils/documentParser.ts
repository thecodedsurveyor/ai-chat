import * as officeParser from 'officeparser';
import type { UploadedDocument } from '../stores/documentStore';

export const parseDocument = async (
	file: File
): Promise<string> => {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const data = await officeParser.parseOfficeAsync(
			arrayBuffer
		);
		return data || '';
	} catch (error) {
		console.error('Error parsing document:', error);
		throw new Error(
			`Failed to parse ${file.name}: ${error}`
		);
	}
};

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
		'application/msword', // .doc
		'application/vnd.oasis.opendocument.text', // .odt
	];

	const validExtensions = [
		'.pdf',
		'.doc',
		'.docx',
		'.odt',
	];

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
