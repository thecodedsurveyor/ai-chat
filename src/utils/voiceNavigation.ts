import type {
	VoiceNavigationSettings,
	VoiceNavigationCommand,
} from '../types';
import { showErrorToast, showInfoToast } from './toast';

// Voice Navigation Manager Class
export class VoiceNavigationManager {
	private static instance: VoiceNavigationManager;
	private recognition: SpeechRecognition | null = null;
	private isListening = false;
	private settings: VoiceNavigationSettings;
	private listeners: ((
		command: string,
		action: string
	) => void)[] = [];
	private wakeWordDetected = false;
	private lastActivity = Date.now();
	private hasError = false;
	private restartAttempts = 0;
	private maxRestartAttempts = 3;

	private constructor(settings: VoiceNavigationSettings) {
		this.settings = settings;
		this.initializeSpeechRecognition();
	}

	static getInstance(
		settings: VoiceNavigationSettings
	): VoiceNavigationManager {
		if (!VoiceNavigationManager.instance) {
			VoiceNavigationManager.instance =
				new VoiceNavigationManager(settings);
		} else {
			VoiceNavigationManager.instance.updateSettings(
				settings
			);
		}
		return VoiceNavigationManager.instance;
	}

	// Initialize Speech Recognition
	private initializeSpeechRecognition(): void {
		if (
			!('webkitSpeechRecognition' in window) &&
			!('SpeechRecognition' in window)
		) {
			showErrorToast(
				'Voice Recognition Unavailable',
				'Speech recognition is not supported in this browser'
			);
			return;
		}

		const SpeechRecognition =
			window.SpeechRecognition ||
			window.webkitSpeechRecognition;
		this.recognition = new SpeechRecognition();

		if (this.recognition) {
			this.recognition.continuous = true;
			this.recognition.interimResults = true;
			this.recognition.lang = this.settings.language;

			this.recognition.onstart = () => {
				this.isListening = true;
				this.hasError = false;
				// Only show toast on first start or after successful restart
				if (this.restartAttempts === 0) {
					showInfoToast(
						'Voice Recognition',
						'Voice recognition started'
					);
				}
			};

			this.recognition.onend = () => {
				this.isListening = false;

				// If there was an error, don't restart automatically
				if (this.hasError) {
					this.restartAttempts++;
					if (
						this.restartAttempts >=
						this.maxRestartAttempts
					) {
						showErrorToast(
							'Voice Recognition',
							'Voice recognition failed after multiple attempts. Please check your microphone permissions.'
						);
						this.settings.enabled = false; // Disable to prevent further attempts
						return;
					}
				}

				// Only show end toast if voice recognition is being disabled
				if (!this.settings.enabled) {
					showInfoToast(
						'Voice Recognition',
						'Voice recognition ended'
					);
					this.restartAttempts = 0; // Reset attempts when manually disabled
					return;
				}

				// Restart if still enabled and no critical errors
				if (
					this.settings.enabled &&
					!this.hasError
				) {
					setTimeout(() => this.start(), 1000);
				} else if (
					this.settings.enabled &&
					this.hasError &&
					this.restartAttempts <
						this.maxRestartAttempts
				) {
					// Try to restart after error with exponential backoff
					const delay = Math.min(
						1000 *
							Math.pow(
								2,
								this.restartAttempts
							),
						10000
					);
					setTimeout(() => {
						this.hasError = false; // Reset error flag before retry
						this.start();
					}, delay);
				}
			};

			this.recognition.onerror = (event) => {
				this.hasError = true;
				this.isListening = false;

				// Only show error toast for the first few attempts
				if (this.restartAttempts < 2) {
					const errorMessage =
						this.getErrorMessage(event.error);
					showErrorToast(
						'Voice Recognition Error',
						errorMessage
					);
				}
			};

			this.recognition.onresult = (event) => {
				this.handleSpeechResult(event);
			};
		}
	}

	// Handle speech recognition results
	private handleSpeechResult(
		event: SpeechRecognitionEvent
	): void {
		const lastResult =
			event.results[event.results.length - 1];
		if (!lastResult.isFinal) return;

		const transcript = lastResult[0].transcript
			.toLowerCase()
			.trim();
		// Voice input processed silently for better UX

		// Check for wake word OR direct commands
		if (!this.wakeWordDetected) {
			// Check for wake word
			if (
				transcript.includes(
					this.settings.wakeWord.toLowerCase()
				)
			) {
				this.wakeWordDetected = true;
				this.speak('Yes? What can I do for you?');
				setTimeout(() => {
					this.wakeWordDetected = false;
				}, 10000); // Reset wake word after 10 seconds
				return;
			}

			// Also check for direct commands without wake word
			const hasDirectCommand =
				this.settings.commands.some(
					(cmd) =>
						cmd.enabled &&
						transcript.includes(
							cmd.phrase.toLowerCase()
						)
				);

			if (hasDirectCommand) {
				this.processVoiceCommand(transcript);
				return;
			}

			return;
		}

		// Process commands after wake word
		this.processVoiceCommand(transcript);
		this.wakeWordDetected = false;
	}

	// Process voice commands
	private processVoiceCommand(transcript: string): void {
		const enabledCommands =
			this.settings.commands.filter(
				(cmd) => cmd.enabled
			);

		for (const command of enabledCommands) {
			if (
				transcript.includes(
					command.phrase.toLowerCase()
				)
			) {
				// Voice command detected - execute silently for better UX

				if (
					this.settings.confirmActions &&
					this.isDestructiveAction(command.action)
				) {
					this.speak(
						`Are you sure you want to ${command.phrase}? Say yes to confirm.`
					);
					this.waitForConfirmation(command);
				} else {
					this.executeCommand(command);
				}
				return;
			}
		}

		// No command found
		this.speak(
			"Sorry, I didn't understand that command."
		);
	}

