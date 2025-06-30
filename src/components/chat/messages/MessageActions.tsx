import {
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react';
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
	BiCheck,
	BiCopy,
	BiStar,
} from 'react-icons/bi';
import { MdVolumeUp, MdStop } from 'react-icons/md';

type MessageActionsProps = {
	message: Message;
	onAction: (
		action: MessageAction,
		messageId: string,
		newText?: string
	) => void;
	isVisible?: boolean; // Made optional, defaults to true for AI messages
	onClose?: () => void; // Made optional since we'll auto-show for AI messages
	alwaysVisible?: boolean; // New prop to always show buttons
};

const MessageActions = ({
	message,
	onAction,
	isVisible = true,
	onClose,
	alwaysVisible = false,
}: MessageActionsProps) => {
	const [showDeleteConfirm, setShowDeleteConfirm] =
		useState(false);
	const [copyFeedback, setCopyFeedback] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const { isDark } = useTheme();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const synthRef = useRef<SpeechSynthesis | null>(null);

	// Initialize speech synthesis
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			'speechSynthesis' in window
		) {
			synthRef.current = window.speechSynthesis;
		}
	}, []);

	// Speak text function
	const speak = useCallback((text: string) => {
		if (!synthRef.current || !text.trim()) return;

		synthRef.current.cancel();

		const cleanText = text
			.replace(/[*_`~]/g, '')
			.replace(/https?:\/\/[^\s]+/g, 'link')
			.replace(/\n+/g, '. ');

		const utterance = new SpeechSynthesisUtterance(
			cleanText
		);
		utterance.rate = 1;
		utterance.pitch = 1;
		utterance.volume = 0.8;
		utterance.lang = 'en-US';

		utterance.onstart = () => setIsSpeaking(true);
		utterance.onend = () => setIsSpeaking(false);
		utterance.onerror = () => setIsSpeaking(false);

		synthRef.current.speak(utterance);
	}, []);

	// Stop speaking function
	const stopSpeaking = useCallback(() => {
		if (synthRef.current) {
			synthRef.current.cancel();
			setIsSpeaking(false);
		}
	}, []);

	// Auto-close after 3 seconds unless hovering (only if not always visible)
	useEffect(() => {
		if (
			isVisible &&
			!showDeleteConfirm &&
			!alwaysVisible &&
			onClose
		) {
			timeoutRef.current = setTimeout(() => {
				onClose();
			}, 3000);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [
		isVisible,
		showDeleteConfirm,
		alwaysVisible,
		onClose,
	]);

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

	// Always show buttons for all message types by default
	const shouldShow = true;

	if (!shouldShow) return null;

	// Delete confirmation overlay
	if (showDeleteConfirm) {
		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4'>
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

	// Action buttons
	return (
		<div
			className={`flex items-center gap-1 ${
				message.type === 'prompt'
					? 'justify-end' // User messages - align right
					: 'justify-start' // AI messages - align left
			}`}
		>
			{/* Copy with feedback */}
			<div className='relative'>
				<button
					onClick={handleCopy}
					className={`p-2 transition-all ${
						copyFeedback
							? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
							: isDark
							? 'text-white/80 hover:text-white'
							: 'text-gray-600/80 hover:text-gray-800'
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

			{/* Read Last Message (only for AI responses) */}
			{message.type === 'response' && (
				<button
					onClick={
						isSpeaking
							? stopSpeaking
							: () => speak(message.text)
					}
					className={`p-2 transition-all ${
						isSpeaking
							? 'text-chat-orange hover:text-chat-pink'
							: isDark
							? 'text-white/80 hover:text-white'
							: 'text-gray-600/80 hover:text-gray-800'
					}`}
					title={
						isSpeaking
							? 'Stop speaking'
							: 'Read message aloud'
					}
				>
					{isSpeaking ? (
						<MdStop className='text-lg' />
					) : (
						<MdVolumeUp className='text-lg' />
					)}
				</button>
			)}

			{/* Favorite */}
			<button
				onClick={handleFavorite}
				className={`p-2 transition-all ${
					message.isFavorite
						? 'text-yellow-500 hover:text-yellow-600'
						: isDark
						? 'text-white/80 hover:text-white'
						: 'text-gray-600/80 hover:text-gray-800'
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
				className={`p-2 transition-all ${
					isDark
						? 'text-white/80 hover:text-red-400'
						: 'text-gray-600/80 hover:text-red-600'
				}`}
				title='Delete message'
			>
				<BiTrash className='text-lg' />
			</button>
		</div>
	);
};

export default MessageActions;

// Wrapper component that always shows action buttons for AI responses
export const AlwaysVisibleMessageActions: React.FC<{
	message: Message;
	onAction: (
		action: MessageAction,
		messageId: string,
		newText?: string
	) => void;
}> = ({ message, onAction }) => {
	// Only show for AI responses
	if (message.type !== 'response') {
		return null;
	}

	return (
		<MessageActions
			message={message}
			onAction={onAction}
			alwaysVisible={true}
			isVisible={true}
		/>
	);
};
