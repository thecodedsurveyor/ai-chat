// API base URL for backend
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ||
	'http://localhost:3001/api';

// Chat model settings
export const CHAT_MODELS = {
	GPT4: 'gpt-4',
	GPT35: 'gpt-3.5-turbo',
	CLAUDE: 'claude-3',
	DEFAULT: 'gpt-3.5-turbo',
};

// Application settings
export const APP_SETTINGS = {
	MAX_MESSAGE_LENGTH: 4000,
	DEFAULT_SYSTEM_PROMPT:
		'You are a helpful AI assistant.',
	MAX_CHAT_HISTORY: 100,
	AUDIO_RECORDING_MAX_DURATION: 60, // in seconds
};

// Local storage keys
export const STORAGE_KEYS = {
	AUTH_TOKEN: 'authToken',
	USER: 'user',
	CHAT_HISTORY: 'chatHistory',
	THEME: 'theme',
	PREFERENCES: 'preferences',
};

// Routes
export const ROUTES = {
	HOME: '/',
	AUTH: '/auth',
	CHAT: '/chat',
	SETTINGS: '/settings',
	SSO_CALLBACK: '/sso-callback',
	FORGOT_PASSWORD: '/forgot-password',
	RESET_PASSWORD: '/reset-password',
};
