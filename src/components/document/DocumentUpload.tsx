import React, { useCallback, useRef } from 'react';
import {
	MdAttachFile,
	MdDescription,
} from 'react-icons/md';
import { useTheme } from '../../contexts/ThemeContext';
import { useDocumentStore } from '../../stores/documentStore';
import {
	createDocumentFromFile,
	isValidDocumentType,
} from '../../utils/documentParser';
import toast from 'react-hot-toast';

interface DocumentUploadProps {
	onUploadComplete?: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
	onUploadComplete,
}) => {
	const { isDark } = useTheme();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { addDocument, setIsProcessing, isProcessing } =
		useDocumentStore();

	const handleFileSelect = useCallback(
		async (files: FileList | null) => {
			if (!files || files.length === 0) return;

			const file = files[0];

			// Validate file type
			if (!isValidDocumentType(file)) {
				toast.error(
					'Please upload a PDF or Word document (.pdf, .doc, .docx)'
				);
				return;
			}

			// Validate file size (max 10MB)
			const maxSize = 10 * 1024 * 1024; // 10MB
			if (file.size > maxSize) {
				toast.error(
					'File size must be less than 10MB'
				);
				return;
			}

			setIsProcessing(true);

			try {
				const document =
					await createDocumentFromFile(file);
				addDocument(document);

				toast.success(
					`Document "${file.name}" uploaded and parsed successfully!`
				);
				onUploadComplete?.();
			} catch (error) {
				console.error('Upload error:', error);
				toast.error(
					error instanceof Error
						? error.message
						: 'Failed to upload document'
				);
			} finally {
				setIsProcessing(false);
			}
		},
		[addDocument, setIsProcessing, onUploadComplete]
	);

	const handleButtonClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleFileSelect(e.target.files);
		},
		[handleFileSelect]
	);

	return (
		<>
			<input
				ref={fileInputRef}
				type='file'
				accept='.pdf,.doc,.docx,.odt'
				onChange={handleFileChange}
				style={{ display: 'none' }}
				disabled={isProcessing}
			/>

			<button
				type='button'
				onClick={handleButtonClick}
				disabled={isProcessing}
				className={`flex-shrink-0 p-3 text-2xl transition-all duration-200 ${
					isProcessing
						? 'opacity-50 cursor-not-allowed'
						: 'hover:scale-110'
				} ${
					isDark
						? 'text-chat-accent hover:text-chat-orange'
						: 'text-chat-light-accent hover:text-chat-orange'
				}`}
				title={
					isProcessing
						? 'Processing document...'
						: 'Upload Document (PDF, Word)'
				}
			>
				{isProcessing ? (
					<div className='animate-spin'>
						<MdDescription />
					</div>
				) : (
					<MdAttachFile />
				)}
			</button>
		</>
	);
};

export default DocumentUpload;
