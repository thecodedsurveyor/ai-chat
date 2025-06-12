import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
import {
	MdSearch,
	MdShare,
	MdAdd,
	MdStar,
} from 'react-icons/md';

interface SidebarActionsProps {
	activeChat: string | null;
	onAdvancedSearchOpen: () => void;
	onToggleFavoritesViewer: () => void;
	onShareChat: () => void;
	onCreateNewChat: () => void;
}

const SidebarActions: React.FC<SidebarActionsProps> = ({
	activeChat,
	onAdvancedSearchOpen,
	onToggleFavoritesViewer,
	onShareChat,
	onCreateNewChat,
}) => {
	const { isDark } = useTheme();

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

			{/* Favorites Standalone Button */}
			<button
				onClick={onToggleFavoritesViewer}
				className={cn(
					buttonBaseClass,
					'w-full',
					isDark
						? 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 border border-yellow-500/30'
						: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
				)}
			>
				<MdStar className='text-lg' />
				<span>Favorites</span>
			</button>
		</div>
	);
};

export default SidebarActions;
