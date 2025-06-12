import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { AIPersona } from '../../../types';
import { PersonaManager } from '../../../utils/aiPersonas';
import { cn } from '../../../utils/classNames';
import { useActivePersona } from '../../../stores/chatStore';
// React Icons imports
import {
	MdClose,
	MdSearch,
	MdCheckCircle,
	MdSearchOff,
	MdGridView,
	MdAndroid,
	MdPalette,
	MdBook,
	MdBusiness,
	MdEmojiEmotions,
	MdSchool,
	MdCode,
	MdEdit,
	MdTrendingUp,
	MdFavorite,
	MdSpa,
	MdRestaurant,
} from 'react-icons/md';

interface PersonaSelectorProps {
	selectedPersona?: AIPersona;
	onPersonaSelect: (persona: AIPersona) => void;
	isVisible: boolean;
	onClose: () => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
	selectedPersona,
	onPersonaSelect,
	isVisible,
	onClose,
}) => {
	const { isDark } = useTheme();
	const [selectedCategory, setSelectedCategory] =
		useState<AIPersona['category'] | 'all'>('all');
	const [searchQuery, setSearchQuery] = useState('');
	const activePersona = useActivePersona();

	// Use active persona if no selected persona is passed
	const currentSelectedPersona =
		selectedPersona || activePersona;

	// Map persona icon strings to React components
	const getPersonaIcon = (iconName: string) => {
		switch (iconName) {
			case 'MdAndroid':
				return MdAndroid;
			case 'MdSchool':
				return MdSchool;
			case 'MdCode':
				return MdCode;
			case 'MdEdit':
				return MdEdit;
			case 'MdTrendingUp':
				return MdTrendingUp;
			case 'MdSearch':
				return MdSearch;
			case 'MdFavorite':
				return MdFavorite;
			case 'MdEmojiEmotions':
				return MdEmojiEmotions;
			case 'MdSpa':
				return MdSpa;
			case 'MdRestaurant':
				return MdRestaurant;
			default:
				return MdAndroid;
		}
	};

	const allPersonas = useMemo(
		() => PersonaManager.getAllPersonas(),
		[]
	);

	const filteredPersonas = useMemo(() => {
		let personas = allPersonas;

		// Filter by category
		if (selectedCategory !== 'all') {
			personas = personas.filter(
				(persona) =>
					persona.category === selectedCategory
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			personas = personas.filter(
				(persona) =>
					persona.name
						.toLowerCase()
						.includes(query) ||
					persona.description
						.toLowerCase()
						.includes(query)
			);
		}

		return personas;
	}, [allPersonas, selectedCategory, searchQuery]);

	const categories = [
		{ id: 'all', name: 'All', icon: MdGridView },
		{
			id: 'assistant',
			name: 'Assistant',
			icon: MdAndroid,
		},
		{
			id: 'creative',
			name: 'Creative',
			icon: MdPalette,
		},
		{
			id: 'educational',
			name: 'Educational',
			icon: MdBook,
		},
		{
			id: 'professional',
			name: 'Professional',
			icon: MdBusiness,
		},
		{ id: 'fun', name: 'Fun', icon: MdEmojiEmotions },
	];

	const handlePersonaSelect = (persona: AIPersona) => {
		onPersonaSelect(persona);
		onClose();
	};

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4'>
			<div
				className={cn(
					'w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl border overflow-hidden',
					isDark
						? 'bg-chat-primary border-chat-accent/30'
						: 'bg-white border-gray-200'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'p-4 sm:p-6 border-b',
						isDark
							? 'border-chat-accent/30'
							: 'border-gray-200'
					)}
				>
					<div className='flex items-center justify-between mb-3 sm:mb-4'>
						<h2
							className={cn(
								'text-xl sm:text-2xl font-bold',
								isDark
									? 'text-white'
									: 'text-gray-900'
							)}
						>
							Choose AI Persona
						</h2>
						<button
							onClick={onClose}
							className={cn(
								'p-2 rounded-lg transition-colors',
								isDark
									? 'text-gray-400 hover:text-white hover:bg-white/10'
									: 'text-chat-light-close-button hover:text-chat-light-close-button-hover hover:bg-gray-100'
							)}
						>
							<MdClose className='text-lg sm:text-xl' />
						</button>
					</div>

					{/* Search */}
					<div className='relative mb-3 sm:mb-4'>
						<MdSearch
							className={cn(
								'absolute left-3 top-1/2 transform -translate-y-1/2 text-base sm:text-lg',
								isDark
									? 'text-gray-400'
									: 'text-gray-500'
							)}
						/>
						<input
							type='text'
							placeholder='Search personas...'
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(
									e.target.value
								)
							}
							className={cn(
								'w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 rounded-lg border transition-colors text-sm sm:text-base',
								isDark
									? 'bg-chat-secondary border-chat-accent/30 text-white placeholder-gray-400 focus:border-chat-accent'
									: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
							)}
						/>
					</div>

					{/* Categories */}
					<div className='flex flex-wrap gap-1 sm:gap-2'>
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() =>
									setSelectedCategory(
										category.id as
											| AIPersona['category']
											| 'all'
									)
								}
								className={cn(
									'flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium transition-colors text-sm',
									selectedCategory ===
										category.id
										? isDark
											? 'bg-chat-accent text-white'
											: 'bg-blue-500 text-white'
										: isDark
										? 'bg-chat-secondary text-gray-300 hover:bg-white/10'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								)}
							>
								<category.icon className='text-base sm:text-lg' />
								<span className='hidden sm:inline'>
									{category.name}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Personas Grid */}
				<div className='p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-280px)] sm:max-h-[calc(90vh-280px)]'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
						{filteredPersonas.map((persona) => (
							<div
								key={persona.id}
								onClick={() =>
									handlePersonaSelect(
										persona
									)
								}
								className={cn(
									'p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105',
									currentSelectedPersona?.id ===
										persona.id
										? isDark
											? 'border-chat-accent bg-chat-accent/10'
											: 'border-blue-500 bg-blue-50'
										: isDark
										? 'border-chat-accent/30 bg-chat-secondary hover:border-chat-accent/50'
										: 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
								)}
							>
								{/* Persona Icon */}
								<div className='flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3'>
									<div
										className={cn(
											'w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r flex items-center justify-center',
											persona.color
										)}
									>
										{React.createElement(
											getPersonaIcon(
												persona.icon
											),
											{
												className:
													'text-xl sm:text-2xl text-white',
											}
										)}
									</div>
									<div className='flex-1 min-w-0'>
										<h3
											className={cn(
												'font-semibold truncate text-sm sm:text-base',
												isDark
													? 'text-white'
													: 'text-gray-900'
											)}
										>
											{persona.name}
										</h3>
										{persona.isCustom && (
											<span
												className={cn(
													'text-xs px-2 py-1 rounded-full',
													isDark
														? 'bg-purple-500/20 text-purple-300'
														: 'bg-purple-100 text-purple-700'
												)}
											>
												Custom
											</span>
										)}
									</div>
								</div>

								{/* Description */}
								<p
									className={cn(
										'text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-600'
									)}
								>
									{persona.description}
								</p>

								{/* Category Badge */}
								<div className='flex items-center justify-between'>
									<span
										className={cn(
											'text-xs px-2 py-1 rounded-full capitalize',
											isDark
												? 'bg-white/10 text-gray-300'
												: 'bg-gray-100 text-gray-600'
										)}
									>
										{persona.category}
									</span>
									{currentSelectedPersona?.id ===
										persona.id && (
										<MdCheckCircle
											className={cn(
												'text-base sm:text-lg',
												isDark
													? 'text-chat-accent'
													: 'text-blue-500'
											)}
										/>
									)}
								</div>
							</div>
						))}
					</div>

					{filteredPersonas.length === 0 && (
						<div className='text-center py-12'>
							<MdSearchOff
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
								No personas found
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

export default PersonaSelector;
