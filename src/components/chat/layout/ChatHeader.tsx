import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
import { MdMenu } from 'react-icons/md';
import { useUIStore, useActiveChat } from '../../../stores';
import ModelSelector from '../modals/ModelSelector';
import UserProfile from '../../ui/UserProfile';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
	onGoBack: () => void;
	isGuestMode?: boolean;
	guestUsageStats?: {
		used: number;
		remaining: number;
		total: number;
		percentage: number;
		resetsAt: string;
	};
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	onGoBack,
	isGuestMode = false,
	guestUsageStats,
}) => {
	const { isDark } = useTheme();
	const { toggleChatList } = useUIStore();
	const navigate = useNavigate();
	const activeChat = useActiveChat();

	const handleGuestSignUp = () => {
		navigate('/auth?mode=signup');
	};

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
			<div className='flex items-center gap-2 sm:gap-3 min-w-0'>
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
					{/* Logo text - hidden on mobile, visible on desktop */}
					<h1
						className={cn(
							'hidden md:block font-exo text-lg sm:text-xl md:text-3xl font-bold truncate',
							isDark
								? 'text-white'
								: 'text-chat-light-text'
						)}
					>
						NeuronFlow
					</h1>
				</button>
			</div>

			{/* Center Section - Model Selector (properly centered) */}
			<div className='flex-1 flex items-center justify-center'>
				{activeChat && (
					<>
						{/* Model Selector - Centered */}
						<ModelSelector
							isGuestMode={isGuestMode}
						/>
					</>
				)}
			</div>

			{/* Right Section - User Profile or Guest Counter */}
			<div className='flex items-center justify-end min-w-0 gap-2 sm:gap-3'>
				{isGuestMode ? (
					/* Guest Usage Indicator - Mobile optimized, far right aligned */
					<div
						className={cn(
							'flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border-2 shadow-sm',
							'transition-all duration-200 hover:shadow-md cursor-pointer',
							isDark
								? 'bg-chat-secondary border-chat-accent/30 hover:bg-chat-accent/10'
								: 'bg-white border-blue-200 hover:bg-blue-50'
						)}
						onClick={handleGuestSignUp}
						title={`${
							guestUsageStats?.remaining || 0
						} messages left today. Resets at midnight! Click to sign up for unlimited messages.`}
					>
						<div className='p-0.5 sm:p-1 rounded bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0'>
							<Sparkles className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-white' />
						</div>
						<div className='text-left min-w-0'>
							<div
								className={cn(
									'text-xs font-bold leading-tight',
									isDark
										? 'text-white'
										: 'text-gray-800'
								)}
							>
								{guestUsageStats?.remaining ||
									0}{' '}
								<span className='hidden sm:inline'>
									left
								</span>
							</div>
							<div
								className={cn(
									'text-xs opacity-75 hidden sm:block',
									isDark
										? 'text-chat-accent'
										: 'text-blue-600'
								)}
							>
								Guest mode
							</div>
						</div>
					</div>
				) : (
					<UserProfile />
				)}
			</div>
		</header>
	);
};

export default ChatHeader;
