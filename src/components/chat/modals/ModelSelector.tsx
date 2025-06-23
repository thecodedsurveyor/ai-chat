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
	MdLock,
} from 'react-icons/md';

interface ModelSelectorProps {
	isGuestMode?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
	isGuestMode = false,
}) => {
	const { isDark } = useTheme();
	const [isOpen, setIsOpen] = useState(false);

	const modelConfig = useChatStore(
		(state) => state.modelConfig
	);
	const setModelConfig = useChatStore(
		(state) => state.setModelConfig
	);

	const handleModelChange = (model: string) => {
		// Prevent model change for guest users
		if (isGuestMode) {
			return;
		}
		setModelConfig({ model: model as OpenRouterModel });
		setIsOpen(false);
	};

	// Get available models based on user type
	const getAvailableModels = () => {
		if (isGuestMode) {
			// Only allow the default free model for guests
			return {
				DEEPSEEK_R1T_CHIMERA_FREE:
					OPENROUTER_MODELS.DEEPSEEK_R1T_CHIMERA_FREE,
			};
		}
		return OPENROUTER_MODELS;
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

	// Get mobile-friendly model name (removes 'FREE' text)
	const getMobileModelName = () => {
		const fullName = getCurrentModelName();
		return fullName.replace(/\sFREE$/i, '').trim();
	};

	// Get model provider info
	const getModelInfo = (modelKey: string) => {
		if (modelKey.includes('DEEPSEEK')) {
			return {
				color: 'from-emerald-500 to-teal-600',
				provider: 'DeepSeek',
				bgColor: isDark
					? 'bg-emerald-500/20'
					: 'bg-emerald-50',
				textColor: isDark
					? 'text-emerald-400'
					: 'text-emerald-700',
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
				onClick={() =>
					!isGuestMode && setIsOpen(!isOpen)
				}
				disabled={isGuestMode}
				title={
					isGuestMode
						? 'Sign up to unlock all AI models'
						: 'Select AI Model'
				}
				className={cn(
					'flex items-center gap-1 sm:gap-2 md:gap-3 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 rounded-lg sm:rounded-xl border-2 transition-all duration-200',
					isGuestMode
						? 'min-w-[55px] sm:min-w-[60px] lg:min-w-[180px] shadow-md' // Guest: extra small on mobile, small on tablet, normal on large screens
						: 'min-w-[120px] sm:min-w-[140px] md:min-w-[180px] shadow-md', // Auth: compact on mobile, normal on desktop
					'focus:outline-none focus:ring-2 focus:ring-offset-2',
					isGuestMode
						? cn(
								'cursor-not-allowed relative overflow-hidden',
								isDark
									? 'bg-gradient-to-br from-slate-800/60 to-slate-700/60 border-slate-600/50 text-slate-400'
									: 'bg-gradient-to-br from-slate-100/80 to-slate-200/60 border-slate-300/70 text-slate-500',
								// Subtle shimmer effect
								'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:animate-[shimmer_3s_ease-in-out_infinite]'
						  )
						: cn(
								'hover:shadow-lg active:scale-95',
								isDark
									? 'bg-chat-secondary border-chat-accent/30 text-white hover:border-chat-accent focus:ring-chat-accent'
									: 'bg-white border-gray-300 text-gray-800 hover:border-gray-400 focus:ring-blue-500',
								isOpen &&
									(isDark
										? 'border-chat-accent bg-chat-secondary/80 shadow-lg'
										: 'border-blue-500 bg-blue-50 shadow-lg')
						  )
				)}
				aria-label='Select AI Model'
				aria-expanded={isOpen}
			>
				{/* Model Icon */}
				<div
					className={cn(
						'p-0.5 sm:p-1 md:p-1.5 rounded sm:rounded-lg bg-gradient-to-r flex-shrink-0 shadow-sm',
						isGuestMode
							? isDark
								? 'bg-gradient-to-br from-slate-600 to-slate-500'
								: 'bg-gradient-to-br from-slate-400 to-slate-300'
							: currentModelInfo.color
					)}
				>
					<MdSmartToy className='w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white' />
				</div>

				{/* Model Info - Now visible on mobile */}
				<div
					className={cn(
						'flex-1 text-left min-w-0',
						isGuestMode
							? 'block' // Always visible for guest users
							: 'block' // Always visible for authenticated users
					)}
				>
					<div
						className={cn(
							'text-xs sm:text-sm font-semibold truncate leading-tight',
							isGuestMode
								? isDark
									? 'text-slate-400'
									: 'text-slate-500'
								: isDark
								? 'text-white'
								: 'text-gray-800'
						)}
					>
						{/* Show mobile-friendly name on small screens, full name on larger screens */}
						<span className='sm:hidden'>
							{getMobileModelName()}
						</span>
						<span className='hidden sm:inline'>
							{getCurrentModelName()}
						</span>
					</div>
					<div
						className={cn(
							'text-xs truncate hidden sm:block', // Keep provider text hidden on mobile for space
							isGuestMode
								? isDark
									? 'text-slate-500 opacity-90'
									: 'text-slate-400 opacity-90'
								: cn(
										'opacity-75',
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
								  )
						)}
					>
						{isGuestMode
							? 'Guest Mode Only'
							: currentModelInfo.provider}
					</div>
				</div>

				{/* Dropdown Arrow or Lock Icon */}
				{isGuestMode ? (
					<div className='flex items-center space-x-1 sm:space-x-2'>
						{/* Hide "Locked" text on mobile and tablet */}
						<span
							className={cn(
								'text-xs font-medium hidden lg:inline',
								isDark
									? 'text-slate-400'
									: 'text-slate-500'
							)}
						>
							Locked
						</span>
						<div
							className={cn(
								'p-0.5 sm:p-1 md:p-1.5 rounded sm:rounded-lg shadow-sm',
								isDark
									? 'bg-gradient-to-br from-amber-600/80 to-orange-600/80'
									: 'bg-gradient-to-br from-amber-500/90 to-orange-500/90'
							)}
						>
							<MdLock className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-white' />
						</div>
					</div>
				) : (
					<MdExpandMore
						className={cn(
							'w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-200 flex-shrink-0',
							isDark
								? 'text-chat-accent'
								: 'text-gray-500',
							isOpen && 'rotate-180'
						)}
					/>
				)}
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
							getAvailableModels()
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
