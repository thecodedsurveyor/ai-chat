import React from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';

const ChatTitle: React.FC = () => {
	// Apply simple chat title
	usePageTitle('Chat');

	// This component doesn't render anything visible
	return null;
};

export default ChatTitle;
