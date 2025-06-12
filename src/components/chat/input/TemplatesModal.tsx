import React, {
	useState,
	useMemo,
	useCallback,
} from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
import { quickResponses } from '../../../data/quickResponses';
import {
	TemplateManager,
	templateCategories,
} from '../../../data/conversationTemplates';
import type { ConversationTemplate } from '../../../types';
import {
	MdClose,
	MdCollections,
	MdFlashOn,
	MdSearch,
} from 'react-icons/md';

interface TemplatesModalProps {
	isVisible: boolean;
	onClose: () => void;
	onSelectQuickResponse: (prompt: string) => void;
	onSelectTemplate: (
		template: ConversationTemplate
	) => void;
}

type TabType = 'quick' | 'templates';

const TemplatesModal: React.FC<TemplatesModalProps> = ({
	isVisible,
	onClose,
	onSelectQuickResponse,
	onSelectTemplate,
}) => {
	const { isDark } = useTheme();
	const [activeTab, setActiveTab] =
		useState<TabType>('quick');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] =
		useState('all');

	// Filter quick responses
	const filteredQuickResponses = useMemo(() => {
		let responses = [...quickResponses];

		if (selectedCategory !== 'all') {
			responses = responses.filter(
				(response) =>
					response.category === selectedCategory
			);
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			responses = responses.filter(
				(response) =>
					response.title
						.toLowerCase()
						.includes(query) ||
					response.prompt
						.toLowerCase()
						.includes(query) ||
					response.category
						.toLowerCase()
						.includes(query)
			);
		}

		return responses;
	}, [selectedCategory, searchQuery]);

	// Filter templates
	const filteredTemplates = useMemo(() => {
		let templates =
			selectedCategory === 'all'
				? TemplateManager.getAllTemplates()
				: TemplateManager.getTemplatesByCategory(
						selectedCategory
				  );

		if (searchQuery.trim()) {
			templates =
				TemplateManager.searchTemplates(
					searchQuery
				);
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

	// Get categories based on active tab
	const availableCategories = useMemo(() => {
		switch (activeTab) {
			case 'quick':
				return [
					'all',
					...Array.from(
						new Set(
							quickResponses.map(
								(r) => r.category
							)
						)
					),
				];
			case 'templates':
				return [
					'all',
					...templateCategories.map(
						(c) => c.value
					),
				].filter((c) => c !== 'all' || true);
			default:
				return ['all'];
		}
	}, [activeTab]);

	// Handlers
	const handleQuickResponseSelect = useCallback(
		(prompt: string) => {
			onSelectQuickResponse(prompt);
			onClose();
		},
		[onSelectQuickResponse, onClose]
	);

	const handleTemplateSelect = useCallback(
		(template: ConversationTemplate) => {
			TemplateManager.incrementUsageCount(
				template.id
			);
			onSelectTemplate(template);
			onClose();
		},
		[onSelectTemplate, onClose]
	);

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
			<div
				className={cn(
					'w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden',
					isDark
						? 'bg-chat-secondary border border-chat-accent/30'
						: 'bg-white border border-gray-200'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'flex items-center justify-between p-6 border-b',
						isDark
							? 'border-chat-accent/30'
							: 'border-gray-200'
					)}
				>
					<div>
						<h2
							className={cn(
								'text-xl sm:text-2xl font-bold',
								isDark
									? 'text-white'
									: 'text-gray-900'
							)}
						>
							Templates & Quick Responses
						</h2>
						<p
							className={cn(
								'text-sm mt-1',
								isDark
									? 'text-chat-text'
									: 'text-gray-600'
							)}
						>
							Choose from quick responses or
							conversation templates
						</p>
					</div>
					<button
						onClick={onClose}
						className={cn(
							'p-2 rounded-lg transition-colors',
							isDark
								? 'hover:bg-chat-accent/20 text-chat-accent'
								: 'hover:bg-gray-100 text-gray-600'
						)}
					>
						<MdClose className='text-xl' />
					</button>
				</div>

				{/* Content */}
				<div className='p-6 overflow-y-auto max-h-[70vh]'>
					{/* Tabs */}
					<div className='flex gap-2 mb-4'>
						<button
							onClick={() =>
								setActiveTab('quick')
							}
							className={cn(
								'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
								activeTab === 'quick'
									? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
									: isDark
									? 'bg-chat-accent/20 text-chat-accent hover:bg-chat-accent/30'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							)}
						>
							<MdFlashOn />
							Quick Responses
						</button>
						<button
							onClick={() =>
								setActiveTab('templates')
							}
							className={cn(
								'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
								activeTab === 'templates'
									? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
									: isDark
									? 'bg-chat-accent/20 text-chat-accent hover:bg-chat-accent/30'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							)}
						>
							<MdCollections />
							Templates
						</button>
					</div>

					{/* Search */}
					<div className='relative mb-4'>
						<MdSearch
							className={cn(
								'absolute left-3 top-1/2 transform -translate-y-1/2 text-lg',
								isDark
									? 'text-gray-400'
									: 'text-gray-500'
							)}
						/>
						<input
							type='text'
							placeholder={`Search ${activeTab}...`}
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(
									e.target.value
								)
							}
							className={cn(
								'w-full pl-10 pr-4 py-3 rounded-lg border transition-colors',
								isDark
									? 'bg-chat-primary border-chat-accent/30 text-white placeholder:text-gray-400 focus:border-chat-pink'
									: 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-chat-purple'
							)}
						/>
					</div>

					{/* Category Filter */}
					<div className='flex flex-wrap gap-2 mb-6'>
						{availableCategories.map(
							(category) => (
								<button
									key={category}
									onClick={() =>
										setSelectedCategory(
											category
										)
									}
									className={cn(
										'px-3 py-1.5 rounded-lg font-medium transition-all text-sm capitalize',
										selectedCategory ===
											category
											? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
											: isDark
											? 'bg-chat-accent/20 text-chat-accent hover:bg-chat-accent/30'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									)}
								>
									{category === 'all'
										? 'All'
										: category}
								</button>
							)
						)}
					</div>

					{/* Quick Responses */}
					{activeTab === 'quick' && (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{filteredQuickResponses.map(
								(response) => (
									<div
										key={response.id}
										onClick={() =>
											handleQuickResponseSelect(
												response.prompt
											)
										}
										className={cn(
											'p-4 rounded-xl cursor-pointer transition-all hover:scale-105 border-2',
											isDark
												? 'bg-chat-primary border-chat-accent/30 hover:border-chat-pink/50'
												: 'bg-gray-50 border-gray-200 hover:border-chat-pink/50 hover:shadow-lg'
										)}
									>
										<div
											className={cn(
												'text-xs px-2 py-1 rounded-full mb-3 uppercase tracking-wide font-medium inline-block',
												isDark
													? 'bg-chat-accent/20 text-chat-accent'
													: 'bg-chat-purple/20 text-chat-purple'
											)}
										>
											{
												response.category
											}
										</div>
										<h3
											className={cn(
												'font-semibold text-lg mb-2',
												isDark
													? 'text-white'
													: 'text-gray-900'
											)}
										>
											{response.title}
										</h3>
										<p
											className={cn(
												'text-sm leading-relaxed',
												isDark
													? 'text-chat-text'
													: 'text-gray-600'
											)}
										>
											{
												response.prompt
											}
										</p>
									</div>
								)
							)}
						</div>
					)}

					{/* Templates */}
					{activeTab === 'templates' && (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{filteredTemplates.map(
								(template) => (
									<div
										key={template.id}
										onClick={() =>
											handleTemplateSelect(
												template
											)
										}
										className={cn(
											'p-4 rounded-xl cursor-pointer transition-all hover:scale-105 border-2',
											isDark
												? 'bg-chat-primary border-chat-accent/30 hover:border-chat-purple/50'
												: 'bg-gray-50 border-gray-200 hover:border-chat-purple/50 hover:shadow-lg'
										)}
									>
										<div className='flex items-center gap-3 mb-3'>
											<div className='w-8 h-8 rounded-lg bg-gradient-to-r from-chat-purple to-chat-pink flex items-center justify-center'>
												<MdCollections className='text-white text-sm' />
											</div>
											<div className='flex-1'>
												<h4
													className={cn(
														'font-semibold text-base',
														isDark
															? 'text-white'
															: 'text-gray-900'
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
										<p
											className={cn(
												'text-sm mb-3 leading-relaxed',
												isDark
													? 'text-chat-text'
													: 'text-gray-600'
											)}
										>
											{
												template.description
											}
										</p>
										<div className='flex flex-wrap gap-1'>
											{template.tags
												.slice(0, 3)
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
										</div>
									</div>
								)
							)}
						</div>
					)}

					{/* No results */}
					{((activeTab === 'quick' &&
						filteredQuickResponses.length ===
							0) ||
						(activeTab === 'templates' &&
							filteredTemplates.length ===
								0)) && (
						<div className='text-center py-12'>
							<MdSearch
								className={cn(
									'text-6xl mb-4 mx-auto',
									isDark
										? 'text-gray-600'
										: 'text-gray-400'
								)}
							/>
							<h3
								className={cn(
									'text-xl font-semibold mb-2',
									isDark
										? 'text-gray-400'
										: 'text-gray-600'
								)}
							>
								No results found
							</h3>
							<p
								className={cn(
									'text-sm',
									isDark
										? 'text-gray-500'
										: 'text-gray-500'
								)}
							>
								Try adjusting your search or
								category filter
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TemplatesModal;
