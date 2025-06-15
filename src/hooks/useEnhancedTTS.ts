import {
	useState,
	useEffect,
	useCallback,
	useRef,
} from 'react';
import { elevenLabsService } from '../services/elevenLabsService';
import type {
	ElevenLabsVoice,
	TTSOptions,
} from '../services/elevenLabsService';

export interface VoiceOption {
	id: string;
	name: string;
	type: 'elevenlabs' | 'browser';
	browserVoice?: SpeechSynthesisVoice;
	elevenLabsVoice?: ElevenLabsVoice;
}

export interface TTSSettings {
	selectedVoiceId: string;
	rate: number;
	pitch: number;
	volume: number;
	stability: number;
	similarityBoost: number;
	style: number;
	useSpeakerBoost: boolean;
	preferElevenLabs: boolean;
}

export interface UsageInfo {
	characterCount: number;
	characterLimit: number;
	percentage: number;
}

export const useEnhancedTTS = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [voices, setVoices] = useState<VoiceOption[]>([]);
	const [usageInfo, setUsageInfo] =
		useState<UsageInfo | null>(null);
	const [lastUsedService, setLastUsedService] = useState<
		'elevenlabs' | 'browser' | null
	>(null);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const currentUtteranceRef =
		useRef<SpeechSynthesisUtterance | null>(null);

	// Default settings
	const [settings, setSettings] = useState<TTSSettings>({
		selectedVoiceId: '',
		rate: 1.0,
		pitch: 1.0,
		volume: 1.0,
		stability: 0.5,
		similarityBoost: 0.5,
		style: 0.0,
		useSpeakerBoost: true,
		preferElevenLabs: true,
	});

	// Load voices from both ElevenLabs and browser
	const loadVoices = useCallback(async () => {
		const voiceOptions: VoiceOption[] = [];

		// Load ElevenLabs voices
		try {
			const elevenLabsVoices =
				await elevenLabsService.getVoices();
			elevenLabsVoices.forEach((voice) => {
				voiceOptions.push({
					id: `elevenlabs_${voice.voice_id}`,
					name: `${voice.name} (ElevenLabs)`,
					type: 'elevenlabs',
					elevenLabsVoice: voice,
				});
			});
		} catch (error) {
			console.warn(
				'Failed to load ElevenLabs voices:',
				error
			);
		}

		// Load browser voices
		if ('speechSynthesis' in window) {
			const browserVoices =
				window.speechSynthesis.getVoices();
			browserVoices.forEach((voice) => {
				voiceOptions.push({
					id: `browser_${voice.name}_${voice.lang}`,
					name: `${voice.name} (${voice.lang}) - Browser`,
					type: 'browser',
					browserVoice: voice,
				});
			});
		}

		setVoices(voiceOptions);

		// Set default voice if none selected
		if (
			!settings.selectedVoiceId &&
			voiceOptions.length > 0
		) {
			// Prefer ElevenLabs voice if available
			const defaultVoice =
				voiceOptions.find(
					(v) => v.type === 'elevenlabs'
				) || voiceOptions[0];
			setSettings((prev) => ({
				...prev,
				selectedVoiceId: defaultVoice.id,
			}));
		}
	}, [settings.selectedVoiceId]);

	// Load usage info
	const loadUsageInfo = useCallback(async () => {
		try {
			const usage =
				await elevenLabsService.getUsageInfo();
			if (usage) {
				setUsageInfo({
					characterCount: usage.character_count,
					characterLimit: usage.character_limit,
					percentage:
						(usage.character_count /
							usage.character_limit) *
						100,
				});
			}
		} catch (error) {
			console.warn(
				'Failed to load usage info:',
				error
			);
		}
	}, []);

	// Initialize voices and usage info
	useEffect(() => {
		loadVoices();
		loadUsageInfo();

		// Listen for browser voice changes
		if ('speechSynthesis' in window) {
			const handleVoicesChanged = () => {
				loadVoices();
			};

			window.speechSynthesis.addEventListener(
				'voiceschanged',
				handleVoicesChanged
			);
			return () => {
				window.speechSynthesis.removeEventListener(
					'voiceschanged',
					handleVoicesChanged
				);
			};
		}
	}, [loadVoices, loadUsageInfo]);

	// Stop any current playback
	const stop = useCallback(() => {
		// Stop ElevenLabs audio
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}

		// Stop browser TTS
		if ('speechSynthesis' in window) {
			window.speechSynthesis.cancel();
		}

		setIsPlaying(false);
		setError(null);
	}, []);

	// Speak text using selected voice
	const speak = useCallback(
		async (text: string) => {
			if (!text.trim()) return;

			setIsLoading(true);
			setError(null);
			stop(); // Stop any current playback

			try {
				const selectedVoice = voices.find(
					(v) => v.id === settings.selectedVoiceId
				);

				if (!selectedVoice) {
					throw new Error('No voice selected');
				}

				if (
					selectedVoice.type === 'elevenlabs' &&
					settings.preferElevenLabs
				) {
					// Use ElevenLabs
					const options: TTSOptions = {
						text,
						voiceId:
							selectedVoice.elevenLabsVoice
								?.voice_id,
						stability: settings.stability,
						similarityBoost:
							settings.similarityBoost,
						style: settings.style,
						useSpeakerBoost:
							settings.useSpeakerBoost,
					};

					const result =
						await elevenLabsService.generateSpeech(
							options
						);

					if (
						result.success &&
						result.audioBlob
					) {
						// Play ElevenLabs audio
						const audioUrl =
							URL.createObjectURL(
								result.audioBlob
							);
						const audio = new Audio(audioUrl);
						audioRef.current = audio;

						audio.volume = settings.volume;

						audio.onplay = () =>
							setIsPlaying(true);
						audio.onended = () => {
							setIsPlaying(false);
							URL.revokeObjectURL(audioUrl);
						};
						audio.onerror = () => {
							setError(
								'Failed to play audio'
							);
							setIsPlaying(false);
							URL.revokeObjectURL(audioUrl);
						};

						await audio.play();
						setLastUsedService(
							result.usedElevenLabs
								? 'elevenlabs'
								: 'browser'
						);

						// Refresh usage info after successful ElevenLabs usage
						if (result.usedElevenLabs) {
							setTimeout(loadUsageInfo, 1000);
						}
					} else {
						throw new Error(
							result.error ||
								'Failed to generate speech'
						);
					}
				} else {
					// Use browser TTS
					if (!('speechSynthesis' in window)) {
						throw new Error(
							'Speech synthesis not supported'
						);
					}

					const utterance =
						new SpeechSynthesisUtterance(text);
					currentUtteranceRef.current = utterance;

					if (
						selectedVoice.type === 'browser' &&
						selectedVoice.browserVoice
					) {
						utterance.voice =
							selectedVoice.browserVoice;
					}

					utterance.rate = settings.rate;
					utterance.pitch = settings.pitch;
					utterance.volume = settings.volume;

					utterance.onstart = () =>
						setIsPlaying(true);
					utterance.onend = () =>
						setIsPlaying(false);
					utterance.onerror = (event) => {
						setError(
							`Speech synthesis error: ${event.error}`
						);
						setIsPlaying(false);
					};

					window.speechSynthesis.speak(utterance);
					setLastUsedService('browser');
				}
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: 'Unknown error'
				);
				setIsPlaying(false);
			} finally {
				setIsLoading(false);
			}
		},
		[voices, settings, stop, loadUsageInfo]
	);

	// Update settings
	const updateSettings = useCallback(
		(newSettings: Partial<TTSSettings>) => {
			setSettings((prev) => ({
				...prev,
				...newSettings,
			}));
		},
		[]
	);

	// Reset ElevenLabs quota flag
	const resetQuota = useCallback(() => {
		elevenLabsService.resetQuotaFlag();
		loadVoices();
		loadUsageInfo();
	}, [loadVoices, loadUsageInfo]);

	// Check if ElevenLabs is available
	const isElevenLabsAvailable =
		elevenLabsService.isAvailable();

	return {
		// State
		isLoading,
		isPlaying,
		error,
		voices,
		settings,
		usageInfo,
		lastUsedService,
		isElevenLabsAvailable,

		// Actions
		speak,
		stop,
		updateSettings,
		loadVoices,
		loadUsageInfo,
		resetQuota,
	};
};
