import React, { useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { Chat, Message } from '../../../types';
import { cn } from '../../../utils/classNames';
import MarkdownMessage from '../messages/MarkdownMessage';
// React Icons imports
import { MdStar, MdClose } from 'react-icons/md';

interface FavoritesViewerProps {
	chats: Chat[];
	isVisible: boolean;
	onClose: () => void;
	onSelectChat: (chatId: string) => void;
}

interface FavoriteMessageWithChat extends Message {
	chatId: string;
	chatTitle: string;
	chatCategory?: string;
}

const FavoritesViewer: React.FC<FavoritesViewerProps> = ({
	chats,
	isVisible,
	onClose,
	onSelectChat,
}) => {
	const { isDark } = useTheme();

	// Extract all favorite messages with chat context
	const favoriteMessages =
		useMemo((): FavoriteMessageWithChat[] => {
			const favorites: FavoriteMessageWithChat[] = [];

			chats.forEach((chat) => {
				chat.messages
					.filter((message) => message.isFavorite)
					.forEach((message) => {
						favorites.push({
							...message,
							chatId: chat.id,
							chatTitle: chat.displayId,
							chatCategory: chat.category,
						});
					});
			});

			// Sort by timestamp (newest first)
			return favorites.sort((a, b) => {
				// Convert time strings to comparable format
				const timeA = new Date(
					`2000-01-01 ${a.timestamp}`
				).getTime();
				const timeB = new Date(
					`2000-01-01 ${b.timestamp}`
				).getTime();
				return timeB - timeA;
			});
		}, [chats]);

	const handleJumpToChat = (chatId: string) => {
		onSelectChat(chatId);
		onClose();
	};

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
			<div
				className={cn(
					'w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border-2',
					isDark
						? 'bg-chat-primary border-chat-accent/30'
						: 'bg-white border-chat-pink/30'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'flex items-center justify-between p-6 border-b-2',
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-pink/30'
					)}
				>
					<div className='flex items-center gap-3'>
						<div className='p-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400'>
							<MdStar className='text-white text-xl' />
						</div>
						<div>
							<h2
								className={cn(
									'text-xl font-bold',
									isDark
										? 'text-white'
										: 'text-chat-light-text'
								)}
							>
								Favorite Messages
							</h2>
							<p
								className={cn(
									'text-sm',
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								)}
							>
								{favoriteMessages.length}{' '}
								favorite messages
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className={cn(
							'text-2xl transition-colors p-2 rounded-lg',
							isDark
								? 'text-chat-accent hover:text-white hover:bg-chat-secondary'
								: 'text-chat-light-close-button hover:text-chat-light-close-button-hover hover:bg-gray-100'
						)}
					>
						<MdClose />
					</button>
				</div>

				{/* Content */}
				<div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
					{favoriteMessages.length === 0 ? (
						<div className='text-center py-12'>
							<div className='mb-4'>
								<MdStar
									className={cn(
										'text-6xl mx-auto',
										isDark
											? 'text-chat-accent/50'
											: 'text-gray-400'
									)}
								/>
							</div>
							<h3
								className={cn(
									'text-lg font-semibold mb-2',
									isDark
										? 'text-white'
										: 'text-gray-800'
								)}
							>
								No favorite messages yet
							</h3>
							<p
								className={cn(
									'text-sm',
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								)}
							>
								Click the star icon on any
								message to add it to
								favorites
							</p>
						</div>
					) : (
						<div className='space-y-6'>
							{favoriteMessages.map(
								(message) => (
									<div
										key={`${message.chatId}-${message.id}`}
										className={cn(
											'p-4 rounded-xl border-2 transition-all hover:shadow-lg',
											isDark
												? 'bg-chat-secondary border-chat-accent/20 hover:border-chat-accent/40'
												: 'bg-gray-50 border-gray-200 hover:border-chat-pink/40'
										)}
									>
										{/* Message Header */}
										<div className='flex items-center justify-between mb-3'>
											<div className='flex items-center gap-3'>
												<button
													onClick={() =>
														handleJumpToChat(
															message.chatId
														)
													}
													className={cn(
														'text-sm font-medium transition-colors hover:underline',
														isDark
															? 'text-chat-orange hover:text-chat-pink'
															: 'text-chat-purple hover:text-chat-pink'
													)}
												>
													{
														message.chatTitle
													}
												</button>
												{message.chatCategory && (
													<span
														className={cn(
															'px-2 py-1 rounded-full text-xs font-medium',
															isDark
																? 'bg-chat-accent/20 text-chat-accent'
																: 'bg-gray-200 text-gray-700'
														)}
													>
														{
															message.chatCategory
														}
													</span>
												)}
											</div>
											<div className='flex items-center gap-2'>
												<span
													className={cn(
														'text-xs',
														isDark
															? 'text-gray-400'
															: 'text-gray-500'
													)}
												>
													{
														message.timestamp
													}
												</span>
												<div
													className={cn(
														'px-2 py-1 rounded-full text-xs font-medium',
														message.type ===
															'prompt'
															? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
															: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
													)}
												>
													{message.type ===
													'prompt'
														? 'You'
														: 'AI'}
												</div>
											</div>
										</div>

										{/* Message Content */}
										<div
											className={cn(
												'p-4 rounded-lg',
												message.type ===
													'prompt'
													? 'bg-gradient-to-r from-chat-orange/20 to-chat-pink/20'
													: isDark
													? 'bg-chat-primary/50'
													: 'bg-white'
											)}
										>
											<MarkdownMessage
												content={
													message.text
												}
												isUser={
													message.type ===
													'prompt'
												}
											/>
										</div>

										{/* Additional Message Info */}
										{message.wordCount && (
											<div className='flex items-center gap-3 mt-2 text-xs'>
												<span
													className={cn(
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													)}
												>
													{
														message.wordCount
													}{' '}
													words
												</span>
											</div>
										)}
									</div>
								)
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FavoritesViewer;
