import React from 'react';
import { Bot } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
import { MdMenu, MdMessage } from 'react-icons/md';
import {
	useUIStore,
	useChats,
	useActiveChat,
} from '../../../stores';
import ModelSelector from '../modals/ModelSelector';

interface ChatHeaderProps {
	onGoBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	onGoBack,
}) => {
	const { isDark } = useTheme();
	const { toggleChatList } = useUIStore();
	const chats = useChats();
	const activeChat = useActiveChat();

	const messageCount =
		chats.find((c) => c.id === activeChat)?.messages
			.length || 0;

	return (
		<header
			className={cn(
				'flex items-center px-3 sm:px-4 py-6 shadow-lg relative',
				isDark
					? 'bg-chat-primary border-b-2 border-chat-accent/30'
					: 'bg-white/90 backdrop-blur-sm border-b-2 border-chat-pink/30'
			)}
		>
			{/* Left Section */}
			<div className='flex items-center gap-2 sm:gap-3 min-w-0 w-1/4'>
				<button
					onClick={toggleChatList}
					className={cn(
						'text-xl sm:text-2xl transition-colors md:hidden p-1',
						isDark
							? 'text-white hover:text-chat-orange'
							: 'text-chat-light-text hover:text-chat-orange'
					)}
				>
					<MdMenu />
				</button>
				<button
					onClick={onGoBack}
					className='flex items-center gap-2 hover:scale-105 transition-transform duration-300 min-w-0'
				>
					<div className='p-1.5 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple flex-shrink-0'>
						<Bot className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white' />
					</div>
					<h1
						className={cn(
							'font-exo text-lg sm:text-xl md:text-3xl font-bold truncate',
							isDark
								? 'text-white'
								: 'text-chat-light-text'
						)}
					>
						AI Chat
					</h1>
				</button>
			</div>

			{/* Center Section - Message Counter and Model Selector */}
			<div className='flex-1 flex items-center justify-center gap-2 sm:gap-3'>
				{activeChat && (
					<>
						{/* Message Counter - Hidden on small screens */}
						<div
							className={cn(
								'hidden md:flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border-2 shadow-md',
								'transition-all duration-200 hover:shadow-lg',
								'min-w-[100px] sm:min-w-[120px]',
								isDark
									? 'bg-chat-secondary border-chat-accent/30'
									: 'bg-white border-gray-300'
							)}
						>
							<div
								className={cn(
									'p-1 sm:p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex-shrink-0 shadow-sm'
								)}
							>
								<MdMessage className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
							</div>
							<div className='text-left min-w-0 flex-1'>
								<div
									className={cn(
										'text-xs sm:text-sm font-bold leading-tight',
										isDark
											? 'text-white'
											: 'text-gray-800'
									)}
								>
									{messageCount}
								</div>
								<div
									className={cn(
										'text-xs opacity-75 truncate',
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									)}
								>
									{messageCount === 1
										? 'message'
										: 'messages'}
								</div>
							</div>
						</div>

						{/* Model Selector */}
						<ModelSelector />
					</>
				)}
			</div>

			{/* Right Section - Reserved for future actions */}
			<div className='flex items-center gap-3 min-w-0 flex-1 justify-end'>
				{/* Space reserved for future header actions */}
			</div>
		</header>
	);
};

export default ChatHeader;
