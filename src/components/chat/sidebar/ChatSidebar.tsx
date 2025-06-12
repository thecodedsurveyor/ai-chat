import React from 'react';
import { Bot } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
import { MdEdit, MdClose } from 'react-icons/md';
import {
	useUIStore,
	useChatStore,
	useChats,
	useActiveChat,
} from '../../../stores';
import type { Chat } from '../../../types';
import ChatList from './ChatList';
import SidebarActions from './SidebarActions';
import ChatManager from '../modals/ChatManager';

interface ChatSidebarProps {
	getCategoryColor: (category?: string) => string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
	getCategoryColor,
}) => {
	const { isDark } = useTheme();
	const {
		showChatList,
		closeChatList,
		toggleAdvancedSearch,
		toggleFavoritesViewer,
		toggleChatShareDialog,
	} = useUIStore();

	// Local state for chat management
	const [managingChatId, setManagingChatId] =
		React.useState<string | null>(null);
	const {
		createNewChat,
		setActiveChat,
		deleteChat,
		updateChat,
	} = useChatStore();
	const chats = useChats();
	const activeChat = useActiveChat();

	// Event handlers
	const handleCreateNewChat = () => createNewChat();
	const handleChatSelect = (chatId: string) =>
		setActiveChat(chatId);
	const handleChatDelete = (
		e: React.MouseEvent,
		chatId: string
	) => {
		e.stopPropagation();
		deleteChat(chatId);
	};

	const handleChatManage = (
		e: React.MouseEvent,
		chatId: string
	) => {
		e.stopPropagation();
		// Set the chat to manage
		setManagingChatId(chatId);
	};

	const handleCloseChatManager = () => {
		setManagingChatId(null);
	};

	const handleChatUpdate = (
		chatId: string,
		updates: Partial<Chat>
	) => {
		// Update the chat using the store action
		updateChat(chatId, updates);
		setManagingChatId(null);
	};
	const handleShareChat = () => {
		if (activeChat) {
			toggleChatShareDialog();
		}
	};

	return (
		<div
			className={cn(
				'fixed top-0 left-0 z-50 h-full transform p-4 transition-transform duration-300 ease-in-out md:static md:w-1/3 md:transform-none',
				'w-[85vw] max-w-sm',
				showChatList
					? 'translate-x-0'
					: '-translate-x-full',
				isDark
					? 'bg-chat-primary border-r-2 border-chat-accent/30'
					: 'bg-white/90 backdrop-blur-sm border-r-2 border-chat-pink/30'
			)}
		>
			{/* Chat List Header */}
			<div className='mb-4 flex items-center justify-between p-2'>
				{/* Logo and Title */}
				<div className='flex items-center gap-2 min-w-0 flex-1'>
					<div className='p-1.5 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple flex-shrink-0'>
						<Bot className='w-4 h-4 text-white' />
					</div>
					<h2
						className={`font-exo text-lg font-bold truncate ${
							isDark
								? 'text-chat-accent'
								: 'text-chat-light-accent'
						}`}
					>
						NeuronFlow
					</h2>
				</div>

				{/* Mobile Close Button */}
				<div className='flex items-center gap-2 md:hidden'>
					<button
						onClick={handleCreateNewChat}
						className={cn(
							'text-xl transition-colors p-1',
							isDark
								? 'text-chat-orange hover:text-chat-pink'
								: 'text-chat-light-icon hover:text-chat-light-icon-hover'
						)}
						title='New Chat'
					>
						<MdEdit />
					</button>
					<button
						onClick={closeChatList}
						className={`text-xl transition-colors ${
							isDark
								? 'text-chat-accent hover:text-white'
								: 'text-chat-light-accent hover:text-chat-light-text'
						}`}
					>
						<MdClose />
					</button>
				</div>
			</div>

			{/* Mobile Quick Actions */}
			<SidebarActions
				activeChat={activeChat}
				onAdvancedSearchOpen={toggleAdvancedSearch}
				onToggleFavoritesViewer={
					toggleFavoritesViewer
				}
				onShareChat={handleShareChat}
				onCreateNewChat={handleCreateNewChat}
			/>

			{/* Chat List */}
			<ChatList
				chats={chats}
				activeChat={activeChat}
				onChatSelect={handleChatSelect}
				onChatDelete={handleChatDelete}
				onChatManage={handleChatManage}
				getCategoryColor={getCategoryColor}
			/>

			{/* Chat Manager Modal */}
			{managingChatId && (
				<ChatManager
					chat={
						chats.find(
							(c) => c.id === managingChatId
						)!
					}
					onUpdate={handleChatUpdate}
					onClose={handleCloseChatManager}
					isVisible={true}
				/>
			)}
		</div>
	);
};

export default ChatSidebar;
