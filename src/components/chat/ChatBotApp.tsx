import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAutoScroll } from '../../hooks/useAutoScroll';
import ToastContainer from '../ui/ToastContainer';
import { useToast } from '../../contexts/ToastContext';

// Phase 3: Chat Store import
import { useMessages } from '../../stores/chatStore';
import PWAPrompt from '../ui/PWAPrompt';

// Authentication imports
import { authService } from '../../services/authService';

// New component imports
import ChatLayout from './layout/ChatLayout';
import ChatMessages from './messages/ChatMessages';
import ChatInput from './input/ChatInput';
import ModalContainer from './modals/ModalContainer';
import ChatTitle from './ChatTitle';
import DocumentViewer from '../document/DocumentViewer';

const ChatBotApp = () => {
	const navigate = useNavigate();
	const { showInfo } = useToast();

	// Phase 3: Chat state from store
	const messages = useMessages();

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

	const handleGoBack = async () => {
		// Show logout message
		showInfo(
			'Logged Out',
			'You have been logged out. Please log in again to access the chat.'
		);

		// Logout user
		await authService.logout();

		// Navigate to home page
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
				{/* Document Viewer */}
				<DocumentViewer />

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
