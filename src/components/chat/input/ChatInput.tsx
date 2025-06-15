import React, { useCallback, useMemo, useRef } from 'react';
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
	useMessages,
} from '../../../stores/chatStore';
// Document Store import
import { useActiveDocument } from '../../../stores/documentStore';

import {
	MdEmojiEmotions,
	MdSend,
	MdApps,
	MdFace,
} from 'react-icons/md';
import type { EmojiData } from '../../../types';
import VoiceControls from '../../voice/VoiceControls';
import DocumentUpload from '../../document/DocumentUpload';

import { settingsManager } from '../../../utils/settings';

const ChatInput: React.FC = () => {
	const { isDark } = useTheme();
	const inputRef = useRef<HTMLInputElement>(null);

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
	const messages = useMessages();

	// Document state
	const activeDocument = useActiveDocument();

	// Get app settings
	const appSettings = settingsManager.getSettings();

	// Get last AI message for voice playback
	const lastAIMessage = useMemo(() => {
		const aiMessages = messages.filter(
			(m) => m.type === 'response'
		);
		return aiMessages.length > 0
			? aiMessages[aiMessages.length - 1].text
			: undefined;
	}, [messages]);

	// Local handlers
	const handleSendMessage = useCallback(() => {
		if (!inputValue.trim()) return;

		if (chats.length === 0) {
			createNewChat(inputValue);
		} else {
			sendMessage(inputValue);
		}

		clearInput();
		closeEmojiPicker();
	}, [
		inputValue,
		chats.length,
		createNewChat,
		sendMessage,
		clearInput,
		closeEmojiPicker,
	]);

	const handleEmojiClick = useCallback(
		(emoji: EmojiData) => {
			appendToInput(emoji.native);
			closeEmojiPicker();
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

	return (
		<form
			onSubmit={handleSubmit}
			className={`relative p-4 shadow-2xl ${
				isDark
					? 'bg-gradient-to-r from-chat-secondary to-chat-primary border-t-2 border-chat-accent/30'
					: 'bg-white/95 backdrop-blur-sm border-t-2 border-chat-pink/40'
			}`}
		>
			<div
				className={`flex items-center gap-2 rounded-2xl p-3 shadow-inner backdrop-blur-sm ${
					isDark
						? 'bg-chat-primary border-2 border-chat-pink/30 hover:border-chat-orange/40'
						: 'bg-white border-2 border-chat-purple/40 hover:border-chat-pink/50'
				}`}
			>
				{/* Mobile: Show only essential buttons */}
				<div className='md:hidden flex items-center gap-1'>
					{/* Templates Button - Mobile */}
					<button
						type='button'
						onClick={toggleUnifiedTemplates}
						className={`flex-shrink-0 p-2 text-lg transition-colors ${
							isDark
								? 'text-chat-accent hover:text-chat-purple'
								: 'text-chat-light-accent hover:text-chat-purple'
						}`}
						title='Templates'
					>
						<MdApps />
					</button>

					{/* Persona Selector Button - Mobile */}
					<button
						type='button'
						onClick={togglePersonaSelector}
						className={`flex-shrink-0 p-2 text-lg transition-colors ${
							isDark
								? 'text-chat-accent hover:text-chat-pink'
								: 'text-chat-light-accent hover:text-chat-pink'
						}`}
						title='AI Personas'
					>
						<MdFace />
					</button>

					{/* Document Upload Button - Mobile */}
					<div className='flex-shrink-0 scale-75'>
						<DocumentUpload />
					</div>

					{/* Voice Controls - Mobile (Compact) */}
					<div className='flex-shrink-0'>
						<VoiceControls
							onVoiceInput={handleVoiceInput}
							onVoiceCommand={
								handleVoiceCommand
							}
							lastMessage={lastAIMessage}
							className='flex items-center gap-1'
							voiceSettings={
								appSettings.voiceSynthesis
							}
						/>
					</div>
				</div>

				{/* Desktop: Show all buttons */}
				<div className='hidden md:flex items-center gap-4'>
					{/* Templates Button */}
					<button
						type='button'
						onClick={toggleUnifiedTemplates}
						className={`flex-shrink-0 p-3 text-2xl transition-colors ${
							isDark
								? 'text-chat-accent hover:text-chat-purple'
								: 'text-chat-light-accent hover:text-chat-purple'
						}`}
						title='Templates'
					>
						<MdApps />
					</button>

					{/* Persona Selector Button */}
					<button
						type='button'
						onClick={togglePersonaSelector}
						className={`flex-shrink-0 p-3 text-2xl transition-colors ${
							isDark
								? 'text-chat-accent hover:text-chat-pink'
								: 'text-chat-light-accent hover:text-chat-pink'
						}`}
						title='AI Personas'
					>
						<MdFace />
					</button>

					{/* Document Upload Button */}
					<DocumentUpload />

					{/* Emoji Picker Button */}
					<button
						type='button'
						onClick={toggleEmojiPicker}
						className={`flex-shrink-0 p-3 text-2xl transition-colors ${
							isDark
								? 'text-chat-accent hover:text-chat-orange'
								: 'text-chat-light-accent hover:text-chat-orange'
						}`}
					>
						<MdEmojiEmotions />
					</button>

					{/* Voice Controls - Desktop */}
					<div className='flex-shrink-0'>
						<VoiceControls
							onVoiceInput={handleVoiceInput}
							onVoiceCommand={
								handleVoiceCommand
							}
							lastMessage={lastAIMessage}
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
						onFocus={closeEmojiPicker}
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
		</form>
	);
};

export default ChatInput;
