import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import {
	showToast,
	showErrorToast,
	showSuccessToast,
} from '../../../utils/toast';
import type {
	Message,
	MessageAction,
} from '../../../types';
import {
	BiTrash,
	BiX,
	BiCheck,
	BiCopy,
	BiEdit,
	BiStar,
} from 'react-icons/bi';

type MessageActionsProps = {
	message: Message;
	onAction: (
		action: MessageAction,
		messageId: string,
		newText?: string
	) => void;
	isVisible: boolean;
	onClose: () => void;
};

const MessageActions = ({
	message,
	onAction,
	isVisible,
	onClose,
}: MessageActionsProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(message.text);
	const [showDeleteConfirm, setShowDeleteConfirm] =
		useState(false);
	const [copyFeedback, setCopyFeedback] = useState(false);
	const { isDark } = useTheme();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(
		null
	);

	// Auto-close after 3 seconds unless hovering
	useEffect(() => {
		if (isVisible && !isEditing && !showDeleteConfirm) {
			timeoutRef.current = setTimeout(() => {
				onClose();
			}, 3000);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [isVisible, isEditing, showDeleteConfirm, onClose]);

	const handleMouseEnter = () => {
		// Clear any pending close timeout when hovering
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
	};

	const handleMouseLeave = () => {
		// Set 3-second delay before closing when leaving hover
		hoverTimeoutRef.current = setTimeout(() => {
			onClose();
		}, 3000);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(
				message.text
			);
			setCopyFeedback(true);
			showSuccessToast(
				'Copied',
				'Message copied to clipboard'
			);
			setTimeout(() => setCopyFeedback(false), 2000);
		} catch {
			showErrorToast(
				'Copy Failed',
				'Failed to copy message to clipboard'
			);
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
		setEditText(message.text);
	};

	const handleSaveEdit = () => {
		const trimmedText = editText.trim();
		if (trimmedText && trimmedText !== message.text) {
			onAction('edit', message.id, trimmedText);
		}
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditText(message.text);
	};

	const handleDeleteConfirm = () => {
		onAction('delete', message.id);
		setShowDeleteConfirm(false);
		showToast(
			'Message deleted',
			'Message deleted successfully',
			'success'
		);
	};

	const handleFavorite = () => {
		onAction(
			message.isFavorite ? 'unfavorite' : 'favorite',
			message.id
		);
	};

	if (!isVisible) return null;

	// Delete confirmation overlay
	if (showDeleteConfirm) {
		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
				<div
					className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${
						isDark
							? 'bg-chat-secondary border border-chat-accent/30'
							: 'bg-white border border-gray-200'
					}`}
				>
					<div className='flex items-center gap-3 mb-4'>
						<div className='w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center'>
							<BiTrash className='text-red-500 text-2xl' />
						</div>
						<div>
							<h3
								className={`font-semibold text-lg ${
									isDark
										? 'text-white'
										: 'text-gray-900'
								}`}
							>
								Delete Message
							</h3>
							<p
								className={`text-sm ${
									isDark
										? 'text-gray-400'
										: 'text-gray-500'
								}`}
							>
								This action cannot be undone
							</p>
						</div>
					</div>

					<p
						className={`mb-6 ${
							isDark
								? 'text-gray-300'
								: 'text-gray-700'
						}`}
					>
						Are you sure you want to delete this
						message?
					</p>

					<div className='flex flex-col sm:flex-row gap-3 sm:justify-end'>
						<button
							onClick={() =>
								setShowDeleteConfirm(false)
							}
							className={`px-4 py-2 rounded-lg font-medium transition-all ${
								isDark
									? 'bg-chat-accent/20 text-chat-accent hover:bg-chat-accent/30'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							Cancel
						</button>
						<button
							onClick={handleDeleteConfirm}
							className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all'
						>
							Delete Message
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Edit mode
	if (isEditing) {
		return (
			<div
				className={`absolute top-full mt-2 p-4 rounded-xl shadow-lg border-2 z-20 w-80 max-w-full ${
					message.type === 'prompt'
						? 'right-0 mr-4' // User messages - position from right
						: 'left-0 ml-4' // AI messages - position from left
				} ${
					isDark
						? 'bg-chat-secondary border-chat-accent/30'
						: 'bg-white border-gray-200'
				}`}
			>
				<div className='space-y-3'>
					<textarea
						value={editText}
						onChange={(e) =>
							setEditText(e.target.value)
						}
						className={`w-full p-3 rounded-lg border-2 resize-none min-h-[100px] max-h-[200px] focus:outline-none transition-all text-sm md:text-base ${
							isDark
								? 'bg-chat-primary text-white border-chat-accent/30 focus:border-chat-pink'
								: 'bg-gray-50 text-gray-800 border-gray-300 focus:border-chat-pink'
						}`}
						placeholder='Edit your message...'
						autoFocus
					/>
					<div className='flex gap-2 justify-end'>
						<button
							onClick={handleCancelEdit}
							className={`p-3 rounded-lg transition-all text-lg ${
								isDark
									? 'text-chat-accent hover:bg-chat-accent/20 hover:text-white'
									: 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
							}`}
							title='Cancel'
						>
							<BiX />
						</button>
						<button
							onClick={handleSaveEdit}
							disabled={
								!editText.trim() ||
								editText.trim() ===
									message.text
							}
							className='p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed'
							title='Save Changes'
						>
							<BiCheck />
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Action buttons
	return (
		<div
			className={`absolute top-full mt-2 flex items-center gap-1 p-2 rounded-xl shadow-lg border-2 z-10 ${
				message.type === 'prompt'
					? 'right-0 mr-4' // User messages - position from right with margin
					: 'left-0 ml-4' // AI messages - position from left with margin
			} ${
				isDark
					? 'bg-chat-secondary border-chat-accent/30'
					: 'bg-white border-gray-200'
			}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Copy with feedback */}
			<div className='relative'>
				<button
					onClick={handleCopy}
					className={`p-2 rounded-lg transition-all ${
						copyFeedback
							? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
							: isDark
							? 'text-chat-accent hover:bg-chat-accent/20 hover:text-white'
							: 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
					}`}
					title={
						copyFeedback
							? 'Copied!'
							: 'Copy message'
					}
				>
					{copyFeedback ? (
						<BiCheck className='text-lg' />
					) : (
						<BiCopy className='text-lg' />
					)}
				</button>
				{copyFeedback && (
					<div className='absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded whitespace-nowrap'>
						Copied!
					</div>
				)}
			</div>

			{/* Edit (only for user messages) */}
			{message.type === 'prompt' && (
				<button
					onClick={handleEdit}
					className={`p-2 rounded-lg transition-all ${
						isDark
							? 'text-chat-accent hover:bg-chat-accent/20 hover:text-white'
							: 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
					}`}
					title='Edit message'
				>
					<BiEdit className='text-lg' />
				</button>
			)}

			{/* Favorite */}
			<button
				onClick={handleFavorite}
				className={`p-2 rounded-lg transition-all ${
					message.isFavorite
						? 'text-yellow-500 hover:text-yellow-600'
						: isDark
						? 'text-chat-accent hover:bg-chat-accent/20 hover:text-white'
						: 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
				}`}
				title={
					message.isFavorite
						? 'Remove from favorites'
						: 'Add to favorites'
				}
			>
				<BiStar
					className={`text-lg ${
						message.isFavorite
							? 'fill-current'
							: ''
					}`}
				/>
			</button>

			{/* Delete */}
			<button
				onClick={() => setShowDeleteConfirm(true)}
				className={`p-2 rounded-lg transition-all ${
					isDark
						? 'text-chat-accent hover:bg-red-500/20 hover:text-red-400'
						: 'text-gray-600 hover:bg-red-50 hover:text-red-600'
				}`}
				title='Delete message'
			>
				<BiTrash className='text-lg' />
			</button>
		</div>
	);
};

export default MessageActions;
