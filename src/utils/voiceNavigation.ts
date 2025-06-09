// Voice Navigation Manager for AI Chatbot
// Provides voice command functionality for navigation and actions

export enum VOICE_ACTIONS {
	CREATE_CHAT = 'CREATE_CHAT',
	OPEN_SETTINGS = 'OPEN_SETTINGS',
	OPEN_SEARCH = 'OPEN_SEARCH',
	OPEN_ANALYTICS = 'OPEN_ANALYTICS',
	TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
	CLEAR_CHAT = 'CLEAR_CHAT',
	GO_HOME = 'GO_HOME',
}

interface VoiceNavigationSettings {
	enabled: boolean;
	language?: string;
	sensitivity?: number;
	commands?: Record<string, VOICE_ACTIONS>;
}

type VoiceCommandCallback = (
	command: string,
	action: VOICE_ACTIONS
) => void;

export class VoiceNavigationManager {
	private static instance: VoiceNavigationManager | null =
		null;
	private recognition: SpeechRecognition | null = null;
	private callbacks: Set<VoiceCommandCallback> =
		new Set();
	private settings: VoiceNavigationSettings;
	private isActive = false;

	// Default voice commands mapping
	private defaultCommands: Record<string, VOICE_ACTIONS> =
		{
			'new chat': VOICE_ACTIONS.CREATE_CHAT,
			'create chat': VOICE_ACTIONS.CREATE_CHAT,
			'start new': VOICE_ACTIONS.CREATE_CHAT,
			'open settings': VOICE_ACTIONS.OPEN_SETTINGS,
			settings: VOICE_ACTIONS.OPEN_SETTINGS,
			preferences: VOICE_ACTIONS.OPEN_SETTINGS,
			search: VOICE_ACTIONS.OPEN_SEARCH,
			find: VOICE_ACTIONS.OPEN_SEARCH,
			analytics: VOICE_ACTIONS.OPEN_ANALYTICS,
			stats: VOICE_ACTIONS.OPEN_ANALYTICS,
			'toggle sidebar': VOICE_ACTIONS.TOGGLE_SIDEBAR,
			'show sidebar': VOICE_ACTIONS.TOGGLE_SIDEBAR,
			'hide sidebar': VOICE_ACTIONS.TOGGLE_SIDEBAR,
			'clear chat': VOICE_ACTIONS.CLEAR_CHAT,
			'clear messages': VOICE_ACTIONS.CLEAR_CHAT,
			'reset chat': VOICE_ACTIONS.CLEAR_CHAT,
			'go home': VOICE_ACTIONS.GO_HOME,
			home: VOICE_ACTIONS.GO_HOME,
			'main page': VOICE_ACTIONS.GO_HOME,
		};

	private constructor(settings: VoiceNavigationSettings) {
		this.settings = {
			language: 'en-US',
			sensitivity: 0.7,
			commands: this.defaultCommands,
			...settings,
		};
		this.setupSpeechRecognition();
	}

	static getInstance(
		settings?: VoiceNavigationSettings
	): VoiceNavigationManager {
		if (!VoiceNavigationManager.instance) {
			VoiceNavigationManager.instance =
				new VoiceNavigationManager(
					settings || { enabled: true }
				);
		}
		return VoiceNavigationManager.instance;
	}

	static isSupported(): boolean {
		return (
			'webkitSpeechRecognition' in window ||
			'SpeechRecognition' in window
		);
	}

	private setupSpeechRecognition(): void {
		if (!VoiceNavigationManager.isSupported()) {
			console.warn(
				'Speech recognition is not supported in this browser'
			);
			return;
		}

		const SpeechRecognition =
			window.SpeechRecognition ||
			window.webkitSpeechRecognition;

		this.recognition = new SpeechRecognition();
		this.recognition.continuous = true;
		this.recognition.interimResults = false;
		this.recognition.lang =
			this.settings.language || 'en-US';

		this.recognition.onresult = (
			event: SpeechRecognitionEvent
		) => {
			const lastResult =
				event.results[event.results.length - 1];
			if (lastResult.isFinal) {
				const transcript = lastResult[0].transcript
					.trim()
					.toLowerCase();
				this.processCommand(transcript);
			}
		};

		this.recognition.onerror = (
			event: SpeechRecognitionErrorEvent
		) => {
			console.error(
				'Speech recognition error:',
				event.error
			);
			if (event.error === 'not-allowed') {
				console.warn(
					'Microphone permission denied'
				);
			}
		};

		this.recognition.onend = () => {
			if (this.isActive && this.settings.enabled) {
				// Restart recognition if it's supposed to be active
				setTimeout(() => {
					if (this.isActive) {
						this.recognition?.start();
					}
				}, 100);
			}
		};
	}

	private processCommand(transcript: string): void {
		const commands =
			this.settings.commands || this.defaultCommands;

		// Find matching command (exact match or partial match)
		for (const [command, action] of Object.entries(
			commands
		)) {
			if (
				transcript === command ||
				transcript.includes(command) ||
				command.includes(transcript)
			) {
				// Execute callbacks
				this.callbacks.forEach((callback) => {
					try {
						callback(command, action);
					} catch (error) {
						console.error(
							'Error executing voice command callback:',
							error
						);
					}
				});
				break;
			}
		}
	}

	subscribe(callback: VoiceCommandCallback): () => void {
		this.callbacks.add(callback);
		return () => {
			this.callbacks.delete(callback);
		};
	}

	start(): void {
		if (!this.settings.enabled || !this.recognition) {
			return;
		}

		if (this.isActive) {
			return; // Already started
		}

		try {
			this.isActive = true;
			this.recognition.start();
			console.log('Voice navigation started');
		} catch (error) {
			console.error(
				'Failed to start voice recognition:',
				error
			);
			this.isActive = false;
		}
	}

	stop(): void {
		if (!this.isActive || !this.recognition) {
			return;
		}

		try {
			this.isActive = false;
			this.recognition.stop();
			console.log('Voice navigation stopped');
		} catch (error) {
			console.error(
				'Failed to stop voice recognition:',
				error
			);
		}
	}

	updateSettings(
		newSettings: Partial<VoiceNavigationSettings>
	): void {
		this.settings = {
			...this.settings,
			...newSettings,
		};

		if (this.recognition && newSettings.language) {
			this.recognition.lang = newSettings.language;
		}

		// Restart if currently active and settings changed
		if (this.isActive) {
			this.stop();
			if (this.settings.enabled) {
				this.start();
			}
		}
	}

	isRunning(): boolean {
		return this.isActive;
	}

	getAvailableCommands(): string[] {
		return Object.keys(
			this.settings.commands || this.defaultCommands
		);
	}
}

// Global declarations for Speech Recognition API
declare global {
	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}
}

export default VoiceNavigationManager;