	// Wait for confirmation
	private waitForConfirmation(
		command: VoiceNavigationCommand
	): void {
		const confirmationTimeout = setTimeout(() => {
			this.speak('Command cancelled.');
		}, 5000);

		const originalOnResult =
			this.recognition?.onresult || null;

		if (this.recognition) {
			this.recognition.onresult = (event) => {
				const lastResult =
					event.results[event.results.length - 1];
				if (!lastResult.isFinal) return;

				const transcript = lastResult[0].transcript
					.toLowerCase()
					.trim();

				if (
					transcript.includes('yes') ||
					transcript.includes('confirm')
				) {
					clearTimeout(confirmationTimeout);
					this.executeCommand(command);
					if (this.recognition) {
						this.recognition.onresult =
							originalOnResult;
					}
				} else if (
					transcript.includes('no') ||
					transcript.includes('cancel')
				) {
					clearTimeout(confirmationTimeout);
					this.speak('Command cancelled.');
					if (this.recognition) {
						this.recognition.onresult =
							originalOnResult;
					}
				}
			};
		}
	}

	// Execute voice command
	private executeCommand(
		command: VoiceNavigationCommand
	): void {
		this.speak(`Executing ${command.phrase}`);
		this.notifyListeners(
			command.phrase,
			command.action
		);
	}

	// Check if action is destructive
	private isDestructiveAction(action: string): boolean {
		const destructiveActions = [
			'CLEAR_CHAT',
			'DELETE_CHAT',
			'RESET_SETTINGS',
		];
		return destructiveActions.includes(action);
	}

	// Get user-friendly error message
	private getErrorMessage(error: string): string {
		switch (error) {
			case 'not-allowed':
				return 'Microphone access denied. Please allow microphone permissions in your browser settings.';
			case 'no-speech':
				return 'No speech detected. Please try speaking closer to your microphone.';
			case 'audio-capture':
				return 'No microphone found. Please check your microphone connection.';
			case 'network':
				return 'Network error occurred. Please check your internet connection.';
			case 'service-not-allowed':
				return 'Speech recognition service not available.';
			case 'bad-grammar':
				return 'Speech recognition grammar error.';
			case 'language-not-supported':
				return 'Selected language not supported for speech recognition.';
			default:
				return `Speech recognition error: ${error}`;
		}
	}

	// Text-to-speech
	private speak(text: string): void {
		if ('speechSynthesis' in window) {
			const utterance = new SpeechSynthesisUtterance(
				text
			);
			utterance.rate = 0.8;
			utterance.pitch = 1;
			utterance.volume = 0.7;
			speechSynthesis.speak(utterance);
		}
	}

	// Public API
	start(): void {
		if (!this.settings.enabled || !this.recognition)
			return;

		if (!this.isListening) {
			try {
				this.recognition.start();
			} catch {
				this.hasError = true;
				showErrorToast(
					'Voice Recognition Error',
					'Failed to start voice recognition. Please check your microphone permissions.'
				);
			}
		}
	}

	stop(): void {
		if (this.recognition && this.isListening) {
			this.recognition.stop();
		}
	}

	updateSettings(
		settings: VoiceNavigationSettings
	): void {
		const wasEnabled = this.settings.enabled;
		this.settings = settings;

		if (this.recognition) {
			this.recognition.lang = settings.language;
		}

		if (settings.enabled && !wasEnabled) {
			// Reset error state when manually enabling
			this.hasError = false;
			this.restartAttempts = 0;
			this.start();
		} else if (!settings.enabled && wasEnabled) {
			this.stop();
		}
	}

	// Subscribe to voice commands
	subscribe(
		listener: (command: string, action: string) => void
	): () => void {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter(
				(l) => l !== listener
			);
		};
	}

	private notifyListeners(
		command: string,
		action: string
	): void {
		this.listeners.forEach((listener) =>
			listener(command, action)
		);
	}

	// Check if voice recognition is supported
	static isSupported(): boolean {
		return (
			'webkitSpeechRecognition' in window ||
			'SpeechRecognition' in window
		);
	}

	// Get available languages
	static getAvailableLanguages(): string[] {
		return [
			'en-US',
			'en-GB',
			'en-AU',
			'en-CA',
			'es-ES',
			'es-MX',
			'fr-FR',
			'fr-CA',
			'de-DE',
			'it-IT',
			'pt-BR',
			'pt-PT',
			'ru-RU',
			'ja-JP',
			'ko-KR',
			'zh-CN',
			'zh-TW',
			'ar-SA',
			'hi-IN',
			'nl-NL',
		];
	}

	// Activity tracking
	updateActivity(): void {
		this.lastActivity = Date.now();
	}

	getLastActivity(): number {
		return this.lastActivity;
	}

	isActive(): boolean {
		return this.isListening;
	}
}

// Voice command actions
export const VOICE_ACTIONS = {
	CREATE_CHAT: 'CREATE_CHAT',
	OPEN_SETTINGS: 'OPEN_SETTINGS',
	TOGGLE_FOCUS_MODE: 'TOGGLE_FOCUS_MODE',
	OPEN_SEARCH: 'OPEN_SEARCH',
	OPEN_ANALYTICS: 'OPEN_ANALYTICS',
	TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
	CLEAR_CHAT: 'CLEAR_CHAT',
	GO_HOME: 'GO_HOME',
} as const;

// Extend Window interface for speech recognition
declare global {
	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}
}
