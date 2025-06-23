import React, {
	useCallback,
	useRef,
	useState,
	useEffect,
} from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useTheme } from '../../../contexts/ThemeContext';

// Phase 1: UI Store import
import { useUIStore } from '../../../stores/uiStore';
// Phase 2: Input Store import
import {
	useInputValue,
	useInputStore,
} from '../../../stores/inputStore';
// Phase 3: Chat Store import
import {
	useChatStore,
	useChats,
} from '../../../stores/chatStore';
// Document Store import
import { useActiveDocument } from '../../../stores/documentStore';

import {
	MdEmojiEmotions,
	MdSend,
	MdApps,
	MdFace,
	MdAdd,
	MdExpandMore,
} from 'react-icons/md';
import type { EmojiData } from '../../../types';
import VoiceControls from '../../voice/VoiceControls';
import DocumentUpload from '../../document/DocumentUpload';

import { settingsManager } from '../../../utils/settings';

interface ChatInputProps {
	onBeforeSend?: () => boolean;
	onAfterSend?: () => void;
	isGuestMode?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = (props) => {
	const {
		onBeforeSend,
		onAfterSend,
		isGuestMode = false,
	} = props;
	const { isDark } = useTheme();
	const inputRef = useRef<HTMLInputElement>(null);

	// Local state for dropdown menus
	const [showContentTools, setShowContentTools] =
		useState(false);

	// Phase 2: Input state from store
	const inputValue = useInputValue();
	const { updateInputValue, appendToInput, clearInput } =
		useInputStore();

	// Get UI state from Zustand store
	const {
		toggleEmojiPicker,
		closeEmojiPicker,
		showEmojiPicker,
		toggleUnifiedTemplates,
		togglePersonaSelector,
	} = useUIStore();

	// Phase 3: Chat state from store
	const { sendMessage, createNewChat } = useChatStore();
	const chats = useChats();

	// Document state
	const activeDocument = useActiveDocument();

	// Get app settings
	const appSettings = settingsManager.getSettings();

	// Get last AI message for voice playback - removed since now in MessageActions

	// Local handlers
	const handleSendMessage = useCallback(() => {
		if (!inputValue.trim()) return;

		// Check guest usage limit before sending
		if (onBeforeSend && !onBeforeSend()) {
			return; // Usage limit reached or other restriction
		}

		if (chats.length === 0) {
			createNewChat(inputValue);
		} else {
			sendMessage(inputValue);
		}

		// Increment guest usage after successful send
		if (onAfterSend) {
			onAfterSend();
		}

		clearInput();
		closeEmojiPicker();
		setShowContentTools(false);
	}, [
		inputValue,
		chats.length,
		createNewChat,
		sendMessage,
		clearInput,
		closeEmojiPicker,
		onBeforeSend,
		onAfterSend,
	]);

	const handleEmojiClick = useCallback(
		(emoji: EmojiData) => {
			appendToInput(emoji.native);
			closeEmojiPicker();
			setShowContentTools(false);
		},
		[appendToInput, closeEmojiPicker]
	);

	const handleVoiceInput = useCallback(
		(text: string) => {
			updateInputValue({
				target: { value: text },
			} as React.ChangeEvent<HTMLInputElement>);
			// Auto-send the message after voice input
			setTimeout(() => {
				if (text.trim()) {
					if (chats.length === 0) {
						createNewChat(text);
					} else {
						sendMessage(text);
					}
					clearInput();
				}
			}, 100);
		},
		[
			chats.length,
			createNewChat,
			sendMessage,
			updateInputValue,
			clearInput,
		]
	);

	const handleVoiceCommand = useCallback(() => {
		// Voice commands are handled in ChatBotApp component
		// Command processed silently for better UX
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSendMessage();
	};

	// Close dropdowns when clicking outside
	const handleInputFocus = useCallback(() => {
		closeEmojiPicker();
		setShowContentTools(false);
	}, [closeEmojiPicker]);

	// Add click outside handler to close dropdowns
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;

			// Don't close if clicking on dropdown buttons or their content
			if (
				target.closest('[data-dropdown-trigger]') ||
				target.closest('[data-dropdown-content]')
			) {
				return;
			}

			// Close all dropdowns
			setShowContentTools(false);
			closeEmojiPicker();
		};

		document.addEventListener(
			'mousedown',
			handleClickOutside
		);
		return () => {
			document.removeEventListener(
				'mousedown',
				handleClickOutside
			);
		};
	}, [closeEmojiPicker]);

	return (
		<form
			onSubmit={handleSubmit}
			className={`relative p-2 sm:p-4 shadow-2xl ${
				isDark
					? 'bg-gradient-to-r from-chat-secondary to-chat-primary border-t-2 border-chat-accent/30'
					: 'bg-white/95 backdrop-blur-sm border-t-2 border-chat-pink/40'
			}`}
		>
			{/* Guest Mode Banner - Mobile Safe Position */}
			{isGuestMode && (
				<div className='mb-2 flex justify-center'>
					<div
						className={`text-xs px-2 py-1 rounded-lg inline-flex items-center gap-2 ${
							isDark
								? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
								: 'bg-yellow-100 text-yellow-700 border border-yellow-300'
						}`}
					>
						🎯{' '}
						<span className='font-medium'>
							Guest Mode - Limited Usage
						</span>
					</div>
				</div>
			)}

			{/* Desktop Layout */}
			<div
				className={`hidden md:flex items-center gap-2 rounded-2xl p-3 shadow-inner backdrop-blur-sm ${
					isDark
						? 'bg-chat-primary border-2 border-chat-pink/30 hover:border-chat-orange/40'
						: 'bg-white border-2 border-chat-purple/40 hover:border-chat-pink/50'
				}`}
			>
				{/* Desktop: Grouped buttons for cleaner layout */}
				<div className='flex items-center gap-3'>
					{/* Content Tools Group */}
					<div className='relative'>
						<button
							type='button'
							data-dropdown-trigger
							onClick={() =>
								setShowContentTools(
									!showContentTools
								)
							}
							className={`flex items-center gap-1 p-2 rounded-lg text-sm transition-colors ${
								isDark
									? 'text-chat-accent hover:text-chat-purple hover:bg-chat-secondary/50'
									: 'text-chat-light-accent hover:text-chat-purple hover:bg-gray-100'
							}`}
							title='Content Tools'
						>
							<MdAdd className='text-lg' />
							<MdExpandMore
								className={`text-sm transition-transform ${
									showContentTools
										? 'rotate-180'
										: ''
								}`}
							/>
						</button>

						{showContentTools && (
							<div
								data-dropdown-content
								className={`absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-lg border z-20 ${
									isDark
										? 'bg-chat-secondary border-chat-accent/30'
										: 'bg-white border-gray-300'
								}`}
							>
								<div className='flex flex-col gap-1 min-w-max'>
									<button
										type='button'
										onClick={() => {
											toggleUnifiedTemplates();
											setShowContentTools(
												false
											);
										}}
										className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${
											isDark
												? 'text-chat-accent hover:text-chat-purple hover:bg-chat-primary/50'
												: 'text-gray-700 hover:text-chat-purple hover:bg-gray-100'
										}`}
									>
										<MdApps className='text-xl' />
										Templates
									</button>
									<button
										type='button'
										onClick={() => {
											toggleEmojiPicker();
											setShowContentTools(
												false
											);
										}}
										className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${
											isDark
												? 'text-chat-accent hover:text-chat-orange hover:bg-chat-primary/50'
												: 'text-gray-700 hover:text-chat-orange hover:bg-gray-100'
										}`}
									>
										<MdEmojiEmotions className='text-xl' />
										Emojis
									</button>
									<button
										type='button'
										onClick={() => {
											togglePersonaSelector();
											setShowContentTools(
												false
											);
										}}
										className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${
											isDark
												? 'text-chat-accent hover:text-chat-pink hover:bg-chat-primary/50'
												: 'text-gray-700 hover:text-chat-pink hover:bg-gray-100'
										}`}
									>
										<MdFace className='text-xl' />
										AI Personas
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Document Upload - Standalone */}
					<div className='flex-shrink-0'>
						<DocumentUpload />
					</div>

					{/* Voice Controls - Standalone */}
					<div className='flex-shrink-0'>
						<VoiceControls
							onVoiceInput={handleVoiceInput}
							onVoiceCommand={
								handleVoiceCommand
							}
							className='flex items-center'
							voiceSettings={
								appSettings.voiceSynthesis
							}
						/>
					</div>
				</div>

				{/* Emoji Picker */}
				{showEmojiPicker && (
					<div className='absolute bottom-20 left-4 z-10'>
						<Picker
							data={data}
							onEmojiSelect={handleEmojiClick}
						/>
					</div>
				)}

				{/* Input Field */}
				<div className='flex-1 relative min-w-0'>
					<input
						type='text'
						value={inputValue}
						onChange={updateInputValue}
						onFocus={handleInputFocus}
						ref={inputRef}
						placeholder={
							activeDocument
								? `Ask about "${activeDocument.name}"...`
								: 'Type your message here...'
						}
						className={`w-full text-base py-2 px-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 focus:scale-[1.02] ${
							activeDocument
								? isDark
									? 'bg-chat-pink/10 text-white placeholder:text-chat-pink/80 border-chat-pink/50 focus:border-chat-pink hover:border-chat-pink/70'
									: 'bg-chat-purple/10 text-gray-800 placeholder:text-chat-purple/80 border-chat-purple/50 focus:border-chat-purple hover:border-chat-purple/70'
								: isDark
								? 'bg-chat-secondary/50 text-white placeholder:text-chat-accent/60 border-chat-accent/30 focus:border-chat-pink hover:border-chat-orange/40'
								: 'bg-gray-50 text-gray-800 placeholder:text-gray-500 border-chat-purple/30 focus:border-chat-pink hover:border-chat-purple/50'
						}`}
					/>
				</div>

				{/* Send Button */}
				<button
					type='submit'
					className={`flex-shrink-0 p-3 rounded-full transition-all hover:scale-110 ${
						isDark
							? 'bg-chat-pink text-white hover:bg-chat-orange'
							: 'bg-chat-purple text-white hover:bg-chat-pink'
					}`}
					title='Send message'
				>
					<MdSend className='text-xl' />
				</button>
			</div>

			{/* Mobile Layout - Completely Redesigned */}
			<div className='md:hidden space-y-2'>
				{/* Input Row with Send Button */}
				<div
					className={`flex items-center gap-2 rounded-2xl p-2 shadow-inner backdrop-blur-sm ${
						isDark
							? 'bg-chat-primary border-2 border-chat-pink/30 hover:border-chat-orange/40'
							: 'bg-white border-2 border-chat-purple/40 hover:border-chat-pink/50'
					}`}
				>
					{/* Input Field - Takes Full Width */}
					<div className='flex-1 relative min-w-0'>
						<input
							type='text'
							value={inputValue}
							onChange={updateInputValue}
							onFocus={handleInputFocus}
							ref={inputRef}
							placeholder={
								activeDocument
									? `Ask about "${activeDocument.name}"...`
									: 'Type your message here...'
							}
							className={`w-full text-sm py-3 px-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${
								activeDocument
									? isDark
										? 'bg-chat-pink/10 text-white placeholder:text-chat-pink/80 border-chat-pink/50 focus:border-chat-pink hover:border-chat-pink/70'
										: 'bg-chat-purple/10 text-gray-800 placeholder:text-chat-purple/80 border-chat-purple/50 focus:border-chat-purple hover:border-chat-purple/70'
									: isDark
									? 'bg-chat-secondary/50 text-white placeholder:text-chat-accent/60 border-chat-accent/30 focus:border-chat-pink hover:border-chat-orange/40'
									: 'bg-gray-50 text-gray-800 placeholder:text-gray-500 border-chat-purple/30 focus:border-chat-pink hover:border-chat-purple/50'
							}`}
						/>
					</div>

					{/* Send Button */}
					<button
						type='submit'
						className={`flex-shrink-0 p-3 rounded-full transition-all hover:scale-105 ${
							isDark
								? 'bg-chat-pink text-white hover:bg-chat-orange'
								: 'bg-chat-purple text-white hover:bg-chat-pink'
						}`}
						title='Send message'
					>
						<MdSend className='text-lg' />
					</button>
				</div>

				{/* Tools Row - Underneath Input */}
				<div className='flex items-center justify-center gap-1 px-2'>
					{/* Content Tools Group - Mobile */}
					<div className='relative'>
						<button
							type='button'
							data-dropdown-trigger
							onClick={() =>
								setShowContentTools(
									!showContentTools
								)
							}
							className={`flex items-center gap-1 p-2 rounded-lg text-xs transition-colors ${
								isDark
									? 'text-chat-accent hover:text-chat-purple hover:bg-chat-secondary/50'
									: 'text-chat-light-accent hover:text-chat-purple hover:bg-gray-100'
							}`}
							title='Content Tools'
						>
							<MdAdd className='text-sm' />
							<span className='text-xs'>
								Tools
							</span>
							<MdExpandMore
								className={`text-xs transition-transform ${
									showContentTools
										? 'rotate-180'
										: ''
								}`}
							/>
						</button>

						{showContentTools && (
							<div
								data-dropdown-content
								className={`absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-lg border z-20 ${
									isDark
										? 'bg-chat-secondary border-chat-accent/30'
										: 'bg-white border-gray-300'
								}`}
							>
								<div className='flex flex-col gap-1 min-w-max'>
									<button
										type='button'
										onClick={() => {
											toggleUnifiedTemplates();
											setShowContentTools(
												false
											);
										}}
										className={`flex items-center gap-2 p-2 rounded text-xs transition-colors ${
											isDark
												? 'text-chat-accent hover:text-chat-purple hover:bg-chat-primary/50'
												: 'text-gray-700 hover:text-chat-purple hover:bg-gray-100'
										}`}
									>
										<MdApps className='text-sm' />
										Templates
									</button>
									<button
										type='button'
										onClick={() => {
											toggleEmojiPicker();
											setShowContentTools(
												false
											);
										}}
										className={`flex items-center gap-2 p-2 rounded text-xs transition-colors ${
											isDark
												? 'text-chat-accent hover:text-chat-orange hover:bg-chat-primary/50'
												: 'text-gray-700 hover:text-chat-orange hover:bg-gray-100'
										}`}
									>
										<MdEmojiEmotions className='text-sm' />
										Emojis
									</button>
									<button
										type='button'
										onClick={() => {
											togglePersonaSelector();
											setShowContentTools(
												false
											);
										}}
										className={`flex items-center gap-2 p-2 rounded text-xs transition-colors ${
											isDark
												? 'text-chat-accent hover:text-chat-pink hover:bg-chat-primary/50'
												: 'text-gray-700 hover:text-chat-pink hover:bg-gray-100'
										}`}
									>
										<MdFace className='text-sm' />
										AI Personas
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Document Upload - Mobile */}
					<div className='flex-shrink-0'>
						<DocumentUpload />
					</div>

					{/* Voice Controls - Mobile */}
					<div className='flex-shrink-0'>
						<VoiceControls
							onVoiceInput={handleVoiceInput}
							onVoiceCommand={
								handleVoiceCommand
							}
							className='flex items-center gap-1'
							voiceSettings={
								appSettings.voiceSynthesis
							}
						/>
					</div>
				</div>

				{/* Emoji Picker for Mobile */}
				{showEmojiPicker && (
					<div className='absolute bottom-24 left-4 z-10'>
						<Picker
							data={data}
							onEmojiSelect={handleEmojiClick}
						/>
					</div>
				)}
			</div>
		</form>
	);
};

export default ChatInput;
