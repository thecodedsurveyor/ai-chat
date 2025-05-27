import React, {
	useState,
	useCallback,
	useEffect,
	useMemo,
} from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type {
	SearchFilters,
	ChatCategory,
	SearchResult,
} from '../../types';
import { cn } from '../../utils/classNames';
// React Icons imports
import {
	MdSearch,
	MdClose,
	MdFilterList,
	MdStar,
	MdRefresh,
	MdBusiness,
	MdPerson,
	MdScience,
	MdChat,
	MdMessage,
} from 'react-icons/md';

interface AdvancedSearchProps {
	isVisible: boolean;
	onClose: () => void;
	onSearch: (filters: SearchFilters) => void;
	onResultSelect: (result: SearchResult) => void;
	results: SearchResult[];
	isSearching: boolean;
	totalResults: number;
}

const CATEGORIES: {
	value: ChatCategory;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}[] = [
	{ value: 'work', label: 'Work', icon: MdBusiness },
	{
		value: 'personal',
		label: 'Personal',
		icon: MdPerson,
	},
	{
		value: 'research',
		label: 'Research',
		icon: MdScience,
	},
	{ value: 'general', label: 'General', icon: MdChat },
];

const MESSAGE_TYPES = [
	{ value: 'all' as const, label: 'All Messages' },
	{ value: 'prompt' as const, label: 'My Messages' },
	{ value: 'response' as const, label: 'AI Responses' },
];

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
	isVisible,
	onClose,
	onSearch,
	onResultSelect,
	results,
	isSearching,
	totalResults,
}) => {
	const { isDark } = useTheme();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] =
		useState<ChatCategory | ''>('');
	const [selectedTags, setSelectedTags] = useState<
		string[]
	>([]);
	const [newTag, setNewTag] = useState('');
	const [favoritesOnly, setFavoritesOnly] =
		useState(false);
	const [messageType, setMessageType] = useState<
		'prompt' | 'response' | 'all'
	>('all');
	const [dateRange, setDateRange] = useState({
		start: '',
		end: '',
	});
	const [showAdvancedFilters, setShowAdvancedFilters] =
		useState(false);

	// Common tags for suggestions
	const commonTags = [
		'important',
		'todo',
		'reference',
		'idea',
		'project',
		'urgent',
		'follow-up',
	];

	// Memoize the search filters to prevent unnecessary re-renders
	const searchFilters = useMemo(
		(): SearchFilters => ({
			query: searchQuery.trim(),
			category: selectedCategory || undefined,
			tags:
				selectedTags.length > 0
					? selectedTags
					: undefined,
			dateRange:
				dateRange.start && dateRange.end
					? dateRange
					: undefined,
			favoritesOnly,
			messageType,
		}),
		[
			searchQuery,
			selectedCategory,
			selectedTags,
			dateRange,
			favoritesOnly,
			messageType,
		]
	);

	// Debounced search effect
	useEffect(() => {
		// Only search if there are actual filters applied
		const hasFilters =
			searchQuery.trim() ||
			selectedCategory ||
			selectedTags.length > 0 ||
			favoritesOnly ||
			(dateRange.start && dateRange.end);

		if (hasFilters && isVisible) {
			const timeoutId = setTimeout(() => {
				onSearch(searchFilters);
			}, 300);
			return () => clearTimeout(timeoutId);
		}
	}, [
		searchQuery,
		selectedCategory,
		selectedTags,
		favoritesOnly,
		dateRange,
		messageType,
		isVisible,
		onSearch,
		searchFilters,
	]);

	const addTag = useCallback(() => {
		const trimmedTag = newTag.trim().toLowerCase();
		if (
			trimmedTag &&
			!selectedTags.includes(trimmedTag)
		) {
			setSelectedTags((prev) => [
				...prev,
				trimmedTag,
			]);
			setNewTag('');
		}
	}, [newTag, selectedTags]);

	const removeTag = useCallback((tagToRemove: string) => {
		setSelectedTags((prev) =>
			prev.filter((tag) => tag !== tagToRemove)
		);
	}, []);

	const clearAllFilters = useCallback(() => {
		setSearchQuery('');
		setSelectedCategory('');
		setSelectedTags([]);
		setFavoritesOnly(false);
		setMessageType('all');
		setDateRange({ start: '', end: '' });
		setNewTag('');
	}, []);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				addTag();
			}
		},
		[addTag]
	);

	const highlightText = useCallback(
		(text: string, query: string) => {
			if (!query.trim()) return text;
			const regex = new RegExp(
				`(${query.replace(
					/[.*+?^${}()|[\]\\]/g,
					'\\$&'
				)})`,
				'gi'
			);
			return text.replace(
				regex,
				'<mark class="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">$1</mark>'
			);
		},
		[]
	);

	// Reset filters when modal closes
	useEffect(() => {
		if (!isVisible) {
			clearAllFilters();
		}
	}, [isVisible, clearAllFilters]);

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
			<div
				className={cn(
					'w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl',
					isDark
						? 'bg-chat-primary border-2 border-chat-accent/30'
						: 'bg-white border-2 border-chat-pink/30'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'flex items-center justify-between p-6 border-b-2',
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-pink/30'
					)}
				>
					<div className='flex items-center gap-3'>
						<div className='p-2 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple'>
							<MdSearch className='text-white text-xl' />
						</div>
						<h2
							className={cn(
								'text-2xl font-bold',
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							)}
						>
							Advanced Search
						</h2>
					</div>
					<div className='flex items-center gap-2'>
						<button
							onClick={() =>
								setShowAdvancedFilters(
									!showAdvancedFilters
								)
							}
							className={cn(
								'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
								isDark
									? 'bg-chat-secondary text-chat-accent hover:bg-opacity-80'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							)}
						>
							<MdFilterList className='mr-2' />
							{showAdvancedFilters
								? 'Hide'
								: 'Show'}{' '}
							Filters
						</button>
						<button
							onClick={onClose}
							className={cn(
								'text-2xl transition-colors p-2 rounded-lg',
								isDark
									? 'text-chat-accent hover:text-white hover:bg-chat-secondary'
									: 'text-chat-light-close-button hover:text-chat-light-close-button-hover hover:bg-gray-100'
							)}
						>
							<MdClose />
						</button>
					</div>
				</div>

				{/* Search Input */}
				<div className='p-6 border-b border-gray-200 dark:border-gray-700'>
					<div
						className={cn(
							'flex items-center gap-4 p-4 rounded-xl border-2',
							isDark
								? 'bg-chat-secondary border-chat-accent/30'
								: 'bg-gray-50 border-gray-300'
						)}
					>
						<MdSearch className='text-xl text-gray-500' />
						<input
							type='text'
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(
									e.target.value
								)
							}
							placeholder='Search messages, chats, and content...'
							className={cn(
								'flex-1 bg-transparent text-lg placeholder:text-gray-500 focus:outline-none',
								isDark
									? 'text-white'
									: 'text-gray-800'
							)}
							autoFocus
						/>
						{searchQuery && (
							<button
								onClick={() =>
									setSearchQuery('')
								}
								className={cn(
									'transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700',
									isDark
										? 'text-gray-400 hover:text-white'
										: 'text-chat-light-close-button hover:text-chat-light-close-button-hover'
								)}
							>
								<MdClose className='text-xl' />
							</button>
						)}
					</div>
				</div>

				{/* Advanced Filters */}
				{showAdvancedFilters && (
					<div className='p-6 border-b border-gray-200 dark:border-gray-700 space-y-6'>
						{/* Quick Filters */}
						<div className='flex flex-wrap gap-3'>
							<button
								onClick={() =>
									setFavoritesOnly(
										!favoritesOnly
									)
								}
								className={cn(
									'px-4 py-2 rounded-full text-sm font-medium transition-colors',
									favoritesOnly
										? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
										: isDark
										? 'bg-chat-secondary text-chat-accent hover:bg-opacity-80'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								)}
							>
								<MdStar className='mr-2' />
								Favorites Only
							</button>
							<button
								onClick={clearAllFilters}
								className={cn(
									'px-4 py-2 rounded-full text-sm font-medium transition-colors',
									isDark
										? 'bg-red-600 text-white hover:bg-red-700'
										: 'bg-chat-light-button-danger text-white hover:bg-red-700'
								)}
							>
								<MdRefresh className='mr-2' />
								Clear All
							</button>
						</div>

						{/* Categories */}
						<div>
							<label
								className={cn(
									'block text-sm font-medium mb-3',
									isDark
										? 'text-chat-accent'
										: 'text-gray-700'
								)}
							>
								Category
							</label>
							<div className='flex flex-wrap gap-2'>
								{CATEGORIES.map(
									(category) => (
										<button
											key={
												category.value
											}
											onClick={() =>
												setSelectedCategory(
													selectedCategory ===
														category.value
														? ''
														: category.value
												)
											}
											className={cn(
												'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
												selectedCategory ===
													category.value
													? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
													: isDark
													? 'bg-chat-secondary text-chat-accent hover:bg-opacity-80'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
											)}
										>
											<category.icon className='text-lg' />
											{category.label}
										</button>
									)
								)}
							</div>
						</div>

						{/* Message Type */}
						<div>
							<label
								className={cn(
									'block text-sm font-medium mb-3',
									isDark
										? 'text-chat-accent'
										: 'text-gray-700'
								)}
							>
								Message Type
							</label>
							<div className='flex flex-wrap gap-2'>
								{MESSAGE_TYPES.map(
									(type) => (
										<button
											key={type.value}
											onClick={() =>
												setMessageType(
													type.value
												)
											}
											className={cn(
												'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
												messageType ===
													type.value
													? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
													: isDark
													? 'bg-chat-secondary text-chat-accent hover:bg-opacity-80'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
											)}
										>
											{type.label}
										</button>
									)
								)}
							</div>
						</div>

						{/* Tags */}
						<div>
							<label
								className={cn(
									'block text-sm font-medium mb-3',
									isDark
										? 'text-chat-accent'
										: 'text-gray-700'
								)}
							>
								Tags
							</label>
							<div className='space-y-3'>
								{/* Add new tag */}
								<div className='flex gap-2'>
									<input
										type='text'
										value={newTag}
										onChange={(e) =>
											setNewTag(
												e.target
													.value
											)
										}
										onKeyPress={
											handleKeyPress
										}
										placeholder='Add tag...'
										className={cn(
											'px-3 py-2 rounded-lg text-sm border-2 flex-1',
											isDark
												? 'bg-chat-secondary border-chat-accent/30 text-white placeholder:text-gray-500'
												: 'bg-white border-gray-300 text-gray-800 placeholder:text-gray-500'
										)}
									/>
									<button
										onClick={addTag}
										disabled={
											!newTag.trim()
										}
										className='px-4 py-2 bg-gradient-to-r from-chat-pink to-chat-purple text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
									>
										Add
									</button>
								</div>

								{/* Common tags */}
								<div className='flex flex-wrap gap-2'>
									{commonTags.map(
										(tag) => (
											<button
												key={tag}
												onClick={() => {
													if (
														!selectedTags.includes(
															tag
														)
													) {
														setSelectedTags(
															(
																prev
															) => [
																...prev,
																tag,
															]
														);
													}
												}}
												className={cn(
													'px-3 py-1 rounded-full text-xs font-medium transition-colors',
													selectedTags.includes(
														tag
													)
														? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
														: isDark
														? 'bg-chat-secondary text-chat-accent hover:bg-opacity-80'
														: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
												)}
											>
												#{tag}
											</button>
										)
									)}
								</div>

								{/* Selected tags */}
								{selectedTags.length >
									0 && (
									<div className='flex flex-wrap gap-2'>
										{selectedTags.map(
											(tag) => (
												<span
													key={
														tag
													}
													className='px-3 py-1 bg-gradient-to-r from-chat-pink to-chat-purple text-white rounded-full text-xs font-medium flex items-center gap-1'
												>
													#{tag}
													<button
														onClick={() =>
															removeTag(
																tag
															)
														}
														className='hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors'
														title='Remove tag'
													>
														<MdClose className='text-xs' />
													</button>
												</span>
											)
										)}
									</div>
								)}
							</div>
						</div>

						{/* Date Range */}
						<div>
							<label
								className={cn(
									'block text-sm font-medium mb-3',
									isDark
										? 'text-chat-accent'
										: 'text-gray-700'
								)}
							>
								Date Range
							</label>
							<div className='flex gap-4'>
								<div className='flex-1'>
									<input
										type='date'
										value={
											dateRange.start
										}
										onChange={(e) =>
											setDateRange(
												(prev) => ({
													...prev,
													start: e
														.target
														.value,
												})
											)
										}
										className={cn(
											'w-full px-3 py-2 rounded-lg text-sm border-2',
											isDark
												? 'bg-chat-secondary border-chat-accent/30 text-white'
												: 'bg-white border-gray-300 text-gray-800'
										)}
									/>
								</div>
								<span
									className={cn(
										'self-center text-sm',
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									)}
								>
									to
								</span>
								<div className='flex-1'>
									<input
										type='date'
										value={
											dateRange.end
										}
										onChange={(e) =>
											setDateRange(
												(prev) => ({
													...prev,
													end: e
														.target
														.value,
												})
											)
										}
										className={cn(
											'w-full px-3 py-2 rounded-lg text-sm border-2',
											isDark
												? 'bg-chat-secondary border-chat-accent/30 text-white'
												: 'bg-white border-gray-300 text-gray-800'
										)}
									/>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Results */}
				<div className='flex-1 overflow-y-auto max-h-96 p-6'>
					{isSearching ? (
						<div className='flex items-center justify-center py-8'>
							<div className='flex items-center gap-3'>
								<div className='animate-spin w-6 h-6 border-2 border-chat-pink border-t-transparent rounded-full'></div>
								<span
									className={cn(
										'text-lg',
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									)}
								>
									Searching...
								</span>
							</div>
						</div>
					) : results.length > 0 ? (
						<div className='space-y-4'>
							<div
								className={cn(
									'text-sm font-medium',
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								)}
							>
								{totalResults} result
								{totalResults !== 1
									? 's'
									: ''}{' '}
								found
							</div>
							{results.map(
								(result, index) => (
									<div
										key={`${
											result.type
										}-${
											result.chat.id
										}-${
											result.message
												?.id ||
											'chat'
										}-${index}`}
										onClick={() =>
											onResultSelect(
												result
											)
										}
										className={cn(
											'p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg',
											isDark
												? 'bg-chat-secondary border-chat-accent/20 hover:border-chat-orange/40'
												: 'bg-gray-50 border-gray-200 hover:border-chat-pink/40'
										)}
									>
										<div className='flex items-start justify-between mb-2'>
											<div className='flex items-center gap-3'>
												<div
													className={cn(
														'p-2 rounded-lg',
														result.type ===
															'chat'
															? 'bg-blue-100 text-blue-600'
															: 'bg-green-100 text-green-600'
													)}
												>
													{result.type ===
													'chat' ? (
														<MdChat className='text-lg' />
													) : (
														<MdMessage className='text-lg' />
													)}
												</div>
												<div>
													<h4
														className={cn(
															'font-medium',
															isDark
																? 'text-white'
																: 'text-gray-800'
														)}
													>
														{
															result
																.chat
																.displayId
														}
													</h4>
													<div className='flex items-center gap-2 text-xs text-gray-500'>
														{result
															.chat
															.category && (
															<span className='px-2 py-1 bg-gray-200 text-gray-700 rounded-full'>
																{
																	result
																		.chat
																		.category
																}
															</span>
														)}
														{result.chat.tags?.map(
															(
																tag
															) => (
																<span
																	key={
																		tag
																	}
																	className='text-chat-pink'
																>
																	#
																	{
																		tag
																	}
																</span>
															)
														)}
													</div>
												</div>
											</div>
											{result.message
												?.isFavorite && (
												<MdStar className='text-yellow-400' />
											)}
										</div>
										{result.message && (
											<div
												className={cn(
													'text-sm pl-11',
													isDark
														? 'text-chat-text'
														: 'text-gray-600'
												)}
											>
												<div
													dangerouslySetInnerHTML={{
														__html: highlightText(
															result.message.text.substring(
																0,
																200
															) +
																(result
																	.message
																	.text
																	.length >
																200
																	? '...'
																	: ''),
															searchQuery
														),
													}}
												/>
												<div className='text-xs text-gray-500 mt-1'>
													{
														result
															.message
															.timestamp
													}
												</div>
											</div>
										)}
									</div>
								)
							)}
						</div>
					) : searchQuery ||
					  selectedCategory ||
					  selectedTags.length > 0 ||
					  favoritesOnly ||
					  dateRange.start ? (
						<div className='flex items-center justify-center py-8'>
							<div className='text-center'>
								<MdSearch className='text-6xl text-gray-400 mb-4' />
								<h3
									className={cn(
										'text-xl font-medium mb-2',
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									)}
								>
									No results found
								</h3>
								<p className='text-gray-500'>
									Try adjusting your
									search criteria
								</p>
							</div>
						</div>
					) : (
						<div className='flex items-center justify-center py-8'>
							<div className='text-center'>
								<MdSearch className='text-6xl text-gray-400 mb-4' />
								<h3
									className={cn(
										'text-xl font-medium mb-2',
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									)}
								>
									Start searching
								</h3>
								<p className='text-gray-500'>
									Enter a search query or
									apply filters to find
									your conversations
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdvancedSearch;
