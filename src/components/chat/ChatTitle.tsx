import React, { useEffect, useState } from 'react';
import {
	usePageTitle,
	getMotivationalTitle,
	getGreetingTitle,
} from '../../hooks/usePageTitle';
import {
	useChatStore,
	useMessages,
} from '../../stores/chatStore';

const ChatTitle: React.FC = () => {
	const activeChat = useChatStore((state) =>
		state.chats.find(
			(chat) => chat.id === state.activeChat
		)
	);
	const messages = useMessages();
	const [dynamicTitle, setDynamicTitle] =
		useState<string>('');

	// Generate dynamic title based on chat state
	useEffect(() => {
		let title = '';

		if (!activeChat) {
			// No active chat - show greeting
			title = getGreetingTitle();
		} else if (messages.length === 0) {
			// Empty chat - show motivational title
			title = getMotivationalTitle();
		} else if (messages.length === 1) {
			// First message - show encouraging title
			const encouragingTitles = [
				'Great Start! 🚀',
				"Let's Explore Together",
				'Your Journey Begins',
				'Ready to Dive Deep?',
				'Conversation Started',
			];
			title =
				encouragingTitles[
					Math.floor(
						Math.random() *
							encouragingTitles.length
					)
				];
		} else if (messages.length < 5) {
			// Early conversation - show progress titles
			const progressTitles = [
				'Building Momentum',
				'Getting Warmed Up',
				'Finding Our Rhythm',
				'Making Progress',
				'Conversation Flowing',
			];
			title =
				progressTitles[
					Math.floor(
						Math.random() *
							progressTitles.length
					)
				];
		} else if (messages.length < 10) {
			// Active conversation - show engagement titles
			const engagementTitles = [
				'Deep in Conversation',
				'Ideas Flowing',
				'Productive Discussion',
				'Exploring Together',
				'Making Connections',
			];
			title =
				engagementTitles[
					Math.floor(
						Math.random() *
							engagementTitles.length
					)
				];
		} else {
			// Long conversation - show achievement titles
			const achievementTitles = [
				'Epic Conversation! 🎉',
				'Marathon Discussion',
				'Deep Dive Session',
				'Thorough Exploration',
				'Comprehensive Chat',
			];
			title =
				achievementTitles[
					Math.floor(
						Math.random() *
							achievementTitles.length
					)
				];
		}

		// Add context based on chat category
		if (activeChat?.category) {
			const categoryEmojis: Record<string, string> = {
				work: '💼',
				personal: '🏠',
				research: '🔬',
				creative: '🎨',
				learning: '📚',
				general: '💬',
			};
			const emoji =
				categoryEmojis[activeChat.category] || '💬';
			title = `${emoji} ${title}`;
		}

		// Add time-based context for long sessions
		if (messages.length > 15) {
			const hour = new Date().getHours();
			if (hour < 12) {
				title += ' - Morning Session';
			} else if (hour < 17) {
				title += ' - Afternoon Focus';
			} else {
				title += ' - Evening Deep Dive';
			}
		}

		setDynamicTitle(title);
	}, [activeChat, messages.length]);

	// Apply the dynamic title
	usePageTitle(dynamicTitle);

	// This component doesn't render anything visible
	return null;
};

export default ChatTitle;
