import React, { useState, useMemo } from 'react';
import {
	FileText,
	File,
	Trash2,
	Download,
	Eye,
	FileIcon,
	CheckSquare,
	Square,
	Search,
	X,
	Zap,
} from 'lucide-react';
import {
	useDocumentStore,
	type UploadedDocument,
} from '../stores/documentStore';
import {
	formatFileSize,
	formatDate,
} from '../utils/formatting';
import { toast } from 'react-hot-toast';

// File type icons mapping
const FILE_TYPE_ICONS = {
	'application/pdf': {
		icon: File,
		color: 'text-red-500',
		bg: 'bg-red-50 dark:bg-red-900/20',
	},
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		{
			icon: FileText,
			color: 'text-blue-500',
			bg: 'bg-blue-50 dark:bg-blue-900/20',
		},
	default: {
		icon: FileIcon,
		color: 'text-gray-500',
		bg: 'bg-gray-50 dark:bg-gray-900/20',
	},
};

const getFileTypeInfo = (type: string) => {
	return (
		FILE_TYPE_ICONS[
			type as keyof typeof FILE_TYPE_ICONS
		] || FILE_TYPE_ICONS.default
	);
};

const formatDuration = (ms: number): string => {
	if (ms < 1000) return `${ms}ms`;
	const seconds = Math.floor(ms / 1000);
	if (seconds < 60) return `${seconds}s`;
	const minutes = Math.floor(seconds / 60);
	return `${minutes}m ${seconds % 60}s`;
};

interface DocumentThumbnailProps {
	document: UploadedDocument;
	isSelected: boolean;
	onToggleSelect: () => void;
	onView: () => void;
	onActivate: () => void;
	isActive: boolean;
}

const DocumentThumbnail: React.FC<
	DocumentThumbnailProps
> = ({
	document,
	isSelected,
	onToggleSelect,
	onView,
	onActivate,
	isActive,
}) => {
	const typeInfo = getFileTypeInfo(document.type);
	const IconComponent = typeInfo.icon;

	return (
		<div
			className={`
			relative group bg-white dark:bg-gray-800 border rounded-lg p-4 transition-all duration-200 hover:shadow-md
			${
				isActive
					? 'ring-2 ring-blue-500 border-blue-500'
					: 'border-gray-200 dark:border-gray-700'
			}
			${
				isSelected
					? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300'
					: ''
			}
		`}
		>
			{/* Selection checkbox */}
			<button
				onClick={onToggleSelect}
				className='absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
			>
				{isSelected ? (
					<CheckSquare className='w-4 h-4 text-blue-500' />
				) : (
					<Square className='w-4 h-4' />
				)}
			</button>

			{/* Active indicator */}
			{isActive && (
				<div className='absolute top-3 right-3 w-2 h-2 bg-green-500 rounded-full animate-pulse' />
			)}

			{/* Processing indicator */}
			{document.isProcessing && (
				<div className='absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-lg flex items-center justify-center'>
					<div className='text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2'>
						<div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
						Processing...
					</div>
				</div>
			)}

			{/* Document thumbnail */}
			<div className='flex flex-col items-center text-center'>
				<div
					className={`w-16 h-16 rounded-lg flex items-center justify-center mb-3 ${typeInfo.bg}`}
				>
					<IconComponent
						className={`w-8 h-8 ${typeInfo.color}`}
					/>
				</div>

				<h3 className='font-medium text-gray-900 dark:text-gray-100 text-sm truncate w-full mb-2'>
					{document.name}
				</h3>

				{/* Document preview */}
				{document.metadata?.preview && (
					<p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2'>
						{document.metadata.preview}
					</p>
				)}

				{/* Metadata */}
				<div className='space-y-1 text-xs text-gray-500 dark:text-gray-400 w-full'>
					<div className='flex justify-between'>
						<span>Size:</span>
						<span>
							{formatFileSize(document.size)}
						</span>
					</div>
					{document.metadata && (
						<>
							<div className='flex justify-between'>
								<span>Words:</span>
								<span>
									{document.metadata.wordCount.toLocaleString()}
								</span>
							</div>
							<div className='flex justify-between'>
								<span>Parse time:</span>
								<span>
									{formatDuration(
										document.metadata
											.parseTime
									)}
								</span>
							</div>
						</>
					)}
				</div>

				{/* Actions */}
				<div className='flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity'>
					<button
						onClick={onView}
						className='p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded'
						title='View details'
					>
						<Eye className='w-4 h-4' />
					</button>
					<button
						onClick={onActivate}
						className='p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded'
						title={
							isActive
								? 'Currently active'
								: 'Activate document'
						}
					>
						<Zap className='w-4 h-4' />
					</button>
				</div>
			</div>
		</div>
	);
};

