import React, {
	useCallback,
	useMemo,
	useRef,
	useEffect,
	useState,
} from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useTheme } from '../../../contexts/ThemeContext';

// Phase 1: UI Store import
import {
	useEmojiPickerState,
	useUIStore,
	useAutoSuggestionsState,
} from '../../../stores/uiStore';
// Phase 2: Input Store import
import {
	useInputValue,
	useInputStore,
	useAutoSuggestions,
} from '../../../stores/inputStore';
// Phase 3: Chat Store import
import {
	useChatStore,
	useChats,
	useMessages,
} from '../../../stores/chatStore';

import {
	MdFlashOn,
	MdCollections,
	MdEmojiEmotions,
	MdSend,
	MdMoreHoriz,
} from 'react-icons/md';
import type { EmojiData } from '../../../types';
import VoiceControls from '../../voice/VoiceControls';
import SmartAutoComplete from './SmartAutoComplete';

import { settingsManager } from '../../../utils/settings';

const ChatInput: React.FC = () => {
	const { isDark } = useTheme();
	const inputRef = useRef<HTMLInputElement>(null);
	const [cursorPosition, setCursorPosition] = useState({
		x: 0,
		y: 0,
	});

	// Phase 2: Input state from store
	const inputValue = useInputValue();
	const autoSuggestions = useAutoSuggestions();
	const {
		updateInputValue,
		appendToInput,
		clearInput,
		clearSuggestions,
		setInputValue,
	} = useInputStore();

	// Phase 1: UI state from Zustand store
	const showEmojiPicker = useEmojiPickerState();
	const showAutoSuggestions = useAutoSuggestionsState();
	const {
		toggleEmojiPicker,
		closeEmojiPicker,
		toggleQuickResponses,
		toggleConversationTemplates,
		toggleAutoSuggestions,
		closeAutoSuggestions,
	} = useUIStore();

	// Phase 3: Chat state from store
	const { sendMessage, createNewChat } = useChatStore();
	const chats = useChats();
	const messages = useMessages();

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

	// Add auto-suggestion functions after lastAIMessage logic
	// Get auto-suggestions using the SmartAutoComplete component
	useEffect(() => {
		// Debounce suggestions to avoid too many API calls
		const debounceTimer = setTimeout(() => {
			if (inputValue.trim().length >= 10) {
				toggleAutoSuggestions();
				// Auto suggestions is already implemented in SmartAutoComplete component
				// We just need to pass the suggestions back to our store
			} else {
				closeAutoSuggestions();
				clearSuggestions();
			}
		}, 500);

		return () => clearTimeout(debounceTimer);
	}, [
		inputValue,
		toggleAutoSuggestions,
		closeAutoSuggestions,
		clearSuggestions,
	]);

	// Update cursor position when input changes
	useEffect(() => {
		if (inputRef.current) {
			const rect =
				inputRef.current.getBoundingClientRect();
			// Calculate cursor position based on input element
			setCursorPosition({
				x: rect.left,
				y: rect.bottom + 5, // Position below input with small gap
			});
		}
	}, [inputValue]);

	// Handle keyboard navigation for suggestions
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			// Only process if we have suggestions and they're visible
			if (
				!showAutoSuggestions ||
				autoSuggestions.length === 0
			)
				return;

			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault();
					useInputStore
						.getState()
						.selectNextSuggestion();
					break;
				case 'ArrowUp':
					e.preventDefault();
					useInputStore
						.getState()
						.selectPrevSuggestion();
					break;
				case 'Tab':
				case 'Enter': {
					if (e.key === 'Tab') e.preventDefault();
					const selectedSuggestion = useInputStore
						.getState()
						.getSelectedSuggestion();
					if (selectedSuggestion) {
						setInputValue(
							selectedSuggestion.text
						);
						clearSuggestions();
						closeAutoSuggestions();
					}
					break;
				}
				case 'Escape':
					closeAutoSuggestions();
					clearSuggestions();
					break;
			}
		},
		[
			showAutoSuggestions,
			autoSuggestions.length,
			setInputValue,
			clearSuggestions,
			closeAutoSuggestions,
		]
	);

	// Handle suggestion selection
	const handleSelectSuggestion = useCallback(
		(suggestion: string) => {
			setInputValue(suggestion);
			clearSuggestions();
			closeAutoSuggestions();
		},
		[
			setInputValue,
			clearSuggestions,
			closeAutoSuggestions,
		]
	);

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
					{/* Quick Responses Button - Mobile */}
					<button
						type='button'
						onClick={toggleQuickResponses}
						className={`flex-shrink-0 p-2 text-lg transition-colors ${
							isDark
								? 'text-chat-accent hover:text-chat-orange'
								: 'text-chat-light-accent hover:text-chat-orange'
						}`}
						title='Quick responses'
					>
						<MdFlashOn />
					</button>

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
					{/* Quick Responses Button */}
					<button
						type='button'
						onClick={toggleQuickResponses}
						className={`flex-shrink-0 p-3 text-2xl transition-colors ${
							isDark
								? 'text-chat-accent hover:text-chat-orange'
								: 'text-chat-light-accent hover:text-chat-orange'
						}`}
						title='Quick responses'
					>
						<MdFlashOn />
					</button>

					{/* Templates Button */}
					<button
						type='button'
						onClick={
							toggleConversationTemplates
						}
						className={`flex-shrink-0 p-3 text-2xl transition-colors ${
							isDark
								? 'text-chat-accent hover:text-chat-purple'
								: 'text-chat-light-accent hover:text-chat-purple'
						}`}
						title='Conversation templates'
					>
						<MdCollections />
					</button>

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
						onKeyDown={handleKeyDown}
						ref={inputRef}
						placeholder='Type your message here...'
						className={`w-full text-base py-2 px-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 focus:scale-[1.02] ${
							isDark
								? 'bg-chat-secondary/50 text-white placeholder:text-chat-accent/60 border-chat-accent/30 focus:border-chat-pink hover:border-chat-orange/40'
								: 'bg-gray-50 text-gray-800 placeholder:text-gray-500 border-chat-purple/30 focus:border-chat-pink hover:border-chat-purple/50'
						}`}
					/>

					{/* Auto-suggestions */}
					{showAutoSuggestions &&
						autoSuggestions.length > 0 && (
							<SmartAutoComplete
								inputValue={inputValue}
								onSelectSuggestion={
									handleSelectSuggestion
								}
								isVisible={
									showAutoSuggestions
								}
								position={cursorPosition}
								onClose={() => {
									closeAutoSuggestions();
									clearSuggestions();
								}}
							/>
						)}
				</div>

				{/* Send Button */}
				<button
					type='submit'
					disabled={!inputValue.trim()}
					className='flex-shrink-0 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple p-2 md:p-3 text-xl text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
				>
					<MdSend />
				</button>

				{/* Mobile: Additional Options Button */}
				<div className='md:hidden flex-shrink-0'>
					<button
						type='button'
						onClick={toggleEmojiPicker}
						className={`p-2 text-lg transition-colors ${
							isDark
								? 'text-chat-accent hover:text-chat-orange'
								: 'text-chat-light-accent hover:text-chat-orange'
						}`}
						title='More options'
					>
						<MdMoreHoriz />
					</button>
				</div>
			</div>

			{/* Mobile: Secondary Row for Templates */}
			<div className='md:hidden mt-2 flex items-center justify-center gap-2'>
				<button
					type='button'
					onClick={toggleConversationTemplates}
					className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
						isDark
							? 'bg-chat-secondary/50 text-chat-accent hover:bg-chat-secondary'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
					}`}
					title='Conversation templates'
				>
					<MdCollections />
					<span>Templates</span>
				</button>
			</div>

			{/* Decorative elements */}
			<div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-chat-pink to-chat-purple rounded-full'></div>
		</form>
	);
};

export default ChatInput;
