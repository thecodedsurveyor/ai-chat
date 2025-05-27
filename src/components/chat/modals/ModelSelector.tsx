import React, { useState } from 'react';
import {
	OPENROUTER_MODELS,
	type OpenRouterModel,
} from '../../../utils/openRouter';
import { useChatStore } from '../../../stores/chatStore';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
import {
	MdExpandMore,
	MdCheck,
	MdSmartToy,
} from 'react-icons/md';

const ModelSelector: React.FC = () => {
	const { isDark } = useTheme();
	const [isOpen, setIsOpen] = useState(false);

	const modelConfig = useChatStore(
		(state) => state.modelConfig
	);
	const setModelConfig = useChatStore(
		(state) => state.setModelConfig
	);

	const handleModelChange = (model: string) => {
		setModelConfig({ model: model as OpenRouterModel });
		setIsOpen(false);
	};

	// Get display name for current model
	const getCurrentModelName = () => {
		const entry = Object.entries(
			OPENROUTER_MODELS
		).find(([, value]) => value === modelConfig.model);
		return entry
			? entry[0].replace(/_/g, ' ')
			: 'Unknown Model';
	};

	// Get model provider info
	const getModelInfo = (modelKey: string) => {
		if (modelKey.includes('GEMINI')) {
			return {
				color: 'from-blue-500 to-cyan-600',
				provider: 'Google',
				bgColor: isDark
					? 'bg-blue-500/20'
					: 'bg-blue-50',
				textColor: isDark
					? 'text-blue-400'
					: 'text-blue-700',
			};
		} else if (
			modelKey.includes('LLAMA') ||
			modelKey.includes('GROQ')
		) {
			return {
				color: 'from-purple-500 to-violet-600',
				provider: 'Meta/Groq',
				bgColor: isDark
					? 'bg-purple-500/20'
					: 'bg-purple-50',
				textColor: isDark
					? 'text-purple-400'
					: 'text-purple-700',
			};
		} else if (modelKey.includes('QWEN')) {
			return {
				color: 'from-emerald-500 to-green-600',
				provider: 'Qwen',
				bgColor: isDark
					? 'bg-emerald-500/20'
					: 'bg-emerald-50',
				textColor: isDark
					? 'text-emerald-400'
					: 'text-emerald-700',
			};
		}
		return {
			color: 'from-gray-500 to-slate-600',
			provider: 'AI',
			bgColor: isDark
				? 'bg-gray-500/20'
				: 'bg-gray-50',
			textColor: isDark
				? 'text-gray-400'
				: 'text-gray-700',
		};
	};

	const currentModelInfo = getModelInfo(
		getCurrentModelName()
	);

	return (
		<div className='relative'>
			{/* Model Selector Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border-2 transition-all duration-200',
					'min-w-[140px] sm:min-w-[180px] shadow-md hover:shadow-lg active:scale-95',
					'focus:outline-none focus:ring-2 focus:ring-offset-2',
					isDark
						? 'bg-chat-secondary border-chat-accent/30 text-white hover:border-chat-accent focus:ring-chat-accent'
						: 'bg-white border-gray-300 text-gray-800 hover:border-gray-400 focus:ring-blue-500',
					isOpen &&
						(isDark
							? 'border-chat-accent bg-chat-secondary/80 shadow-lg'
							: 'border-blue-500 bg-blue-50 shadow-lg')
				)}
				aria-label='Select AI Model'
				aria-expanded={isOpen}
			>
				{/* Model Icon */}
				<div
					className={cn(
						'p-1 sm:p-1.5 rounded-lg bg-gradient-to-r flex-shrink-0 shadow-sm',
						currentModelInfo.color
					)}
				>
					<MdSmartToy className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
				</div>

				{/* Model Info */}
				<div className='flex-1 text-left min-w-0'>
					<div
						className={cn(
							'text-xs sm:text-sm font-semibold truncate leading-tight',
							isDark
								? 'text-white'
								: 'text-gray-800'
						)}
					>
						{getCurrentModelName()}
					</div>
					<div
						className={cn(
							'text-xs opacity-75 truncate',
							isDark
								? 'text-chat-accent'
								: 'text-gray-600'
						)}
					>
						{currentModelInfo.provider}
					</div>
				</div>

				{/* Dropdown Arrow */}
				<MdExpandMore
					className={cn(
						'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 flex-shrink-0',
						isDark
							? 'text-chat-accent'
							: 'text-gray-500',
						isOpen && 'rotate-180'
					)}
				/>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className='fixed inset-0 z-[9999]'
						onClick={() => setIsOpen(false)}
					/>

					{/* Dropdown Content */}
					<div
						className={cn(
							'absolute top-full left-0 right-0 mt-2 z-[10000] rounded-xl border-2 shadow-2xl overflow-hidden',
							'max-h-80 overflow-y-auto scrollbar-thin',
							isDark
								? 'bg-chat-secondary border-chat-accent/30'
								: 'bg-white border-gray-300'
						)}
					>
						{Object.entries(
							OPENROUTER_MODELS
						).map(([key, value]) => {
							const modelInfo =
								getModelInfo(key);
							const isSelected =
								value === modelConfig.model;

							return (
								<button
									key={value}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleModelChange(
											value
										);
									}}
									className={cn(
										'w-full flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 text-left transition-all duration-150',
										'hover:scale-[1.01] focus:outline-none active:scale-95',
										isSelected
											? isDark
												? 'bg-gradient-to-r from-chat-pink/20 to-chat-purple/20 border-l-4 border-chat-pink'
												: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500'
											: isDark
											? 'hover:bg-chat-primary/50'
											: 'hover:bg-gray-50'
									)}
								>
									{/* Model Icon */}
									<div
										className={cn(
											'p-1.5 sm:p-2 rounded-lg bg-gradient-to-r flex-shrink-0 shadow-sm',
											modelInfo.color
										)}
									>
										<MdSmartToy className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
									</div>

									{/* Model Details */}
									<div className='flex-1 min-w-0'>
										<div
											className={cn(
												'font-semibold text-xs sm:text-sm leading-tight',
												isDark
													? 'text-white'
													: 'text-gray-800'
											)}
										>
											{key.replace(
												/_/g,
												' '
											)}
										</div>
										<div
											className={cn(
												'text-xs opacity-75 truncate',
												isDark
													? 'text-chat-accent'
													: 'text-gray-600'
											)}
										>
											{
												modelInfo.provider
											}{' '}
											•{' '}
											{
												value.split(
													'/'
												)[1]
											}
										</div>
									</div>

									{/* Selected Indicator */}
									{isSelected && (
										<div
											className={cn(
												'p-1 rounded-full flex-shrink-0 shadow-sm',
												isDark
													? 'bg-chat-pink text-white'
													: 'bg-blue-500 text-white'
											)}
										>
											<MdCheck className='w-3 h-3 sm:w-4 sm:h-4' />
										</div>
									)}
								</button>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default ModelSelector;