export function DocumentViewer() {
	const {
		documents,
		activeDocument,
		selectedDocuments,
		setActiveDocument,
		removeDocument,
		removeDocuments,
		toggleDocumentSelection,
		selectAllDocuments,
		clearSelection,
	} = useDocumentStore();

	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<
		'name' | 'date' | 'size' | 'type'
	>('date');
	const [sortOrder, setSortOrder] = useState<
		'asc' | 'desc'
	>('desc');
	const [showBulkActions, setShowBulkActions] =
		useState(false);
	const [viewMode, setViewMode] = useState<
		'grid' | 'list'
	>('grid');

	// Filter and sort documents
	const filteredAndSortedDocuments = useMemo(() => {
		let filtered = documents.filter(
			(doc) =>
				doc.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				(doc.metadata?.preview &&
					doc.metadata.preview
						.toLowerCase()
						.includes(
							searchQuery.toLowerCase()
						))
		);

		filtered.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(
						b.name
					);
					break;
				case 'date':
					comparison =
						new Date(a.uploadedAt).getTime() -
						new Date(b.uploadedAt).getTime();
					break;
				case 'size':
					comparison = a.size - b.size;
					break;
				case 'type':
					comparison = a.type.localeCompare(
						b.type
					);
					break;
			}

			return sortOrder === 'asc'
				? comparison
				: -comparison;
		});

		return filtered;
	}, [documents, searchQuery, sortBy, sortOrder]);

	const selectedCount = selectedDocuments.size;
	const totalCount = documents.length;

	const handleBulkDelete = async () => {
		if (selectedCount === 0) return;

		const selectedIds = Array.from(selectedDocuments);
		const documentNames = selectedIds
			.map(
				(id) =>
					documents.find((doc) => doc.id === id)
						?.name
			)
			.filter(Boolean);

		if (
			window.confirm(
				`Are you sure you want to delete ${selectedCount} document(s)?\n\n${documentNames.join(
					', '
				)}`
			)
		) {
			removeDocuments(selectedIds);
			toast.success(
				`Deleted ${selectedCount} document(s)`
			);
			setShowBulkActions(false);
		}
	};

	const handleBulkDownload = async () => {
		if (selectedCount === 0) return;

		// This would typically trigger downloads of selected documents
		toast.success(
			`Downloading ${selectedCount} document(s)...`
		);
		// Implementation would depend on requirements (ZIP file, individual downloads, etc.)
	};

	const handleSelectAll = () => {
		if (selectedCount === totalCount) {
			clearSelection();
		} else {
			selectAllDocuments();
		}
	};

	if (documents.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-12 text-center'>
				<FileIcon className='w-16 h-16 text-gray-300 mb-4' />
				<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
					No documents uploaded
				</h3>
				<p className='text-gray-500 dark:text-gray-400 max-w-md'>
					Upload your first document to start
					chatting about its content. You can
					upload PDF and DOCX files up to 10MB.
				</p>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header with search and controls */}
			<div className='flex flex-col gap-4'>
				{/* Search and view mode toggle */}
				<div className='flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between'>
					<div className='relative flex-1 max-w-md'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
						<input
							type='text'
							placeholder='Search documents...'
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(
									e.target.value
								)
							}
							className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
						{searchQuery && (
							<button
								onClick={() =>
									setSearchQuery('')
								}
								className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
							>
								<X className='w-4 h-4' />
							</button>
						)}
					</div>

					<div className='flex items-center gap-2'>
						{/* Sort controls */}
						<select
							value={`${sortBy}-${sortOrder}`}
							onChange={(e) => {
								const [
									newSortBy,
									newSortOrder,
								] = e.target.value.split(
									'-'
								) as [
									typeof sortBy,
									typeof sortOrder
								];
								setSortBy(newSortBy);
								setSortOrder(newSortOrder);
							}}
							className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							<option value='date-desc'>
								Newest first
							</option>
							<option value='date-asc'>
								Oldest first
							</option>
							<option value='name-asc'>
								Name A-Z
							</option>
							<option value='name-desc'>
								Name Z-A
							</option>
							<option value='size-desc'>
								Largest first
							</option>
							<option value='size-asc'>
								Smallest first
							</option>
						</select>

						{/* Bulk actions toggle */}
						<button
							onClick={() =>
								setShowBulkActions(
									!showBulkActions
								)
							}
							className={`p-2 rounded-lg transition-colors ${
								showBulkActions
									? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
									: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
							}`}
							title='Bulk actions'
						>
							<CheckSquare className='w-4 h-4' />
						</button>
					</div>
				</div>

				{/* Bulk actions bar */}
				{showBulkActions && (
					<div className='flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
						<div className='flex items-center gap-3'>
							<button
								onClick={handleSelectAll}
								className='flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200'
							>
								{selectedCount ===
								totalCount ? (
									<CheckSquare className='w-4 h-4' />
								) : (
									<Square className='w-4 h-4' />
								)}
								{selectedCount ===
								totalCount
									? 'Deselect all'
									: 'Select all'}
							</button>
							{selectedCount > 0 && (
								<span className='text-sm text-gray-600 dark:text-gray-400'>
									{selectedCount} of{' '}
									{totalCount} selected
								</span>
							)}
						</div>

						{selectedCount > 0 && (
							<div className='flex items-center gap-2'>
								<button
									onClick={
										handleBulkDownload
									}
									className='flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors'
								>
									<Download className='w-4 h-4' />
									Download
								</button>
								<button
									onClick={
										handleBulkDelete
									}
									className='flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors'
								>
									<Trash2 className='w-4 h-4' />
									Delete
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Document grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
				{filteredAndSortedDocuments.map(
					(document) => (
						<DocumentThumbnail
							key={document.id}
							document={document}
							isSelected={selectedDocuments.has(
								document.id
							)}
							isActive={
								activeDocument?.id ===
								document.id
							}
							onToggleSelect={() =>
								toggleDocumentSelection(
									document.id
								)
							}
							onView={() => {
								// Implement document detail view
								toast.info(
									`Viewing details for ${document.name}`
								);
							}}
							onActivate={() => {
								setActiveDocument(document);
								toast.success(
									`Activated ${document.name}`
								);
							}}
						/>
					)
				)}
			</div>

			{/* Results info */}
			{searchQuery && (
				<div className='text-center text-sm text-gray-500 dark:text-gray-400'>
					{filteredAndSortedDocuments.length === 0
						? `No documents found matching "${searchQuery}"`
						: `Found ${filteredAndSortedDocuments.length} document(s) matching "${searchQuery}"`}
				</div>
			)}
		</div>
	);
}
