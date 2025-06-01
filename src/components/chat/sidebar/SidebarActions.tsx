import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
import {
	MdSearch,
	MdBarChart,
	MdPerson,
	MdCollections,
	MdShare,
	MdAdd,
	MdStar,
	MdExpandMore,
	MdFolder,
	MdBuild,
} from 'react-icons/md';

interface SidebarActionsProps {
	activeChat: string | null;
	onAdvancedSearchOpen: () => void;
	onNavigateToAnalytics: () => void;
	onTogglePersonaSelector: () => void;
	onToggleConversationTemplates: () => void;
	onToggleFavoritesViewer: () => void;
	onShareChat: () => void;
	onCreateNewChat: () => void;
}

const SidebarActions: React.FC<SidebarActionsProps> = ({
	activeChat,
	onAdvancedSearchOpen,
	onNavigateToAnalytics,
	onTogglePersonaSelector,
	onToggleConversationTemplates,
	onToggleFavoritesViewer,
	onShareChat,
	onCreateNewChat,
}) => {
	const { isDark } = useTheme();
	const [expandedSections, setExpandedSections] =
		useState<{
			content: boolean;
			tools: boolean;
		}>({
			content: false,
			tools: false,
		});

	const toggleSection = (
		section: 'content' | 'tools'
	) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const buttonBaseClass = cn(
		'flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200',
		'hover:scale-[1.02] active:scale-[0.98]'
	);

	const primaryButtonClass = cn(
		buttonBaseClass,
		isDark
			? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white hover:opacity-90 shadow-lg'
			: 'bg-gradient-to-r from-chat-pink to-chat-purple text-white hover:opacity-90 shadow-lg'
	);

	const secondaryButtonClass = cn(
		buttonBaseClass,
		isDark
			? 'bg-chat-secondary/60 text-chat-accent hover:bg-chat-secondary border border-chat-accent/20'
			: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
	);

	const sectionButtonClass = cn(
		'w-full flex items-center gap-2 text-sm font-medium py-3 px-3 rounded-lg transition-all duration-200',
		'hover:scale-[1.01] active:scale-[0.99]',
		isDark
			? 'bg-chat-secondary/50 text-chat-accent hover:bg-chat-secondary/70 border border-chat-accent/20'
			: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
	);

	const collapsibleButtonClass = cn(
		'flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200',
		'hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md',
		isDark
			? 'bg-chat-secondary/40 text-chat-accent hover:bg-chat-secondary/60 border border-chat-accent/20'
			: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
	);

	return (
		<div className='mb-4 px-2 space-y-3'>
			{/* Primary Actions - Always Visible */}
			<div className='space-y-2'>
				<button
					onClick={onCreateNewChat}
					className={cn(
						primaryButtonClass,
						'w-full'
					)}
				>
					<MdAdd className='text-lg' />
					<span>New Chat</span>
				</button>

				<div className='flex gap-2'>
					<button
						onClick={onAdvancedSearchOpen}
						className={cn(
							secondaryButtonClass,
							'flex-1'
						)}
					>
						<MdSearch className='text-base' />
						<span className='hidden sm:inline'>
							Search
						</span>
					</button>

					{activeChat && (
						<button
							onClick={onShareChat}
							className={cn(
								buttonBaseClass,
								'flex-1',
								isDark
									? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30'
									: 'bg-purple-100 text-purple-600 hover:bg-purple-200 border border-purple-200'
							)}
						>
							<MdShare className='text-base' />
							<span className='hidden sm:inline'>
								Share
							</span>
						</button>
					)}
				</div>
			</div>

			{/* Library Section - Collapsible */}
			<div className='space-y-1'>
				<button
					onClick={() => toggleSection('content')}
					className={sectionButtonClass}
				>
					<MdFolder className='text-sm' />
					<span>Library</span>
					<div className='ml-auto'>
						<MdExpandMore
							className={cn(
								'text-base transition-transform duration-200',
								expandedSections.content
									? 'rotate-180'
									: 'rotate-0'
							)}
						/>
					</div>
				</button>

				<div
					className={cn(
						'overflow-hidden transition-all duration-300 ease-in-out',
						expandedSections.content
							? 'max-h-40 opacity-100'
							: 'max-h-0 opacity-0'
					)}
				>
					<div className='grid grid-cols-2 gap-1.5 pl-2 pt-2'>
						<button
							onClick={
								onToggleConversationTemplates
							}
							className={cn(
								collapsibleButtonClass,
								isDark
									? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30'
									: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
							)}
						>
							<MdCollections className='text-lg' />
							<span>Templates</span>
						</button>
						<button
							onClick={
								onToggleFavoritesViewer
							}
							className={cn(
								collapsibleButtonClass,
								isDark
									? 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 border-yellow-500/30'
									: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200'
							)}
						>
							<MdStar className='text-lg' />
							<span>Favorites</span>
						</button>
					</div>
				</div>
			</div>

			{/* Workspace Section - Collapsible */}
			<div className='space-y-1'>
				<button
					onClick={() => toggleSection('tools')}
					className={sectionButtonClass}
				>
					<MdBuild className='text-sm' />
					<span>Workspace</span>
					<div className='ml-auto'>
						<MdExpandMore
							className={cn(
								'text-base transition-transform duration-200',
								expandedSections.tools
									? 'rotate-180'
									: 'rotate-0'
							)}
						/>
					</div>
				</button>

				<div
					className={cn(
						'overflow-hidden transition-all duration-300 ease-in-out',
						expandedSections.tools
							? 'max-h-40 opacity-100'
							: 'max-h-0 opacity-0'
					)}
				>
					<div className='grid grid-cols-1 gap-1.5 pl-2 pt-2'>
						<button
							onClick={onNavigateToAnalytics}
							className={cn(
								collapsibleButtonClass,
								isDark
									? 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 border-indigo-500/30'
									: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'
							)}
						>
							<MdBarChart className='text-lg' />
							<span>Analytics</span>
						</button>
						<button
							onClick={
								onTogglePersonaSelector
							}
							className={cn(
								collapsibleButtonClass,
								isDark
									? 'bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 border-purple-500/30'
									: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200'
							)}
						>
							<MdPerson className='text-lg' />
							<span>Persona</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SidebarActions;
