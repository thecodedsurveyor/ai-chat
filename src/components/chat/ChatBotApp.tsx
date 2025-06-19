import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAutoScroll } from '../../hooks/useAutoScroll';
import ToastContainer from '../ui/ToastContainer';
import { useToast } from '../../contexts/ToastContext';

// Phase 3: Chat Store import
import { useMessages } from '../../stores/chatStore';
import PWAPrompt from '../ui/PWAPrompt';

// Authentication imports
import { authService } from '../../services/authService';

// Guest usage tracking
import GuestUsageManager from '../../utils/guestUsageManager';
import GuestLimitModal from './modals/GuestLimitModal';

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

	// Guest usage tracking state
	const [guestLimitModalOpen, setGuestLimitModalOpen] =
		useState(false);
	const [guestUsageStats, setGuestUsageStats] = useState(
		GuestUsageManager.getUsageStats()
	);

	const { scrollRef, containerRef } = useAutoScroll([
		messages,
	]);

	// Check guest usage limit before allowing new messages
	const checkGuestUsageLimit = (): boolean => {
		const isAuthenticated =
			authService.isAuthenticated();

		if (isAuthenticated) {
			return true; // Authenticated users have no limit
		}

		if (GuestUsageManager.hasReachedLimit()) {
			setGuestLimitModalOpen(true);
			return false;
		}

		return true;
	};

	// Increment guest usage when message is sent
	const incrementGuestUsage = () => {
		const isAuthenticated =
			authService.isAuthenticated();

		if (!isAuthenticated) {
			const newStats =
				GuestUsageManager.incrementUsage();
			setGuestUsageStats(
				GuestUsageManager.getUsageStats()
			);

			// Show modal if this was the last use
			if (
				newStats.count >=
				GuestUsageManager.getMaxUses()
			) {
				setGuestLimitModalOpen(true);
			}
		}
	};

	// Update usage stats when authentication status changes
	useEffect(() => {
		const updateStats = () => {
			setGuestUsageStats(
				GuestUsageManager.getUsageStats()
			);
		};

		// Update stats on mount and when storage changes
		updateStats();
		window.addEventListener('storage', updateStats);

		return () => {
			window.removeEventListener(
				'storage',
				updateStats
			);
		};
	}, []);

	const handleGoBack = async () => {
		const isAuthenticated =
			authService.isAuthenticated();

		if (isAuthenticated) {
			// Show logout message for authenticated users
			showInfo(
				'Logged Out',
				'You have been logged out. Please log in again to access the chat.'
			);

			// Logout user
			await authService.logout();
		}

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

	// Get user authentication status
	const isAuthenticated = authService.isAuthenticated();

	return (
		<ToastContainer>
			{/* Dynamic Chat Title */}
			<ChatTitle />

			<ChatLayout
				onGoBack={handleGoBack}
				getCategoryColor={getCategoryColor}
				// Pass guest-related props to layout
				isGuestMode={!isAuthenticated}
				guestUsageStats={guestUsageStats}
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
				<ChatInput
					// Pass guest usage callbacks
					onBeforeSend={checkGuestUsageLimit}
					onAfterSend={incrementGuestUsage}
					isGuestMode={!isAuthenticated}
				/>
			</ChatLayout>

			{/* All Modals */}
			<ModalContainer />

			{/* Guest Limit Modal */}
			<GuestLimitModal
				isOpen={guestLimitModalOpen}
				onClose={() =>
					setGuestLimitModalOpen(false)
				}
				usedCount={guestUsageStats.used}
				maxCount={guestUsageStats.total}
				resetsAt={guestUsageStats.resetsAt}
			/>

			{/* PWA Prompt and Network Status */}
			<PWAPrompt />
		</ToastContainer>
	);
};

export default ChatBotApp;
