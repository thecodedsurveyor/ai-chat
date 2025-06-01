import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAutoScroll } from '../../hooks/useAutoScroll';
import ToastContainer from '../ui/ToastContainer';

// Phase 1: UI Store import
import { useUIStore } from '../../stores/uiStore';
// Phase 3: Chat Store import
import {
	useChatStore,
	useMessages,
	useActiveChat,
} from '../../stores/chatStore';
import PWAPrompt from '../ui/PWAPrompt';
import {
	VoiceNavigationManager,
	VOICE_ACTIONS,
} from '../../utils/voiceNavigation';

// Settings imports
import { settingsManager } from '../../utils/settings';

// Authentication imports
import { authService } from '../../services/authService';

// New component imports
import ChatLayout from './layout/ChatLayout';
import ChatMessages from './messages/ChatMessages';
import ChatInput from './input/ChatInput';
import ModalContainer from './modals/ModalContainer';
import ChatTitle from './ChatTitle';

const ChatBotApp = () => {
	const navigate = useNavigate();

	// Phase 3: Chat state from store
	const messages = useMessages();
	const activeChat = useActiveChat();
	const { createNewChat, updateChat } = useChatStore();

	// Phase 1: UI state from Zustand store
	const {
		toggleChatList,
		toggleSettings,
		toggleAdvancedSearch,
	} = useUIStore();

	const { scrollRef, containerRef } = useAutoScroll([
		messages,
	]);

	// Authentication check
	useEffect(() => {
		const user = authService.getUser();
		const isAuthenticated =
			authService.isAuthenticated();

		if (!isAuthenticated || !user) {
			navigate('/auth');
			return;
		}
	}, [navigate]);

	// Initialize settings managers
	useEffect(() => {
		const appSettings = settingsManager.getSettings();

		// Initialize voice navigation
		if (
			appSettings.voiceNavigation.enabled &&
			VoiceNavigationManager.isSupported()
		) {
			const vm = VoiceNavigationManager.getInstance(
				appSettings.voiceNavigation
			);

			// Subscribe to voice commands
			const unsubscribe = vm.subscribe(
				(_command, action) => {
					switch (action) {
						case VOICE_ACTIONS.CREATE_CHAT:
							createNewChat();
							break;
						case VOICE_ACTIONS.OPEN_SETTINGS:
							toggleSettings();
							break;
						case VOICE_ACTIONS.OPEN_SEARCH:
							toggleAdvancedSearch();
							break;
						case VOICE_ACTIONS.OPEN_ANALYTICS:
							navigate('/analytics');
							break;
						case VOICE_ACTIONS.TOGGLE_SIDEBAR:
							toggleChatList();
							break;
						case VOICE_ACTIONS.CLEAR_CHAT:
							if (activeChat) {
								// Clear current chat messages
								updateChat(activeChat, {
									messages: [],
								});
							}
							break;
						case VOICE_ACTIONS.GO_HOME:
							navigate('/');
							break;
					}
				}
			);

			vm.start();

			return () => {
				unsubscribe();
				vm.stop();
			};
		}
	}, [
		createNewChat,
		toggleSettings,
		toggleAdvancedSearch,
		toggleChatList,
		activeChat,
		updateChat,
		navigate,
	]);

	const handleGoBack = () => {
		navigate('/');
	};

	// Get category color for chat items
	const getCategoryColor = (category?: string) => {
		switch (category) {
			case 'work':
				return 'border-l-4 border-blue-500';
			case 'personal':
				return 'border-l-4 border-green-500';
			case 'research':
				return 'border-l-4 border-purple-500';
			case 'general':
				return 'border-l-4 border-gray-500';
			default:
				return '';
		}
	};

	// Don't render anything if not authenticated (will redirect)
	if (!authService.isAuthenticated()) {
		return null;
	}

	return (
		<ToastContainer>
			{/* Dynamic Chat Title */}
			<ChatTitle />

			<ChatLayout
				onGoBack={handleGoBack}
				getCategoryColor={getCategoryColor}
			>
				{/* Chat Messages */}
				<ChatMessages
					containerRef={
						containerRef as React.RefObject<HTMLDivElement>
					}
					scrollRef={
						scrollRef as React.RefObject<HTMLDivElement>
					}
				/>

				{/* Chat Input */}
				<ChatInput />
			</ChatLayout>

			{/* All Modals */}
			<ModalContainer />

			{/* PWA Prompt and Network Status */}
			<PWAPrompt />
		</ToastContainer>
	);
};

export default ChatBotApp;
