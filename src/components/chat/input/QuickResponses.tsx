import React, { useState } from 'react';
import { quickResponses } from '../../../data/quickResponses';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
// React Icons imports
import { MdClose } from 'react-icons/md';

type QuickResponsesProps = {
	onSelectResponse: (prompt: string) => void;
	isVisible: boolean;
	onClose: () => void;
};

const QuickResponses = ({
	onSelectResponse,
	isVisible,
	onClose,
}: QuickResponsesProps) => {
	const [selectedCategory, setSelectedCategory] =
		useState<string>('All');
	const { isDark } = useTheme();

	const categories = [
		'All',
		...new Set(quickResponses.map((r) => r.category)),
	];

	const filteredResponses =
		selectedCategory === 'All'
			? quickResponses
			: quickResponses.filter(
					(r) => r.category === selectedCategory
			  );

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div
				className={`w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden ${
					isDark ? 'bg-chat-primary' : 'bg-white'
				}`}
			>
				{/* Header */}
				<div
					className={`p-6 border-b-2 ${
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-pink/30'
					}`}
				>
					<div className='flex items-center justify-between'>
						<h2
							className={`text-2xl font-bold ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							Quick Response Templates
						</h2>
						<button
							onClick={onClose}
							className={cn(
								'text-2xl p-2 rounded-xl transition-colors',
								isDark
									? 'text-chat-accent hover:text-white hover:bg-chat-secondary'
									: 'text-chat-light-close-button hover:text-chat-light-close-button-hover hover:bg-gray-100'
							)}
						>
							<MdClose />
						</button>
					</div>

					{/* Category Tabs */}
					<div className='flex flex-wrap gap-2 mt-4'>
						{categories.map((category) => (
							<button
								key={category}
								onClick={() =>
									setSelectedCategory(
										category
									)
								}
								className={`px-4 py-2 rounded-xl font-medium transition-all ${
									selectedCategory ===
									category
										? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white shadow-lg'
										: isDark
										? 'bg-chat-secondary text-chat-text hover:bg-chat-accent/20'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				{/* Content */}
				<div className='p-6 overflow-y-auto max-h-96'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{filteredResponses.map(
							(response) => (
								<div
									key={response.id}
									onClick={() => {
										onSelectResponse(
											response.prompt
										);
										onClose();
									}}
									className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-105 border-2 ${
										isDark
											? 'bg-chat-secondary border-chat-accent/20 hover:border-chat-orange/40 hover:bg-opacity-80'
											: 'bg-gray-50 border-gray-200 hover:border-chat-pink/50 hover:bg-gray-100'
									}`}
								>
									<div
										className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mb-2 ${
											isDark
												? 'bg-chat-accent/20 text-chat-accent'
												: 'bg-chat-pink/20 text-chat-pink'
										}`}
									>
										{response.category}
									</div>
									<h3
										className={`font-semibold text-lg mb-2 ${
											isDark
												? 'text-white'
												: 'text-chat-light-text'
										}`}
									>
										{response.title}
									</h3>
									<p
										className={`text-sm leading-relaxed ${
											isDark
												? 'text-chat-text'
												: 'text-gray-600'
										}`}
									>
										{response.prompt}
									</p>
								</div>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuickResponses;
