import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useUIStore } from '../../../stores';
import ChatHeader from './ChatHeader';
import ChatSidebar from '../sidebar/ChatSidebar';

interface ChatLayoutProps {
	children: React.ReactNode;
	onGoBack: () => void;
	getCategoryColor: (category?: string) => string;
	isGuestMode?: boolean;
	guestUsageStats?: {
		used: number;
		remaining: number;
		total: number;
		percentage: number;
		resetsAt: string;
	};
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
	children,
	onGoBack,
	getCategoryColor,
	isGuestMode = false,
	guestUsageStats,
}) => {
	const { isDark } = useTheme();
	const { showChatList, closeChatList } = useUIStore();

	return (
		<div
			className={`flex h-screen w-full ${
				isDark
					? 'bg-chat-primary'
					: 'bg-gradient-to-br from-slate-50 to-blue-50'
			}`}
		>
			{/* Chat Sidebar */}
			<ChatSidebar
				getCategoryColor={getCategoryColor}
			/>

			{/* Main Chat Area */}
			<div className='flex flex-1 flex-col'>
				{/* Chat Header */}
				<ChatHeader
					onGoBack={onGoBack}
					isGuestMode={isGuestMode}
					guestUsageStats={guestUsageStats}
				/>

				{/* Chat Content */}
				{children}
			</div>

			{/* Chat List Overlay */}
			{showChatList && (
				<div
					className='fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden'
					onClick={closeChatList}
				/>
			)}
		</div>
	);
};

export default ChatLayout;
