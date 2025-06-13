import {
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react';
import toast from 'react-hot-toast';

export interface VoiceSettings {
	rate: number;
	pitch: number;
	volume: number;
	language: string;
	voice?: SpeechSynthesisVoice;
}

export const useVoice = () => {
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [transcript, setTranscript] = useState('');
	const [isSupported, setIsSupported] = useState(false);
	const [voices, setVoices] = useState<
		SpeechSynthesisVoice[]
	>([]);
	const [voiceSettings, setVoiceSettings] =
		useState<VoiceSettings>({
			rate: 1,
			pitch: 1,
			volume: 0.8,
			language: 'en-US',
		});

	const recognitionRef = useRef<SpeechRecognition | null>(
		null
	);
	const synthRef = useRef<SpeechSynthesis | null>(null);
	const utteranceRef =
		useRef<SpeechSynthesisUtterance | null>(null);

	// Initialize speech recognition
	useEffect(() => {
		const SpeechRecognition =
			(window as unknown as Record<string, unknown>)
				.SpeechRecognition ||
			(window as unknown as Record<string, unknown>)
				.webkitSpeechRecognition;

		if (
			SpeechRecognition &&
			typeof SpeechRecognition === 'function'
		) {
			const recognition =
				new (SpeechRecognition as new () => SpeechRecognition)();
			recognitionRef.current = recognition;
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang = voiceSettings.language;

			recognition.onresult = (
				event: SpeechRecognitionEvent
			) => {
				let finalTranscript = '';
				for (
					let i = event.resultIndex;
					i < event.results.length;
					i++
				) {
					if (event.results[i].isFinal) {
						finalTranscript +=
							event.results[i][0].transcript;
					}
				}
				if (finalTranscript) {
					setTranscript(finalTranscript);
				}
			};

			recognition.onerror = (
				event: SpeechRecognitionErrorEvent
			) => {
				console.warn(
					'Speech recognition event:',
					event.error
				);
				setIsListening(false);

				// Only show toast for actual errors, not normal events
				if (event.error === 'network') {
					toast.error(
						'Network error - check internet connection'
					);
				} else if (event.error === 'not-allowed') {
					toast.error(
						'Microphone access denied. Please enable microphone permissions.'
					);
				} else if (event.error === 'no-speech') {
					// This is normal - user didn't speak, just log it
					console.log(
						'No speech detected (normal timeout)'
					);
				} else if (
					event.error === 'audio-capture'
				) {
					toast.error(
						'Audio capture failed - check microphone'
					);
				} else if (
					event.error === 'service-not-allowed'
				) {
					toast.error(
						'Speech recognition service not available'
					);
				} else {
					// Only show generic error for unexpected errors
					console.error(
						'Unexpected speech recognition error:',
						event.error
					);
				}
			};

			recognition.onend = () => {
				setIsListening(false);
			};

			setIsSupported(true);
		}

		// Initialize speech synthesis
		if ('speechSynthesis' in window) {
			synthRef.current = window.speechSynthesis;

			const loadVoices = () => {
				const availableVoices =
					synthRef.current!.getVoices();
				setVoices(availableVoices);
			};

			loadVoices();
			synthRef.current.onvoiceschanged = loadVoices;
		}

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
			if (synthRef.current) {
				synthRef.current.cancel();
			}
		};
	}, [voiceSettings.language]);

	// Start listening
	const startListening = useCallback(() => {
		if (recognitionRef.current && !isListening) {
			try {
				recognitionRef.current.lang =
					voiceSettings.language;
				recognitionRef.current.start();
				setIsListening(true);
				setTranscript('');
				toast.success(
					'🎤 Voice recognition started'
				);
			} catch (error) {
				console.error(
					'Error starting recognition:',
					error
				);
				toast.error(
					'Failed to start voice recognition'
				);
			}
		}
	}, [isListening, voiceSettings.language]);

	// Stop listening
	const stopListening = useCallback(() => {
		if (recognitionRef.current && isListening) {
			recognitionRef.current.stop();
			setIsListening(false);
			toast.success('🛑 Voice recognition stopped');
		}
	}, [isListening]);

	// Speak text
	const speak = useCallback(
		(
			text: string,
			settings?: Partial<VoiceSettings>
		) => {
			if (!synthRef.current || !text.trim()) return;

			// Stop any current speech
			synthRef.current.cancel();

			const cleanText = text
				.replace(/[*_`~]/g, '') // Remove markdown
				.replace(/https?:\/\/[^\s]+/g, 'link') // Replace URLs
				.replace(/\n+/g, '. '); // Replace newlines

			const utterance = new SpeechSynthesisUtterance(
				cleanText
			);
			const currentSettings = {
				...voiceSettings,
				...settings,
			};

			utterance.rate = currentSettings.rate;
			utterance.pitch = currentSettings.pitch;
			utterance.volume = currentSettings.volume;
			utterance.lang = currentSettings.language;

			if (currentSettings.voice) {
				utterance.voice = currentSettings.voice;
			} else {
				const voice = voices.find((v) =>
					v.lang.startsWith(
						currentSettings.language.split(
							'-'
						)[0]
					)
				);
				if (voice) utterance.voice = voice;
			}

			utterance.onstart = () => {
				setIsSpeaking(true);
			};

			utterance.onend = () => {
				setIsSpeaking(false);
				utteranceRef.current = null;
			};

			utterance.onerror = () => {
				setIsSpeaking(false);
				utteranceRef.current = null;
				toast.error('Speech synthesis error');
			};

			utteranceRef.current = utterance;
			synthRef.current.speak(utterance);

			toast.success('🔊 Starting speech playback');
		},
		[voiceSettings, voices]
	);

	// Stop speaking
	const stopSpeaking = useCallback(() => {
		if (synthRef.current) {
			synthRef.current.cancel();
			setIsSpeaking(false);
			utteranceRef.current = null;
			toast.success('🔇 Speech stopped');
		}
	}, []);

	// Process voice commands
	const processVoiceCommand = useCallback(
		(command: string) => {
			const lowerCommand = command
				.toLowerCase()
				.trim();

			// Return command actions that can be handled by the chat app
			if (
				lowerCommand.includes('new chat') ||
				lowerCommand.includes('create chat')
			) {
				return {
					action: 'CREATE_CHAT',
					data: null,
				};
			}

			if (
				lowerCommand.includes('delete chat') ||
				lowerCommand.includes('remove chat')
			) {
				return {
					action: 'DELETE_CHAT',
					data: null,
				};
			}

			if (
				lowerCommand.includes('show chat list') ||
				lowerCommand.includes('open chat list')
			) {
				return {
					action: 'SHOW_CHAT_LIST',
					data: null,
				};
			}

			if (
				lowerCommand.includes('hide chat list') ||
				lowerCommand.includes('close chat list')
			) {
				return {
					action: 'HIDE_CHAT_LIST',
					data: null,
				};
			}

			if (lowerCommand.includes('search for')) {
				const searchTerm = command
					.replace(/.*search for/i, '')
					.trim();
				return {
					action: 'SEARCH',
					data: searchTerm,
				};
			}

			if (
				lowerCommand.includes('open search') ||
				lowerCommand.includes('show search')
			) {
				return {
					action: 'OPEN_SEARCH',
					data: null,
				};
			}

			if (
				lowerCommand.includes('open templates') ||
				lowerCommand.includes('show templates')
			) {
				return {
					action: 'OPEN_TEMPLATES',
					data: null,
				};
			}

			if (
				lowerCommand.includes('open analytics') ||
				lowerCommand.includes('show analytics')
			) {
				return {
					action: 'OPEN_ANALYTICS',
					data: null,
				};
			}

			if (
				lowerCommand.includes('export chats') ||
				lowerCommand.includes('download chats')
			) {
				return {
					action: 'EXPORT_CHATS',
					data: null,
				};
			}

			if (
				lowerCommand.includes('go home') ||
				lowerCommand.includes('navigate home')
			) {
				return { action: 'GO_HOME', data: null };
			}

			return null;
		},
		[]
	);

	// Update voice settings
	const updateVoiceSettings = useCallback(
		(newSettings: Partial<VoiceSettings>) => {
			setVoiceSettings((prev) => ({
				...prev,
				...newSettings,
			}));
		},
		[]
	);

	// Get available languages
	const getAvailableLanguages = useCallback(() => {
		const languages = [
			{
				code: 'en-US',
				name: 'English (US)',
				flag: '🇺🇸',
			},
			{
				code: 'en-GB',
				name: 'English (UK)',
				flag: '🇬🇧',
			},
			{ code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
			{ code: 'fr-FR', name: 'French', flag: '🇫🇷' },
			{ code: 'de-DE', name: 'German', flag: '🇩🇪' },
			{ code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
			{
				code: 'pt-BR',
				name: 'Portuguese',
				flag: '🇧🇷',
			},
			{ code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
			{ code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
			{ code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
			{ code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
		];

		return languages;
	}, []);

	// Get compatibility info
	const getCompatibility = useCallback(() => {
		return {
			speechRecognition:
				!!(
					window as unknown as Record<
						string,
						typeof SpeechRecognition
					>
				).SpeechRecognition ||
				!!(
					window as unknown as Record<
						string,
						typeof SpeechRecognition
					>
				).webkitSpeechRecognition,
			speechSynthesis: 'speechSynthesis' in window,
			mediaDevices: 'mediaDevices' in navigator,
		};
	}, []);

	return {
		// State
		isListening,
		isSpeaking,
		transcript,
		isSupported,
		voices,
		voiceSettings,

		// Actions
		startListening,
		stopListening,
		speak,
		stopSpeaking,
		processVoiceCommand,
		updateVoiceSettings,

		// Utilities
		getAvailableLanguages,
		getCompatibility,

		// Clear transcript
		clearTranscript: () => setTranscript(''),
	};
};
