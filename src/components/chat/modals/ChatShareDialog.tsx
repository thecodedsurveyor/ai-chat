import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { showToast } from '../../../utils/toast';
import type { Chat } from '../../../types';
import { cn } from '../../../utils/classNames';
// React Icons imports
import {
	MdClose,
	MdLink,
	MdContentCopy,
	MdDownload,
} from 'react-icons/md';

interface ChatShareDialogProps {
	chat: Chat;
	isVisible: boolean;
	onClose: () => void;
}

interface ShareOptions {
	includeUserMessages: boolean;
	includeTimestamps: boolean;
	includePersona: boolean;
	format: 'conversation' | 'clean' | 'markdown';
}

const ChatShareDialog: React.FC<ChatShareDialogProps> = ({
	chat,
	isVisible,
	onClose,
}) => {
	const { isDark } = useTheme();
	const [shareOptions, setShareOptions] =
		useState<ShareOptions>({
			includeUserMessages: true,
			includeTimestamps: false,
			includePersona: true,
			format: 'conversation',
		});
	const [isGenerating, setIsGenerating] = useState(false);

	const formatChatForSharing = (
		options: ShareOptions
	): string => {
		const {
			includeUserMessages,
			includeTimestamps,
			includePersona,
			format,
		} = options;

		let content = '';

		// Add header
		if (format === 'markdown') {
			content += `# ${chat.displayId}\n\n`;
			if (includePersona && chat.persona) {
				content += `**AI Persona:** ${chat.persona.name} - ${chat.persona.description}\n\n`;
			}
			if (includeTimestamps) {
				content += `**Created:** ${new Date(
					chat.createdAt
				).toLocaleString()}\n\n`;
			}
			content += '---\n\n';
		} else {
			content += `${chat.displayId}\n`;
			if (includePersona && chat.persona) {
				content += `AI Persona: ${chat.persona.name} - ${chat.persona.description}\n`;
			}
			if (includeTimestamps) {
				content += `Created: ${new Date(
					chat.createdAt
				).toLocaleString()}\n`;
			}
			content += '\n';
		}

		// Add messages
		chat.messages.forEach((message) => {
			const isUser = message.type === 'prompt';

			if (!includeUserMessages && isUser) return;

			if (format === 'markdown') {
				const speaker = isUser
					? '**You**'
					: `**${chat.persona?.name || 'AI'}**`;
				content += `${speaker}: ${message.text}\n\n`;
			} else if (format === 'clean') {
				if (!isUser) {
					content += `${message.text}\n\n`;
				}
			} else {
				const speaker = isUser
					? 'You'
					: chat.persona?.name || 'AI';
				const timestamp = includeTimestamps
					? ` (${new Date(
							message.timestamp
					  ).toLocaleTimeString()})`
					: '';
				content += `${speaker}${timestamp}: ${message.text}\n\n`;
			}
		});

		return content.trim();
	};

	const handleCopyToClipboard = async () => {
		setIsGenerating(true);
		try {
			const formattedChat =
				formatChatForSharing(shareOptions);
			await navigator.clipboard.writeText(
				formattedChat
			);
			showToast(
				'Success',
				'Chat copied to clipboard!',
				'success'
			);
		} catch (error) {
			console.error(
				'Failed to copy to clipboard:',
				error
			);
			showToast(
				'Error',
				'Failed to copy to clipboard',
				'error'
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleCopyChatUrl = async () => {
		setIsGenerating(true);
		try {
			// Simple chat URL - just link to the chat
			const chatUrl = `${window.location.origin}${window.location.pathname}#chat-${chat.id}`;

			await navigator.clipboard.writeText(chatUrl);
			showToast(
				'Success',
				'Chat URL copied to clipboard!',
				'success'
			);
		} catch (error) {
			console.error(
				'Failed to copy chat URL:',
				error
			);
			showToast(
				'Error',
				'Failed to copy chat URL',
				'error'
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleDownload = () => {
		setIsGenerating(true);
		try {
			const formattedChat =
				formatChatForSharing(shareOptions);
			const blob = new Blob([formattedChat], {
				type: 'text/plain',
			});
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = `${chat.displayId.replace(
				/[^a-z0-9]/gi,
				'_'
			)}.txt`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			showToast(
				'Success',
				'Chat downloaded successfully!',
				'success'
			);
		} catch (error) {
			console.error(
				'Failed to download chat:',
				error
			);
			showToast(
				'Error',
				'Failed to download chat',
				'error'
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const updateShareOption = <
		K extends keyof ShareOptions
	>(
		key: K,
		value: ShareOptions[K]
	) => {
		setShareOptions((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
			<div
				className={cn(
					'w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden',
					isDark
						? 'bg-chat-primary border-chat-accent/30'
						: 'bg-white border-gray-200'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'p-6 border-b',
						isDark
							? 'border-chat-accent/30'
							: 'border-gray-200'
					)}
				>
					<div className='flex items-center justify-between'>
						<h2
							className={cn(
								'text-xl font-bold',
								isDark
									? 'text-white'
									: 'text-gray-900'
							)}
						>
							Share Chat
						</h2>
						<button
							onClick={onClose}
							className={cn(
								'p-2 rounded-lg transition-colors',
								isDark
									? 'text-gray-400 hover:text-white hover:bg-white/10'
									: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
							)}
						>
							<MdClose className='text-xl' />
						</button>
					</div>
					<p
						className={cn(
							'text-sm mt-2',
							isDark
								? 'text-gray-400'
								: 'text-gray-600'
						)}
					>
						{chat.displayId} •{' '}
						{chat.messages.length} messages
					</p>
				</div>

				{/* Options */}
				<div className='p-6 space-y-4'>
					{/* Include Options */}
					<div className='space-y-3'>
						<h3
							className={cn(
								'font-semibold',
								isDark
									? 'text-white'
									: 'text-gray-900'
							)}
						>
							Include in Share
						</h3>

						<label className='flex items-center gap-3'>
							<input
								type='checkbox'
								checked={
									shareOptions.includeUserMessages
								}
								onChange={(e) =>
									updateShareOption(
										'includeUserMessages',
										e.target.checked
									)
								}
								className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
							/>
							<span
								className={cn(
									'text-sm',
									isDark
										? 'text-gray-300'
										: 'text-gray-700'
								)}
							>
								Your messages
							</span>
						</label>

						<label className='flex items-center gap-3'>
							<input
								type='checkbox'
								checked={
									shareOptions.includeTimestamps
								}
								onChange={(e) =>
									updateShareOption(
										'includeTimestamps',
										e.target.checked
									)
								}
								className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
							/>
							<span
								className={cn(
									'text-sm',
									isDark
										? 'text-gray-300'
										: 'text-gray-700'
								)}
							>
								Timestamps
							</span>
						</label>

						<label className='flex items-center gap-3'>
							<input
								type='checkbox'
								checked={
									shareOptions.includePersona
								}
								onChange={(e) =>
									updateShareOption(
										'includePersona',
										e.target.checked
									)
								}
								className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
							/>
							<span
								className={cn(
									'text-sm',
									isDark
										? 'text-gray-300'
										: 'text-gray-700'
								)}
							>
								AI Persona info
							</span>
						</label>
					</div>

					{/* Format */}
					<div className='space-y-3'>
						<h3
							className={cn(
								'font-semibold',
								isDark
									? 'text-white'
									: 'text-gray-900'
							)}
						>
							Format
						</h3>

						<div className='grid grid-cols-3 gap-2'>
							{[
								{
									value: 'conversation',
									label: 'Conversation',
									desc: 'Speaker labels',
								},
								{
									value: 'clean',
									label: 'Clean',
									desc: 'AI responses only',
								},
								{
									value: 'markdown',
									label: 'Markdown',
									desc: 'Formatted text',
								},
							].map((format) => (
								<label
									key={format.value}
									className='cursor-pointer'
								>
									<input
										type='radio'
										name='format'
										value={format.value}
										checked={
											shareOptions.format ===
											format.value
										}
										onChange={(e) =>
											updateShareOption(
												'format',
												e.target
													.value as ShareOptions['format']
											)
										}
										className='sr-only'
									/>
									<div
										className={cn(
											'p-3 rounded-lg border-2 text-center transition-colors',
											shareOptions.format ===
												format.value
												? isDark
													? 'border-chat-accent bg-chat-accent/10'
													: 'border-blue-500 bg-blue-50'
												: isDark
												? 'border-chat-accent/30 hover:border-chat-accent/50'
												: 'border-gray-200 hover:border-gray-300'
										)}
									>
										<div
											className={cn(
												'font-medium text-sm',
												isDark
													? 'text-white'
													: 'text-gray-900'
											)}
										>
											{format.label}
										</div>
										<div
											className={cn(
												'text-xs mt-1',
												isDark
													? 'text-gray-400'
													: 'text-gray-500'
											)}
										>
											{format.desc}
										</div>
									</div>
								</label>
							))}
						</div>
					</div>

					{/* Actions */}
					<div className='space-y-3 pt-4'>
						{/* Simple Chat URL */}
						<div className='flex gap-2'>
							<button
								onClick={handleCopyChatUrl}
								disabled={isGenerating}
								className={cn(
									'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors',
									isDark
										? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
										: 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
								)}
							>
								<MdLink />
								Copy Chat URL
							</button>
						</div>

						{/* Content Options */}
						<div className='flex gap-2'>
							<button
								onClick={
									handleCopyToClipboard
								}
								disabled={isGenerating}
								className={cn(
									'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors',
									isDark
										? 'bg-chat-secondary text-white hover:bg-white/10 disabled:opacity-50'
										: 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50'
								)}
							>
								<MdContentCopy />
								Copy Text
							</button>

							<button
								onClick={handleDownload}
								disabled={isGenerating}
								className={cn(
									'flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors',
									isDark
										? 'bg-chat-secondary text-white hover:bg-white/10 disabled:opacity-50'
										: 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50'
								)}
							>
								<MdDownload />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatShareDialog;
