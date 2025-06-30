import React, { useMemo, useCallback } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/classNames';
import { MdStar, MdMemory } from 'react-icons/md';

import MarkdownMessage from './MarkdownMessage';
import MessageActions from './MessageActions';
import MessageStatus from './MessageStatus';
import EnhancedTypingIndicator from './EnhancedTypingIndicator';
import Tooltip from '../../ui/Tooltip';

// Zustand store imports
import {
	useMessages,
	useIsTyping,
	useChatStore,
} from '../../../stores/chatStore';

interface ChatMessagesProps {
	containerRef: React.RefObject<HTMLDivElement>;
	scrollRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
	containerRef,
	scrollRef,
}) => {
	const { isDark } = useTheme();

	// Get data from stores
	const messages = useMessages();
	const isTyping = useIsTyping();
	const { handleMessageAction } = useChatStore();

	// Local handlers

	const handleMessageActionWrapper = useCallback(
		(action: string, messageId: string) => {
			handleMessageAction(action, messageId);
		},
		[handleMessageAction]
	);

	// Memoized empty state
	const emptyState = useMemo(
		() => (
			<div className='flex h-full items-center justify-center'>
				<div
					className={`text-center ${
						isDark
							? 'text-chat-accent'
							: 'text-chat-light-accent'
					}`}
				>
					<div className='text-8xl mb-6'>💬</div>
					<h3
						className={`text-3xl font-exo font-semibold ${
							isDark
								? 'text-white'
								: 'text-chat-light-text'
						}`}
					>
						Start a conversation
					</h3>
					<p className='text-lg opacity-75 mt-4'>
						Type a message below to begin
						chatting with AI
					</p>
				</div>
			</div>
		),
		[isDark]
	);

	return (
		<div
			className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 scrollbar-hide'
			ref={containerRef}
		>
			{messages.length === 0
				? emptyState
				: messages.map((message, index) => {
						const isUser =
							message.type === 'prompt';
						return (
							<div
								key={message.id || index}
								className={cn(
									'flex w-full relative group z-0',
									isUser
										? 'justify-end'
										: 'justify-start'
								)}
							>
								<div className='space-y-1'>
									{/* Message Bubble */}
									<div
										className={cn(
											'rounded-3xl bg-gradient-to-r from-chat-orange to-chat-pink text-white px-3 py-2 md:px-4 md:py-3 shadow-lg border-2 border-white/20 relative z-0',
											isUser
												? 'rounded-tr-none ml-auto'
												: 'rounded-tl-none max-w-[85%] md:max-w-[80%]'
										)}
									>
										{/* Message Content with Markdown */}
										<div className='text-base md:text-lg leading-relaxed'>
											<MarkdownMessage
												content={
													message.text
												}
												isUser={
													isUser
												}
											/>
										</div>

										{/* Message Footer */}
										<div
											className={cn(
												'mt-3 flex items-center justify-between text-sm',
												isUser
													? 'flex-row-reverse'
													: 'flex-row'
											)}
										>
											<div className='flex items-center space-x-2'>
												<span className='font-exo opacity-75'>
													{
														message.timestamp
													}
												</span>

												{message.isFavorite && (
													<MdStar className='text-yellow-300 text-sm' />
												)}
												{/* Add context-aware tooltip for AI responses */}
												{!isUser && (
													<Tooltip text='AI is context-aware.'>
														<div className='p-1 hover:bg-white/10 rounded-full transition-colors cursor-help'>
															<MdMemory className='text-white/70 text-xl' />
														</div>
													</Tooltip>
												)}
											</div>

											{/* Message Status for user messages */}
											{isUser && (
												<MessageStatus
													status={
														message.status
													}
													className='opacity-75'
												/>
											)}
										</div>
									</div>

									{/* Message Actions - Now below the message */}
									<MessageActions
										message={message}
										onAction={
											handleMessageActionWrapper
										}
										isVisible={true}
									/>
								</div>
							</div>
						);
				  })}

			{/* Enhanced Typing Indicator */}
			<EnhancedTypingIndicator isVisible={isTyping} />

			<div ref={scrollRef} />
		</div>
	);
};

export default ChatMessages;
