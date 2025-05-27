// Simple formatting utilities
export const getCurrentTime = () => {
	return new Date().toLocaleTimeString();
};

export const getCurrentDate = () => {
	return new Date().toLocaleDateString();
};

export const generateChatTitle = () => {
	const now = new Date();
	return `Chat ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};

export const generateId = () => {
	return crypto.randomUUID();
};
