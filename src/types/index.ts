// Basic types for the chat app
export type MessageStatus =
	| 'sending'
	| 'sent'
	| 'delivered'
	| 'error';

// Memory types for Smart Memory System
export type MemoryContext = {
	id: string;
	chatId: string;
	type:
		| 'user_preference'
		| 'topic_summary'
		| 'conversation_context'
		| 'important_fact';
	content: string;
	keywords: string[];
	relevanceScore: number;
	lastUpdated: string;
	expiresAt?: string; // Optional expiration for temporary context
};

export type ConversationSummary = {
	id: string;
	chatId: string;
	summary: string;
	keyTopics: string[];
	importantPoints: string[];
	decisions: string[];
	followUps: string[];
	createdAt: string;
	messageRange: {
		startId: string;
		endId: string;
		count: number;
	};
};

export type SmartMemoryState = {
	userProfile: {
		preferences: Record<
			string,
			string | number | boolean | string[]
		>;
		expertise: string[];
		interests: string[];
		communicationStyle: string;
		frequentTopics: string[];
	};
	contextMemory: MemoryContext[];
	summaries: ConversationSummary[];
	totalMemoryEntries: number;
	lastUpdated: string;
};

export type Message = {
	id: string;
	type: 'prompt' | 'response';
	text: string;
	timestamp: string;
	status?: MessageStatus;
	isFavorite?: boolean;
	isEdited?: boolean;
	originalText?: string;
	responseTime?: number; // AI response time in milliseconds
	wordCount?: number; // Number of words in message
	// Fields for enhanced features
	memoryReferences?: string[]; // Memory context IDs referenced in this message
	contextUsed?: MemoryContext[]; // Memory contexts that influenced the AI response
};

export type ChatCategory =
	| 'work'
	| 'personal'
	| 'research'
	| 'general';

export type Chat = {
	id: string;
	displayId: string;
	messages: Message[];
	createdAt: string;
	lastActivity?: string;
	category?: ChatCategory;
	tags?: string[];
	isPinned?: boolean;
	totalMessages?: number;
	averageResponseTime?: number;
	persona?: AIPersona;
	isOfflineReady?: boolean; // For PWA offline support
};

// Simple emoji type - just what we need
export type EmojiData = {
	native: string;
};

// Voice & Audio Types
export type VoiceLanguage = {
	code: string;
	name: string;
	flag: string;
};

export type VoiceSettings = {
	rate: number; // 0.1 to 10
	pitch: number; // 0 to 2
	volume: number; // 0 to 1
	voice?: SpeechSynthesisVoice;
	language: string;
	autoPlay: boolean;
	noiseSuppressionEnabled: boolean;
};

export type VoiceCommand = {
	pattern: string | RegExp;
	action: string;
	description: string;
	category: 'navigation' | 'chat' | 'search' | 'control';
};

export type AudioRecording = {
	id: string;
	blob: Blob;
	duration: number;
	timestamp: string;
	transcription?: string;
	waveformData?: number[];
};

export type VoiceRecognitionState = {
	isListening: boolean;
	isProcessing: boolean;
	transcript: string;
	confidence: number;
	error?: string;
	language: string;
	continuous: boolean;
	interimResults: boolean;
};

export type VoiceSynthesisState = {
	isSpeaking: boolean;
	isLoading: boolean;
	currentText?: string;
	queue: string[];
	error?: string;
};

export type AudioVisualizerProps = {
	audioData?: number[];
	isActive: boolean;
	color?: string;
	height?: number;
	className?: string;
};

export type VoiceControlsProps = {
	onStartRecording: () => void;
	onStopRecording: () => void;
	onPlayback: (text: string) => void;
	onStopPlayback: () => void;
	isRecording: boolean;
	isSpeaking: boolean;
	isListening: boolean;
	transcript: string;
	voiceSettings: VoiceSettings;
	onVoiceSettingsChange: (
		settings: Partial<VoiceSettings>
	) => void;
};

// Props types
export type ChatBotAppProps = {
	onGoBack?: () => void;
};

// Quick response templates
export type QuickResponse = {
	id: string;
	title: string;
	prompt: string;
	category: string;
};

// Message action types
export type MessageAction =
	| 'copy'
	| 'edit'
	| 'delete'
	| 'favorite'
	| 'unfavorite';

export type SearchFilters = {
	query?: string;
	category?: ChatCategory;
	tags?: string[];
	dateRange?: {
		start: string;
		end: string;
	};
	favoritesOnly?: boolean;
	messageType?: 'prompt' | 'response' | 'all';
};

export type SearchResult = {
	type: 'chat' | 'message';
	chat: Chat;
	message?: Message;
	matchedText?: string;
	relevanceScore?: number;
};

export type SearchState = {
	query: string;
	filters: SearchFilters;
	results: SearchResult[];
	isSearching: boolean;
	totalResults: number;
};

// Analytics Types
export type UsageStatistics = {
	totalChats: number;
	totalMessages: number;
	totalUserMessages: number;
	totalAIMessages: number;
	averageMessagesPerChat: number;
	averageWordsPerMessage: number;
	totalWords: number;
	chatsCreatedToday: number;
	chatsCreatedThisWeek: number;
	chatsCreatedThisMonth: number;
	messagessentToday: number;
	messagesSentThisWeek: number;
	messagesSentThisMonth: number;
};

export type CategoryStatistics = {
	category: ChatCategory;
	count: number;
	percentage: number;
	averageMessages: number;
	totalWords: number;
};

