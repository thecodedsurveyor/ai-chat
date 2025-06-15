import React, { useRef, useState } from 'react';
import {
	Paperclip,
	Upload,
	X,
	AlertCircle,
	CheckCircle2,
} from 'lucide-react';
import { useDocumentStore } from '../stores/documentStore';
import { toast } from 'react-hot-toast';
import { documentWorkerManager } from '../utils/documentWorkerManager';

interface UploadProgress {
	progress: number;
	message: string;
	isComplete: boolean;
}

interface DocumentUploadProps {
	variant?: 'icon' | 'button';
	className?: string;
}

export function DocumentUpload({
	variant = 'icon',
	className = '',
}: DocumentUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<
		Map<string, UploadProgress>
	>(new Map());

	const {
		addDocument,
		setIsProcessing,
		updateDocumentProgress,
		cacheDocument,
	} = useDocumentStore();

	const validateFile = (file: File): string | null => {
		const validTypes = [
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		];

		if (
			!validTypes.includes(file.type) &&
			!file.name.toLowerCase().endsWith('.pdf') &&
			!file.name.toLowerCase().endsWith('.docx')
		) {
			return 'Only PDF and DOCX files are supported';
		}

		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return 'File size must be less than 10MB';
		}

		return null;
	};

	const updateProgress = (
		documentId: string,
		progress: number,
		message: string,
		isComplete = false
	) => {
		setUploadProgress(
			(prev) =>
				new Map(
					prev.set(documentId, {
						progress,
						message,
						isComplete,
					})
				)
		);
		updateDocumentProgress(documentId, progress);
	};

	const handleFileProcessing = async (file: File) => {
		const documentId = `doc_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;

		updateProgress(
			documentId,
			0,
			'Starting upload...',
			false
		);
		setIsProcessing(true);

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
					onProgress: ({ progress, message }) => {
						updateProgress(
							documentId,
							progress,
							message
						);
					},
					onComplete: ({ document }) => {
						updateProgress(
							documentId,
							100,
							'Document processed successfully!',
							true
						);
						cacheDocument(
							documentId,
							document.content,
							document.chunks
						);

						toast.success(
							`📄 ${file.name} uploaded successfully!`,
							{
								duration: 4000,
								icon: '✅',
							}
						);

						setTimeout(() => {
							setUploadProgress((prev) => {
								const newMap = new Map(
									prev
								);
								newMap.delete(documentId);
								return newMap;
							});
						}, 3000);
					},
					onError: ({ error }) => {
						updateProgress(
							documentId,
							0,
							`Error: ${error}`,
							false
						);
						toast.error(
							`Failed to process ${file.name}: ${error}`
						);

						setTimeout(() => {
							setUploadProgress((prev) => {
								const newMap = new Map(
									prev
								);
								newMap.delete(documentId);
								return newMap;
							});
						}, 5000);
					},
				}
			);
		} catch (error) {
			console.error('Upload error:', error);
			toast.error(`Failed to upload ${file.name}`);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleFileSelect = async (files: FileList) => {
		const fileArray = Array.from(files);
		const validFiles: File[] = [];
		const errors: string[] = [];

		for (const file of fileArray) {
			const error = validateFile(file);
			if (error) {
				errors.push(`${file.name}: ${error}`);
			} else {
				validFiles.push(file);
			}
		}

		if (errors.length > 0) {
			toast.error(
				<div>
					<div className='font-medium'>
						Upload validation failed:
					</div>
					<ul className='mt-1 text-sm list-disc list-inside'>
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>,
				{ duration: 6000 }
			);
		}

		if (validFiles.length > 0) {
			if (validFiles.length > 1) {
				toast.success(
					`Processing ${validFiles.length} documents...`
				);
			}

			const promises = validFiles.map((file) =>
				handleFileProcessing(file)
			);
			await Promise.allSettled(promises);
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);
	};

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			await handleFileSelect(files);
		}
	};

	const ProgressIndicator = ({
		documentId,
		progress,
	}: {
		documentId: string;
		progress: UploadProgress;
	}) => (
		<div className='fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 min-w-80 max-w-sm z-50'>
			<div className='flex items-start gap-3'>
				<div className='flex-shrink-0 mt-0.5'>
					{progress.isComplete ? (
						<CheckCircle2 className='w-5 h-5 text-green-500' />
					) : progress.progress === 0 ? (
						<AlertCircle className='w-5 h-5 text-red-500' />
					) : (
						<Upload className='w-5 h-5 text-blue-500 animate-pulse' />
					)}
				</div>

				<div className='flex-1 min-w-0'>
					<div className='flex items-center justify-between'>
						<p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
							Processing Document
						</p>
						<button
							onClick={() => {
								setUploadProgress(
									(prev) => {
										const newMap =
											new Map(prev);
										newMap.delete(
											documentId
										);
										return newMap;
									}
								);
							}}
							className='flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
						>
							<X className='w-4 h-4' />
						</button>
					</div>

					<p className='text-xs text-gray-500 dark:text-gray-400 mt-1 break-words'>
						{progress.message}
					</p>

					{!progress.isComplete &&
						progress.progress > 0 && (
							<div className='mt-2'>
								<div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1'>
									<span>Progress</span>
									<span>
										{progress.progress}%
									</span>
								</div>
								<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
									<div
										className='bg-blue-500 h-2 rounded-full transition-all duration-300'
										style={{
											width: `${progress.progress}%`,
										}}
									/>
								</div>
							</div>
						)}
				</div>
			</div>
		</div>
	);

	const iconButton = (
		<button
			onClick={handleClick}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`
				relative p-2 rounded-lg transition-all duration-200
				${
					isDragOver
						? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 scale-110'
						: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
				}
				focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
				${className}
			`}
			title='Upload documents (PDF, DOCX)'
		>
			<Paperclip className='w-5 h-5' />
			{isDragOver && (
				<div className='absolute inset-0 bg-blue-500/20 rounded-lg animate-pulse' />
			)}
		</button>
	);

	const fullButton = (
		<button
			onClick={handleClick}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`
				relative flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed transition-all duration-200
				${
					isDragOver
						? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
						: 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
				}
				focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
				${className}
			`}
		>
			<Upload className='w-4 h-4' />
			<span className='text-sm font-medium'>
				{isDragOver
					? 'Drop files here'
					: 'Upload Documents'}
			</span>
			<span className='text-xs text-gray-500 dark:text-gray-400'>
				PDF, DOCX
			</span>
		</button>
	);

	return (
		<>
			<input
				ref={fileInputRef}
				type='file'
				multiple
				accept='.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
				onChange={(e) => {
					if (
						e.target.files &&
						e.target.files.length > 0
					) {
						handleFileSelect(e.target.files);
					}
				}}
				className='hidden'
			/>

			{variant === 'icon' ? iconButton : fullButton}

			{Array.from(uploadProgress.entries()).map(
				([documentId, progress]) => (
					<ProgressIndicator
						key={documentId}
						documentId={documentId}
						progress={progress}
					/>
				)
			)}
		</>
	);
}
