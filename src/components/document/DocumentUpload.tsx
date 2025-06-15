import React, {
	useCallback,
	useRef,
	useState,
} from 'react';
import {
	MdAttachFile,
	MdDescription,
} from 'react-icons/md';
import { useTheme } from '../../contexts/ThemeContext';
import { useDocumentStore } from '../../stores/documentStore';
import { isValidDocumentType } from '../../utils/documentParser';
import { documentWorkerManager } from '../../utils/documentWorkerManager';
import { toast } from 'react-hot-toast';

interface DocumentUploadProps {
	onUploadComplete?: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
	onUploadComplete,
}) => {
	const { isDark } = useTheme();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadProgress, setUploadProgress] = useState(0);

	const {
		addDocument,
		setIsProcessing,
		isProcessing,
		updateDocumentProgress,
		cacheDocument,
	} = useDocumentStore();

	// Local processing state to prevent race conditions
	const [localProcessing, setLocalProcessing] =
		useState(false);
	const isCurrentlyProcessing =
		isProcessing || localProcessing;

	const handleFileSelect = useCallback(
		async (files: FileList | null) => {
			if (!files || files.length === 0) return;

			const file = files[0];

			// Validate file type
			if (!isValidDocumentType(file)) {
				toast.error(
					'Please upload a PDF or Word document (.pdf, .docx)'
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

			const documentId = `doc_${Date.now()}_${Math.random()
				.toString(36)
				.substr(2, 9)}`;
			setIsProcessing(true);
			setLocalProcessing(true);
			setUploadProgress(0);

			// Add initial document to store
			const initialDocument = {
				id: documentId,
				name: file.name,
				type: file.type || 'unknown',
				size: file.size,
				content: '',
				chunks: [],
				metadata: {
					wordCount: 0,
					characterCount: 0,
					uploadTime: new Date(),
					lastAccessed: new Date(),
					parseTime: 0,
					preview: '',
				},
				uploadedAt: new Date(),
				isLoaded: false,
				isProcessing: true,
				progress: 0,
			};

			addDocument(initialDocument);

			try {
				await documentWorkerManager.processDocument(
					file,
					documentId,
					{
						onProgress: ({ progress }) => {
							setUploadProgress(progress);
							updateDocumentProgress(
								documentId,
								progress
							);
						},
						onComplete: ({ document }) => {
							cacheDocument(
								documentId,
								document.content,
								document.chunks
							);

							// Auto-activate the newly uploaded document
							const { setActiveDocument } =
								useDocumentStore.getState();
							setActiveDocument(document);

							toast.success(
								`Document "${file.name}" uploaded and is now active!`
							);
							onUploadComplete?.();
							setUploadProgress(100);
						},
						onError: ({ error }) => {
							console.error(
								'Upload error:',
								error
							);
							toast.error(
								`Failed to upload ${file.name}: ${error}`
							);
							setIsProcessing(false); // Ensure processing state is reset
							setLocalProcessing(false);
							setUploadProgress(0);
						},
					}
				);
			} catch (error) {
				console.error('Upload error:', error);
				toast.error(
					error instanceof Error
						? error.message
						: 'Failed to upload document'
				);
				// Reset processing state immediately on error
				setIsProcessing(false);
				setLocalProcessing(false);
				setUploadProgress(0);
			} finally {
				// Ensure processing state is always reset
				setIsProcessing(false);
				setLocalProcessing(false);
				setUploadProgress(0);
			}
		},
		[
			addDocument,
			setIsProcessing,
			updateDocumentProgress,
			cacheDocument,
			onUploadComplete,
		]
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
				accept='.pdf,.docx'
				onChange={handleFileChange}
				style={{ display: 'none' }}
				disabled={isCurrentlyProcessing}
			/>

			<button
				type='button'
				onClick={handleButtonClick}
				disabled={isCurrentlyProcessing}
				className={`flex-shrink-0 p-3 text-2xl transition-all duration-200 relative ${
					isCurrentlyProcessing
						? 'opacity-50 cursor-not-allowed'
						: 'hover:scale-110'
				} ${
					isDark
						? 'text-chat-accent hover:text-chat-orange'
						: 'text-chat-light-accent hover:text-chat-orange'
				}`}
				title={
					isCurrentlyProcessing
						? `Processing document... ${uploadProgress}%`
						: 'Upload Document (PDF, Word)'
				}
			>
				{isCurrentlyProcessing ? (
					<div className='animate-spin'>
						<MdDescription />
					</div>
				) : (
					<MdAttachFile />
				)}

				{/* Progress indicator */}
				{isCurrentlyProcessing &&
					uploadProgress > 0 && (
						<div className='absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden'>
							<div
								className='h-full bg-blue-500 transition-all duration-300'
								style={{
									width: `${uploadProgress}%`,
								}}
							/>
						</div>
					)}
			</button>
		</>
	);
};

export default DocumentUpload;
