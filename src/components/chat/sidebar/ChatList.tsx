import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
import {
	MdSettings,
	MdCancel,
	MdPushPin,
} from 'react-icons/md';
import type { Chat } from '../../../types';

interface ChatListProps {
	chats: Chat[];
	activeChat: string | null;
	onChatSelect: (chatId: string) => void;
	onChatDelete: (
		e: React.MouseEvent,
		chatId: string
	) => void;
	onChatManage: (
		e: React.MouseEvent,
		chatId: string
	) => void;
	getCategoryColor: (category?: string) => string;
}

const ChatList: React.FC<ChatListProps> = ({
	chats,
	activeChat,
	onChatSelect,
	onChatDelete,
	onChatManage,
	getCategoryColor,
}) => {
	const { isDark } = useTheme();

	return (
		<div className='flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto'>
			{chats.map((chat) => (
				<div
					key={chat.id}
					onClick={() => onChatSelect(chat.id)}
					className={cn(
						'flex cursor-pointer items-center justify-between rounded-xl shadow-md transition-all border-2 relative',
						'h-16 p-3',
						getCategoryColor(chat.category),
						chat.id === activeChat
							? 'bg-gradient-to-r from-chat-pink to-chat-purple border-r border-t border-b border-white/30'
							: isDark
							? 'bg-chat-secondary hover:bg-opacity-80 border-chat-accent/20 hover:border-chat-orange/40'
							: 'bg-chat-light-secondary hover:bg-chat-light-hover border-chat-pink/20 hover:border-chat-purple/40'
					)}
				>
					{/* Pin indicator */}
					{chat.isPinned && (
						<div className='absolute top-1 right-1'>
							<MdPushPin className='text-chat-orange text-xs' />
						</div>
					)}

					<div className='flex-1 min-w-0 mr-2'>
						<div className='mb-1'>
							<h4
								className={cn(
									'truncate font-light text-sm',
									chat.id === activeChat
										? 'text-white'
										: isDark
										? 'text-chat-text'
										: 'text-chat-light-text'
								)}
							>
								{chat.displayId}
							</h4>
						</div>

						{/* Category and tags */}
						<div className='flex items-center gap-1 text-xs'>
							{chat.category && (
								<span
									className={cn(
										'px-1.5 py-0.5 rounded-full text-xs',
										chat.id ===
											activeChat
											? 'bg-white/20 text-white'
											: 'bg-gray-200 text-gray-700'
									)}
								>
									{chat.category}
								</span>
							)}
							{chat.tags
								?.slice(0, 1)
								.map((tag) => (
									<span
										key={tag}
										className={cn(
											'text-xs',
											chat.id ===
												activeChat
												? 'text-white/80'
												: 'text-chat-pink'
										)}
									>
										#{tag}
									</span>
								))}
							{chat.tags &&
								chat.tags.length > 1 && (
									<span className='text-xs text-gray-500'>
										+
										{chat.tags.length -
											1}
									</span>
								)}
						</div>
					</div>

					<div className='flex flex-col items-end gap-1'>
						{/* Date/Time aligned with icons */}
						<span
							className={cn(
								'text-xs opacity-70 flex-shrink-0',
								chat.id === activeChat
									? 'text-white/70'
									: isDark
									? 'text-gray-400'
									: 'text-gray-500'
							)}
						>
							{new Date(
								chat.createdAt
							).toLocaleString([], {
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hour12: true,
							})}
						</span>

						{/* Action buttons */}
						<div className='flex items-center gap-1'>
							<button
								onClick={(e) =>
									onChatManage(e, chat.id)
								}
								className='text-lg text-chat-accent hover:text-chat-orange transition-colors p-1'
								title='Manage Chat'
							>
								<MdSettings />
							</button>
							<button
								onClick={(e) =>
									onChatDelete(e, chat.id)
								}
								className='text-lg text-chat-pink hover:text-red-400 transition-colors p-1'
								title='Delete Chat'
							>
								<MdCancel />
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatList;
