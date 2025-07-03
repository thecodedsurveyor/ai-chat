// Simple formatting utilities
export const getCurrentTime = () => {
	return new Date().toLocaleTimeString();
};

export const getCurrentDate = () => {
	return new Date().toLocaleDateString();
};

export const generateChatTitle = () => {
	const now = new Date();
	return `Chat with AI – ${now.toLocaleDateString(
		'en-US',
		{ month: 'long', day: 'numeric', year: 'numeric' }
	)} at ${now.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	})}`;
};

export const generateId = () => {
	return crypto.randomUUID();
};
