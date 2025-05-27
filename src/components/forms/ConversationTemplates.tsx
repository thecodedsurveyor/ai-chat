import React, {
	useState,
	useMemo,
	useCallback,
} from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/classNames';
import {
	TemplateManager,
	templateCategories,
} from '../../data/conversationTemplates';
import type {
	TemplateManagerProps,
	ConversationTemplate,
} from '../../types';
// React Icons imports
import {
	MdCollections,
	MdClose,
	MdSearch,
	MdBusiness,
	MdPerson,
	MdPalette,
	MdBook,
	MdChat,
} from 'react-icons/md';

const ConversationTemplates: React.FC<
	TemplateManagerProps
> = ({ isVisible, onClose, onSelectTemplate }) => {
	const { isDark } = useTheme();
	const [selectedCategory, setSelectedCategory] =
		useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTemplate, setSelectedTemplate] =
		useState<ConversationTemplate | null>(null);

	// Get templates based on category and search
	const filteredTemplates = useMemo(() => {
		let templates =
			TemplateManager.getTemplatesByCategory(
				selectedCategory
			);

		if (searchQuery.trim()) {
			templates =
				TemplateManager.searchTemplates(
					searchQuery
				);
			// If we have a category filter and search, intersect the results
			if (selectedCategory !== 'all') {
				const categoryTemplates =
					TemplateManager.getTemplatesByCategory(
						selectedCategory
					);
				templates = templates.filter((template) =>
					categoryTemplates.some(
						(ct) => ct.id === template.id
					)
				);
			}
		}

		return templates;
	}, [selectedCategory, searchQuery]);

	const handleTemplateSelect = useCallback(
		(template: ConversationTemplate) => {
			// Increment usage count
			TemplateManager.incrementUsageCount(
				template.id
			);

			// Call the parent handler
			onSelectTemplate(template);

			// Close the modal
			onClose();
		},
		[onSelectTemplate, onClose]
	);

	const handleTemplatePreview = useCallback(
		(template: ConversationTemplate) => {
			setSelectedTemplate(template);
		},
		[]
	);

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'work':
				return 'from-blue-500 to-blue-600';
			case 'personal':
				return 'from-green-500 to-green-600';
			case 'creative':
				return 'from-purple-500 to-purple-600';
			case 'learning':
				return 'from-orange-500 to-orange-600';
			case 'general':
				return 'from-gray-500 to-gray-600';
			default:
				return 'from-chat-pink to-chat-purple';
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'work':
				return MdBusiness;
			case 'personal':
				return MdPerson;
			case 'creative':
				return MdPalette;
			case 'learning':
				return MdBook;
			case 'general':
				return MdChat;
			default:
				return MdCollections;
		}
	};

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
			<div
				className={cn(
					'w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col',
					isDark ? 'bg-chat-primary' : 'bg-white'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'flex items-center justify-between p-6 border-b-2 flex-shrink-0',
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-pink/30'
					)}
				>
					<div className='flex items-center gap-3'>
						<div className='p-2 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple'>
							<MdCollections className='text-white text-xl' />
						</div>
						<h2
							className={cn(
								'text-xl md:text-2xl font-bold',
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							)}
						>
							Conversation Templates
						</h2>
					</div>
					<button
						onClick={onClose}
						className={cn(
							'text-2xl transition-colors p-2 rounded-xl',
							isDark
								? 'text-chat-accent hover:text-white hover:bg-chat-secondary'
								: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
						)}
					>
						<MdClose />
					</button>
				</div>

				{/* Search and Categories */}
				<div className='p-6 border-b border-gray-200 dark:border-chat-accent/20 flex-shrink-0'>
					{/* Search Bar */}
					<div className='mb-4'>
						<div className='relative'>
							<MdSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg' />
							<input
								type='text'
								placeholder='Search templates...'
								value={searchQuery}
								onChange={(e) =>
									setSearchQuery(
										e.target.value
									)
								}
								className={cn(
									'w-full pl-10 pr-4 py-2 rounded-lg border-2 transition-colors',
									isDark
										? 'bg-chat-secondary text-white border-chat-accent/30 focus:border-chat-pink placeholder:text-chat-accent/60'
										: 'bg-gray-50 text-gray-800 border-gray-300 focus:border-chat-pink placeholder:text-gray-500'
								)}
							/>
						</div>
					</div>

					{/* Category Tabs */}
					<div className='flex flex-wrap gap-2'>
						{templateCategories.map(
							(category) => (
								<button
									key={category.value}
									onClick={() =>
										setSelectedCategory(
											category.value
										)
									}
									className={cn(
										'px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2',
										selectedCategory ===
											category.value
											? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white shadow-lg'
											: isDark
											? 'bg-chat-secondary text-chat-accent hover:bg-chat-accent/20'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									)}
								>
									{React.createElement(
										getCategoryIcon(
											category.value
										),
										{
											className:
												'text-sm',
										}
									)}
									<span className='text-sm'>
										{category.label}
									</span>
									<span className='text-xs opacity-75 ml-1'>
										(
										{
											TemplateManager.getTemplatesByCategory(
												category.value
											).length
										}
										)
									</span>
								</button>
							)
						)}
					</div>
				</div>

				{/* Content */}
				<div className='flex flex-1 overflow-hidden'>
					{/* Templates List */}
					<div className='flex-1 overflow-y-auto p-6'>
						{filteredTemplates.length === 0 ? (
							<div className='text-center py-12'>
								<MdSearch className='text-6xl text-gray-400 mb-4' />
								<h3
									className={cn(
										'text-xl font-semibold mb-2',
										isDark
											? 'text-white'
											: 'text-gray-800'
									)}
								>
									No templates found
								</h3>
								<p className='text-gray-500'>
									Try adjusting your
									search or category
									filter
								</p>
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{filteredTemplates.map(
									(template) => (
										<div
											key={
												template.id
											}
											className={cn(
												'p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg',
												selectedTemplate?.id ===
													template.id
													? 'border-chat-pink bg-chat-pink/10'
													: isDark
													? 'border-chat-accent/30 hover:border-chat-orange/40 bg-chat-secondary/50'
													: 'border-gray-300 hover:border-chat-pink/40 bg-gray-50'
											)}
											onClick={() =>
												handleTemplatePreview(
													template
												)
											}
										>
											<div className='flex items-start justify-between mb-3'>
												<div className='flex items-center gap-2'>
													<div
														className={cn(
															'p-1.5 rounded-lg bg-gradient-to-r',
															getCategoryColor(
																template.category
															)
														)}
													>
														{React.createElement(
															getCategoryIcon(
																template.category
															),
															{
																className:
																	'text-white text-sm',
															}
														)}
													</div>
													<div>
														<h4
															className={cn(
																'font-semibold text-sm',
																isDark
																	? 'text-white'
																	: 'text-gray-800'
															)}
														>
															{
																template.name
															}
														</h4>
														<span className='text-xs text-gray-500 capitalize'>
															{
																template.category
															}
														</span>
													</div>
												</div>
												{template.isCustom && (
													<span className='text-xs bg-chat-purple text-white px-2 py-1 rounded-full'>
														Custom
													</span>
												)}
											</div>

											<p
												className={cn(
													'text-sm mb-3 line-clamp-2',
													isDark
														? 'text-chat-accent'
														: 'text-gray-600'
												)}
											>
												{
													template.description
												}
											</p>

											<div className='flex flex-wrap gap-1 mb-3'>
												{template.tags
													.slice(
														0,
														3
													)
													.map(
														(
															tag
														) => (
															<span
																key={
																	tag
																}
																className='text-xs px-2 py-1 bg-gray-200 dark:bg-chat-accent/20 text-gray-700 dark:text-chat-accent rounded-full'
															>
																#
																{
																	tag
																}
															</span>
														)
													)}
												{template
													.tags
													.length >
													3 && (
													<span className='text-xs text-gray-500'>
														+
														{template
															.tags
															.length -
															3}{' '}
														more
													</span>
												)}
											</div>

											<div className='flex items-center justify-between'>
												<span className='text-xs text-gray-500'>
													Used{' '}
													{
														template.usageCount
													}{' '}
													times
												</span>
												<button
													onClick={(
														e
													) => {
														e.stopPropagation();
														handleTemplateSelect(
															template
														);
													}}
													className='text-xs bg-gradient-to-r from-chat-pink to-chat-purple text-white px-3 py-1 rounded-lg hover:shadow-md transition-shadow'
												>
													Use
													Template
												</button>
											</div>
										</div>
									)
								)}
							</div>
						)}
					</div>

					{/* Template Preview */}
					{selectedTemplate && (
						<div
							className={cn(
								'w-1/3 border-l-2 p-6 overflow-y-auto',
								isDark
									? 'border-chat-accent/30 bg-chat-secondary/30'
									: 'border-gray-300 bg-gray-50'
							)}
						>
							<div className='flex items-center gap-3 mb-4'>
								<div
									className={cn(
										'p-2 rounded-lg bg-gradient-to-r',
										getCategoryColor(
											selectedTemplate.category
										)
									)}
								>
									{React.createElement(
										getCategoryIcon(
											selectedTemplate.category
										),
										{
											className:
												'text-white text-lg',
										}
									)}
								</div>
								<div>
									<h3
										className={cn(
											'font-bold text-lg',
											isDark
												? 'text-white'
												: 'text-gray-800'
										)}
									>
										{
											selectedTemplate.name
										}
									</h3>
									<span className='text-sm text-gray-500 capitalize'>
										{
											selectedTemplate.category
										}
									</span>
								</div>
							</div>

							<p
								className={cn(
									'text-sm mb-4',
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								)}
							>
								{
									selectedTemplate.description
								}
							</p>

							<div className='mb-4'>
								<h4
									className={cn(
										'font-semibold mb-2',
										isDark
											? 'text-white'
											: 'text-gray-800'
									)}
								>
									Template Prompt:
								</h4>
								<div
									className={cn(
										'p-3 rounded-lg text-sm whitespace-pre-wrap',
										isDark
											? 'bg-chat-primary border border-chat-accent/20 text-chat-text'
											: 'bg-white border border-gray-200 text-gray-700'
									)}
								>
									{
										selectedTemplate.prompt
									}
								</div>
							</div>

							<div className='mb-4'>
								<h4
									className={cn(
										'font-semibold mb-2',
										isDark
											? 'text-white'
											: 'text-gray-800'
									)}
								>
									Tags:
								</h4>
								<div className='flex flex-wrap gap-1'>
									{selectedTemplate.tags.map(
										(tag) => (
											<span
												key={tag}
												className='text-xs px-2 py-1 bg-gray-200 dark:bg-chat-accent/20 text-gray-700 dark:text-chat-accent rounded-full'
											>
												#{tag}
											</span>
										)
									)}
								</div>
							</div>

							<div className='mb-6'>
								<div className='text-xs text-gray-500 space-y-1'>
									<div>
										Used{' '}
										{
											selectedTemplate.usageCount
										}{' '}
										times
									</div>
									<div>
										Created:{' '}
										{new Date(
											selectedTemplate.createdAt
										).toLocaleDateString()}
									</div>
									{selectedTemplate.isCustom && (
										<div className='text-chat-purple font-medium'>
											Custom Template
										</div>
									)}
								</div>
							</div>

							<button
								onClick={() =>
									handleTemplateSelect(
										selectedTemplate
									)
								}
								className='w-full bg-gradient-to-r from-chat-pink to-chat-purple text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow'
							>
								Use This Template
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ConversationTemplates;