export type TagStatistics = {
	tag: string;
	count: number;
	percentage: number;
	chats: string[]; // Chat IDs that use this tag
};

export type ConversationTrend = {
	date: string;
	chatsCreated: number;
	messagesSent: number;
	averageLength: number;
	categories: Record<ChatCategory, number>;
};

export type ResponseTimeMetrics = {
	averageResponseTime: number;
	fastestResponse: number;
	slowestResponse: number;
	responseTimesByHour: Record<string, number>;
	responseTimesByDay: Record<string, number>;
	responseTimeTrend: { date: string; time: number }[];
};

export type TopicAnalysis = {
	topicKeyword: string;
	frequency: number;
	relatedChats: string[];
	sentiment?: 'positive' | 'neutral' | 'negative';
	averageConversationLength: number;
};

export type FavoriteTopics = {
	favoriteMessages: number;
	topFavoriteKeywords: string[];
	favoritesOverTime: { date: string; count: number }[];
	favoritesByCategory: Record<ChatCategory, number>;
};

export type AnalyticsData = {
	usageStatistics: UsageStatistics;
	categoryStatistics: CategoryStatistics[];
	tagStatistics: TagStatistics[];
	conversationTrends: ConversationTrend[];
	responseTimeMetrics: ResponseTimeMetrics;
	topicAnalysis: TopicAnalysis[];
	favoriteTopics: FavoriteTopics;
	lastUpdated: string;
};

export type AnalyticsTimeRange =
	| 'today'
	| 'week'
	| 'month'
	| 'all';

export type ChartDataPoint = {
	label: string;
	value: number;
	color?: string;
};

export type ExportFormat =
	| 'json'
	| 'txt'
	| 'csv'
	| 'markdown';

export interface ExportOptions {
	format: ExportFormat;
	includeTimestamps: boolean;
	includeMetadata: boolean;
	chatIds?: string[]; // If specified, only export these chats
	dateRange?: {
		start: string;
		end: string;
	};
}

export interface ExportData {
	exportedAt: string;
	totalChats: number;
	totalMessages: number;
	chats: Chat[];
	metadata?: {
		exportOptions: ExportOptions;
		version: string;
	};
}

export interface ExportManagerProps {
	chats: Chat[];
	isVisible: boolean;
	onClose: () => void;
}

export interface ConversationTemplate {
	id: string;
	name: string;
	description: string;
	category:
		| 'work'
		| 'personal'
		| 'creative'
		| 'learning'
		| 'general';
	prompt: string;
	tags: string[];
	isCustom: boolean;
	createdAt: string;
	usageCount: number;
}

export type TemplateManagerProps = {
	isVisible: boolean;
	onClose: () => void;
	onSelectTemplate: (
		template: ConversationTemplate
	) => void;
};

// AI Personas
export type AIPersona = {
	id: string;
	name: string;
	description: string;
	systemPrompt: string;
	icon: string;
	color: string;
	category:
		| 'assistant'
		| 'creative'
		| 'educational'
		| 'professional'
		| 'fun';
	isDefault?: boolean;
	isCustom?: boolean;
};

// Settings & Customization Types
export type ThemeMode = 'light' | 'dark' | 'auto';

export type ColorScheme = {
	id: string;
	name: string;
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	surface: string;
	text: string;
	textSecondary: string;
	border: string;
	success: string;
	warning: string;
	error: string;
	info: string;
};

export type FontFamily =
	| 'inter'
	| 'roboto'
	| 'poppins'
	| 'opensans'
	| 'system';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LayoutMode =
	| 'compact'
	| 'comfortable'
	| 'spacious';

export type AccessibilitySettings = {
	highContrast: boolean;
	reducedMotion: boolean;
	screenReaderSupport: boolean;
	keyboardNavigation: boolean;
	focusIndicators: boolean;
	largeClickTargets: boolean;
};

export type VoiceNavigationSettings = {
	enabled: boolean;
	language: string;
	sensitivity: number; // 0-1
	commands: VoiceNavigationCommand[];
	wakeWord: string;
	confirmActions: boolean;
};

export type VoiceNavigationCommand = {
	id: string;
	phrase: string;
	action: string;
	description: string;
	enabled: boolean;
};

export type AppSettings = {
	theme: {
		mode: ThemeMode;
		colorScheme: string;
		customSchemes: ColorScheme[];
	};
	typography: {
		fontFamily: FontFamily;
		fontSize: FontSize;
		lineHeight: number;
	};
	layout: {
		mode: LayoutMode;
		sidebarWidth: number;
		messageSpacing: number;
		borderRadius: number;
	};
	accessibility: AccessibilitySettings;
	voiceNavigation: VoiceNavigationSettings;
	voiceSynthesis: VoiceSettings;
	animations: {
		enabled: boolean;
		duration: number;
		easing: string;
	};
	privacy: {
		analytics: boolean;
		crashReporting: boolean;
		dataCollection: boolean;
	};
	autoSuggestions?: boolean;
};

export type SettingsCategory =
	| 'appearance'
	| 'accessibility'
	| 'voice'
	| 'voiceSynthesis'
	| 'privacy'
	| 'advanced';

export type SettingsPageProps = {
	isVisible: boolean;
	onClose?: () => void;
	settings: AppSettings;
	onSettingsChange: (
		settings: Partial<AppSettings>
	) => void;
};
