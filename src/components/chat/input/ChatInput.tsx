import React, {
	useCallback,
	useMemo,
	useRef,
	useEffect,
} from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useTheme } from '../../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

// Phase 1: UI Store import
import { useUIStore } from '../../../stores/uiStore';
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
	MdEmojiEmotions,
	MdSend,
	MdMoreHoriz,
	MdAutoAwesome,
	MdOutlineAutoAwesome,
	MdApps,
	MdFace,
} from 'react-icons/md';
import type { EmojiData } from '../../../types';
import VoiceControls from '../../voice/VoiceControls';
import SmartAutoComplete from './SmartAutoComplete';

import { settingsManager } from '../../../utils/settings';
// Using only the context toast system
import { useToast } from '../../../contexts/ToastContext';

const ChatInput: React.FC = () => {
	const { isDark } = useTheme();
	const inputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	// Get toast context
	const toast = useToast();

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

	// Get UI state from Zustand store
	const {
		toggleEmojiPicker,
		closeEmojiPicker,
		showEmojiPicker,
		toggleUnifiedTemplates,
		togglePersonaSelector,
		toggleAutoSuggestions: toggleAutoSuggestionsAction,
		closeAutoSuggestions,
		showAutoSuggestions,
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
			// Only show suggestions if input is between 10 and 60 characters
			if (
				inputValue.trim().length >= 10 &&
				inputValue.trim().length <= 60 &&
				appSettings.autoSuggestions !== false
			) {
				// Only show suggestions if they're not already showing
				if (!showAutoSuggestions) {
					toggleAutoSuggestionsAction();
				}
				// Auto suggestions is already implemented in SmartAutoComplete component
				// We just need to pass the suggestions back to our store
			} else {
				if (showAutoSuggestions) {
					closeAutoSuggestions();
					clearSuggestions();
				}
			}
		}, 500);

		return () => clearTimeout(debounceTimer);
	}, [
		inputValue,
		showAutoSuggestions,
		toggleAutoSuggestionsAction,
		closeAutoSuggestions,
		clearSuggestions,
		appSettings,
		autoSuggestions.length,
	]);

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

	// Toggle auto-suggestions with notification
	const toggleAutoSuggestionsWithNotification =
		useCallback(() => {
			// Calculate the target state (opposite of current)
			const newState = !showAutoSuggestions;

			// Directly update the UI store with the new state
			useUIStore.setState({
				showAutoSuggestions: newState,
			});

			// If disabling, clear existing suggestions
			if (!newState) {
				clearSuggestions();
			}

			// Show appropriate toast based on the new state
			if (newState) {
				// ENABLED notification
				toast.showSuccess(
					'Auto-suggestions Enabled',
					'Type at least 10 characters for suggestions (max 60)'
				);

				// Update user settings
				settingsManager.updateSettings({
					...appSettings,
					autoSuggestions: true,
				});
			} else {
				// DISABLED notification
				toast.showInfo(
					'Auto-suggestions Disabled',
					'You can re-enable this feature anytime'
				);

				// Update user settings
				settingsManager.updateSettings({
					...appSettings,
					autoSuggestions: false,
				});
			}
		}, [
			showAutoSuggestions,
			clearSuggestions,
			appSettings,
			toast,
		]);

	const handleSettingsNavigation = () => {
		navigate('/settings');
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

					{/* Auto-suggestions Toggle Button */}
					<button
						type='button'
						onClick={
							toggleAutoSuggestionsWithNotification
						}
						className={`flex-shrink-0 p-3 text-2xl transition-colors ${
							showAutoSuggestions
								? isDark
									? 'text-chat-pink hover:text-chat-orange'
									: 'text-chat-purple hover:text-chat-orange'
								: isDark
								? 'text-chat-accent hover:text-chat-pink'
								: 'text-chat-light-accent hover:text-chat-purple'
						}`}
						title={
							showAutoSuggestions
								? 'Disable auto-suggestions'
								: 'Enable auto-suggestions'
						}
					>
						{showAutoSuggestions ? (
							<MdAutoAwesome />
						) : (
							<MdOutlineAutoAwesome />
						)}
					</button>
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

				{/* Auto-suggestions */}
				{showAutoSuggestions && (
					<SmartAutoComplete
						inputValue={inputValue}
						onSelectSuggestion={
							handleSelectSuggestion
						}
						isVisible={showAutoSuggestions}
						onClose={() => {
							closeAutoSuggestions();
							clearSuggestions();
						}}
					/>
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
						placeholder={
							showAutoSuggestions
								? 'Type at least 10 characters for suggestions (max 60)...'
								: 'Type your message here...'
						}
						className={`w-full text-base py-2 px-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 focus:scale-[1.02] ${
							isDark
								? `bg-chat-secondary/50 text-white placeholder:text-chat-accent/60 border-chat-accent/30 focus:border-chat-pink hover:border-chat-orange/40 ${
										showAutoSuggestions
											? 'border-chat-pink/70'
											: ''
								  }`
								: `bg-gray-50 text-gray-800 placeholder:text-gray-500 border-chat-purple/30 focus:border-chat-pink hover:border-chat-purple/50 ${
										showAutoSuggestions
											? 'border-chat-purple/70'
											: ''
								  }`
						}`}
					/>

					{/* Auto-suggestions active indicator */}
					{showAutoSuggestions && (
						<div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center'>
							<span
								className={`text-xs px-2 py-1 rounded-full ${
									isDark
										? 'bg-chat-pink/20 text-chat-pink'
										: 'bg-chat-purple/20 text-chat-purple'
								}`}
							>
								{autoSuggestions.length}{' '}
								suggestions
							</span>
						</div>
					)}
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

				{/* More Options (Mobile) */}
				<button
					type='button'
					className='md:hidden flex-shrink-0 p-2 rounded-full text-lg'
					onClick={handleSettingsNavigation}
				>
					<MdMoreHoriz
						className={
							isDark
								? 'text-chat-accent'
								: 'text-chat-light-accent'
						}
					/>
				</button>
			</div>
		</form>
	);
};

export default ChatInput;
