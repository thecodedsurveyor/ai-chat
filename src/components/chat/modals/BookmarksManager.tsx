import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { MessageBookmark } from '../../../types';
import { SmartBookmarks } from '../../../utils/smartBookmarks';
import { cn } from '../../../utils/classNames';
// React Icons imports
import {
	MdBookmark,
	MdClose,
	MdSearch,
	MdFilterList,
	MdLabel,
	MdCheckCircle,
	MdCancel,
	MdDelete,
} from 'react-icons/md';

interface BookmarksManagerProps {
	bookmarks: MessageBookmark[];
	onAcceptSuggestion: (bookmarkId: string) => void;
	onRejectSuggestion: (bookmarkId: string) => void;
	onDeleteBookmark: (bookmarkId: string) => void;
	onClose: () => void;
	className?: string;
}

const BookmarksManager: React.FC<BookmarksManagerProps> = ({
	bookmarks,
	onAcceptSuggestion,
	onRejectSuggestion,
	onDeleteBookmark,
	onClose,
	className,
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTags, setSelectedTags] = useState<
		string[]
	>([]);
	const [selectedImportance, setSelectedImportance] =
		useState<'low' | 'medium' | 'high' | undefined>();
	const [showSuggestions, setShowSuggestions] =
		useState(true);

	// Filter bookmarks based on search and filters
	const filteredBookmarks = useMemo(() => {
		return SmartBookmarks.filterBookmarks(
			bookmarks,
			searchQuery || undefined,
			selectedTags.length > 0
				? selectedTags
				: undefined,
			selectedImportance
		);
	}, [
		bookmarks,
		searchQuery,
		selectedTags,
		selectedImportance,
	]);

	// Separate suggestions from accepted bookmarks
	const suggestions = filteredBookmarks.filter(
		(b) => b.type === 'ai_suggested' && !b.isAccepted
	);
	const acceptedBookmarks = filteredBookmarks.filter(
		(b) => b.isAccepted
	);

	// Get all available tags
	const allTags = SmartBookmarks.getAllTags(bookmarks);

	// Get bookmark statistics
	const stats =
		SmartBookmarks.getBookmarkStats(bookmarks);

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag)
				? prev.filter((t) => t !== tag)
				: [...prev, tag]
		);
	};

	const clearFilters = () => {
		setSearchQuery('');
		setSelectedTags([]);
		setSelectedImportance(undefined);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={cn(
				'bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700',
				'flex flex-col max-h-[95vh] sm:max-h-[80vh] w-full max-w-4xl',
				className
			)}
		>
			{/* Header */}
			<div className='flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1'>
					<MdBookmark className='text-lg sm:text-xl text-blue-600 flex-shrink-0' />
					<h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate'>
						Bookmarks Manager
					</h2>
					<div className='hidden sm:flex items-center space-x-2 text-sm text-gray-500'>
						<span>{stats.total} total</span>
						{suggestions.length > 0 && (
							<>
								<span>•</span>
								<span className='text-blue-600'>
									{suggestions.length}{' '}
									suggestions
								</span>
							</>
						)}
					</div>
				</div>
				<button
					onClick={onClose}
					className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0'
				>
					<MdClose className='text-lg sm:text-xl' />
				</button>
			</div>

			{/* Mobile Stats - Only visible on small screens */}
			<div className='sm:hidden p-3 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center justify-center space-x-4 text-sm text-gray-500'>
					<span>{stats.total} total</span>
					{suggestions.length > 0 && (
						<span className='text-blue-600'>
							{suggestions.length} suggestions
						</span>
					)}
				</div>
			</div>

			{/* Search and Filters */}
			<div className='p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 space-y-3'>
				{/* Search Bar */}
				<div className='relative'>
					<MdSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base' />
					<input
						type='text'
						placeholder='Search bookmarks...'
						value={searchQuery}
						onChange={(e) =>
							setSearchQuery(e.target.value)
						}
						className='w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base'
					/>
				</div>

				{/* Filters */}
				<div className='flex flex-wrap items-center gap-2'>
					<MdFilterList className='text-gray-400 hidden sm:block' />

					{/* Importance Filter */}
					<select
						value={selectedImportance || ''}
						onChange={(e) =>
							setSelectedImportance(
								(e.target.value as
									| 'low'
									| 'medium'
									| 'high') || undefined
							)
						}
						className='px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500'
					>
						<option value=''>
							All Importance
						</option>
						<option value='high'>High</option>
						<option value='medium'>
							Medium
						</option>
						<option value='low'>Low</option>
					</select>

					{/* Tags Filter */}
					<div className='flex flex-wrap items-center gap-1'>
						{allTags
							.slice(
								0,
								window.innerWidth < 640
									? 4
									: 8
							)
							.map((tag) => (
								<button
									key={tag}
									onClick={() =>
										toggleTag(tag)
									}
									className={cn(
										'px-2 py-1 text-xs rounded-full border transition-colors flex items-center',
										selectedTags.includes(
											tag
										)
											? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
											: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
									)}
								>
									<MdLabel className='text-xs mr-1' />
									<span className='truncate max-w-[60px] sm:max-w-none'>
										{tag}
									</span>
								</button>
							))}
					</div>

					{/* Clear Filters */}
					{(searchQuery ||
						selectedTags.length > 0 ||
						selectedImportance) && (
						<button
							onClick={clearFilters}
							className='px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
						>
							Clear all
						</button>
					)}

					{/* Show/Hide Suggestions Toggle */}
					<button
						onClick={() =>
							setShowSuggestions(
								!showSuggestions
							)
						}
						className={cn(
							'px-3 py-1 text-xs rounded-full border transition-colors',
							showSuggestions
								? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
								: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600'
						)}
					>
						{showSuggestions ? 'Hide' : 'Show'}{' '}
						Suggestions
					</button>
				</div>
			</div>

			{/* Content */}
			<div className='flex-1 overflow-y-auto p-4 space-y-4'>
				{/* AI Suggestions */}
				{showSuggestions &&
					suggestions.length > 0 && (
						<div className='space-y-3'>
							<h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center'>
								<MdCheckCircle className='text-lg mr-2 text-blue-600' />
								AI Suggested Bookmarks (
								{suggestions.length})
							</h3>
							<div className='space-y-2'>
								{suggestions.map(
									(bookmark) => (
										<SuggestionCard
											key={
												bookmark.id
											}
											bookmark={
												bookmark
											}
											onAccept={() =>
												onAcceptSuggestion(
													bookmark.id
												)
											}
											onReject={() =>
												onRejectSuggestion(
													bookmark.id
												)
											}
										/>
									)
								)}
							</div>
						</div>
					)}

				{/* Accepted Bookmarks */}
				{acceptedBookmarks.length > 0 && (
					<div className='space-y-3'>
						<h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center'>
							<MdBookmark className='text-lg mr-2 text-green-600' />
							Your Bookmarks (
							{acceptedBookmarks.length})
						</h3>
						<div className='space-y-2'>
							{acceptedBookmarks.map(
								(bookmark) => (
									<BookmarkCard
										key={bookmark.id}
										bookmark={bookmark}
										onDelete={() =>
											onDeleteBookmark(
												bookmark.id
											)
										}
									/>
								)
							)}
						</div>
					</div>
				)}

				{/* Empty State */}
				{filteredBookmarks.length === 0 && (
					<div className='text-center py-8 text-gray-500 dark:text-gray-400'>
						{searchQuery ||
						selectedTags.length > 0 ||
						selectedImportance ? (
							<div>
								<MdSearch className='text-4xl mx-auto mb-2 opacity-50 block' />
								<p>
									No bookmarks match your
									filters
								</p>
								<button
									onClick={clearFilters}
									className='text-blue-600 hover:text-blue-700 text-sm mt-2'
								>
									Clear filters to see all
									bookmarks
								</button>
							</div>
						) : (
							<div>
								<MdBookmark className='text-4xl mx-auto mb-2 opacity-50 block' />
								<p>No bookmarks yet</p>
								<p className='text-sm'>
									Bookmarks will appear
									here as you create them
									or AI suggests them
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</motion.div>
	);
};

// Individual suggestion card component
const SuggestionCard: React.FC<{
	bookmark: MessageBookmark;
	onAccept: () => void;
	onReject: () => void;
}> = ({ bookmark, onAccept, onReject }) => {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3'
		>
			<div className='flex items-start justify-between'>
				<div className='flex-1 min-w-0'>
					<div className='flex items-center space-x-2 mb-1'>
						<span
							className={cn(
								'px-2 py-0.5 text-xs rounded border',
								bookmark.importance ===
									'high'
									? 'text-red-600 bg-red-50 border-red-200'
									: bookmark.importance ===
									  'medium'
									? 'text-yellow-600 bg-yellow-50 border-yellow-200'
									: 'text-gray-600 bg-gray-50 border-gray-200'
							)}
						>
							{bookmark.importance} priority
						</span>
						<span className='text-xs text-blue-600 dark:text-blue-400'>
							{Math.round(
								(bookmark.aiConfidence ||
									0) * 100
							)}
							% confidence
						</span>
					</div>
					<h4 className='font-medium text-gray-900 dark:text-gray-100 mb-1'>
						{bookmark.title}
					</h4>
					{bookmark.description && (
						<p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
							{bookmark.description}
						</p>
					)}
					{bookmark.tags.length > 0 && (
						<div className='flex flex-wrap gap-1'>
							{bookmark.tags.map((tag) => (
								<span
									key={tag}
									className='px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded'
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
				<div className='flex items-center space-x-1 ml-3'>
					<button
						onClick={onAccept}
						className='p-1.5 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors'
						title='Accept bookmark'
					>
						<MdCheckCircle className='text-lg' />
					</button>
					<button
						onClick={onReject}
						className='p-1.5 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors'
						title='Reject bookmark'
					>
						<MdCancel className='text-lg' />
					</button>
				</div>
			</div>
		</motion.div>
	);
};

// Individual bookmark card component
const BookmarkCard: React.FC<{
	bookmark: MessageBookmark;
	onDelete: () => void;
}> = ({ bookmark, onDelete }) => {
	const getImportanceColor = (
		importance: 'low' | 'medium' | 'high'
	) => {
		switch (importance) {
			case 'high':
				return 'text-red-600 bg-red-50 border-red-200';
			case 'medium':
				return 'text-yellow-600 bg-yellow-50 border-yellow-200';
			case 'low':
				return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow'
		>
			<div className='flex items-start justify-between'>
				<div className='flex-1 min-w-0'>
					<div className='flex items-center space-x-2 mb-1'>
						<span
							className={cn(
								'px-2 py-0.5 text-xs rounded border',
								getImportanceColor(
									bookmark.importance
								)
							)}
						>
							{bookmark.importance}
						</span>
						<span className='text-xs text-gray-500 dark:text-gray-400'>
							{new Date(
								bookmark.createdAt
							).toLocaleDateString()}
						</span>
					</div>
					<h4 className='font-medium text-gray-900 dark:text-gray-100 mb-1'>
						{bookmark.title}
					</h4>
					{bookmark.description && (
						<p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
							{bookmark.description}
						</p>
					)}
					{bookmark.tags.length > 0 && (
						<div className='flex flex-wrap gap-1'>
							{bookmark.tags.map((tag) => (
								<span
									key={tag}
									className='px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded'
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
				<button
					onClick={onDelete}
					className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors ml-3'
					title='Delete bookmark'
				>
					<MdDelete className='text-lg' />
				</button>
			</div>
		</motion.div>
	);
};

export default BookmarksManager;
