// ElevenLabs TTS Service with Browser API Fallback
export interface ElevenLabsVoice {
	voice_id: string;
	name: string;
	category: string;
	description?: string;
	preview_url?: string;
	available_for_tiers?: string[];
}

export interface TTSOptions {
	text: string;
	voiceId?: string;
	stability?: number;
	similarityBoost?: number;
	style?: number;
	useSpeakerBoost?: boolean;
}

export interface TTSResponse {
	success: boolean;
	audioBlob?: Blob;
	error?: string;
	usedElevenLabs?: boolean;
}

class ElevenLabsService {
	private apiKey: string | null = null;
	private baseUrl = 'https://api.elevenlabs.io/v1';
	private defaultVoiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice
	private quotaExceeded = false;

	constructor() {
		// Get API key from environment variables
		this.apiKey =
			import.meta.env.VITE_ELEVENLABS_API_KEY || null;
	}

	// Check if ElevenLabs is available
	isAvailable(): boolean {
		return !!this.apiKey && !this.quotaExceeded;
	}

	// Get available voices from ElevenLabs
	async getVoices(): Promise<ElevenLabsVoice[]> {
		if (!this.isAvailable()) return [];

		try {
			const response = await fetch(
				`${this.baseUrl}/voices`,
				{
					headers: {
						'xi-api-key': this.apiKey!,
					},
				}
			);

			if (!response.ok) {
				if (response.status === 401) {
					console.warn(
						'ElevenLabs: Invalid API key'
					);
					return [];
				}
				if (response.status === 429) {
					console.warn(
						'ElevenLabs: Quota exceeded, falling back to browser TTS'
					);
					this.quotaExceeded = true;
					return [];
				}
				throw new Error(`HTTP ${response.status}`);
			}

			const data = await response.json();
			return data.voices || [];
		} catch (error) {
			console.error(
				'Failed to fetch ElevenLabs voices:',
				error
			);
			return [];
		}
	}

	// Generate speech using ElevenLabs
	async generateSpeech(
		options: TTSOptions
	): Promise<TTSResponse> {
		if (!this.isAvailable()) {
			return this.fallbackToBrowserTTS(options);
		}

		try {
			const voiceId =
				options.voiceId || this.defaultVoiceId;

			const response = await fetch(
				`${this.baseUrl}/text-to-speech/${voiceId}`,
				{
					method: 'POST',
					headers: {
						Accept: 'audio/mpeg',
						'Content-Type': 'application/json',
						'xi-api-key': this.apiKey!,
					},
					body: JSON.stringify({
						text: options.text,
						model_id: 'eleven_multilingual_v2',
						voice_settings: {
							stability:
								options.stability ?? 0.5,
							similarity_boost:
								options.similarityBoost ??
								0.5,
							style: options.style ?? 0.0,
							use_speaker_boost:
								options.useSpeakerBoost ??
								true,
						},
					}),
				}
			);

			if (!response.ok) {
				if (response.status === 401) {
					console.warn(
						'ElevenLabs: Invalid API key, falling back to browser TTS'
					);
					return this.fallbackToBrowserTTS(
						options
					);
				}
				if (response.status === 429) {
					console.warn(
						'ElevenLabs: Quota exceeded, falling back to browser TTS'
					);
					this.quotaExceeded = true;
					return this.fallbackToBrowserTTS(
						options
					);
				}
				throw new Error(`HTTP ${response.status}`);
			}

			const audioBlob = await response.blob();
			return {
				success: true,
				audioBlob,
				usedElevenLabs: true,
			};
		} catch (error) {
			console.error('ElevenLabs TTS failed:', error);
			return this.fallbackToBrowserTTS(options);
		}
	}

	// Fallback to browser TTS
	private fallbackToBrowserTTS(
		options: TTSOptions
	): Promise<TTSResponse> {
		return new Promise((resolve) => {
			if (!('speechSynthesis' in window)) {
				resolve({
					success: false,
					error: 'Speech synthesis not supported',
					usedElevenLabs: false,
				});
				return;
			}

			try {
				// Cancel any ongoing speech
				window.speechSynthesis.cancel();

				const utterance =
					new SpeechSynthesisUtterance(
						options.text
					);

				// Try to find a voice that matches the ElevenLabs voice selection
				const voices =
					window.speechSynthesis.getVoices();
				if (voices.length > 0) {
					// Default to first available voice or find a good English voice
					const preferredVoice =
						voices.find(
							(voice) =>
								voice.lang.startsWith(
									'en'
								) &&
								voice.name.includes(
									'Female'
								)
						) ||
						voices.find((voice) =>
							voice.lang.startsWith('en')
						) ||
						voices[0];

					utterance.voice = preferredVoice;
				}

				utterance.rate = 1.0;
				utterance.pitch = 1.0;
				utterance.volume = 1.0;

				utterance.onend = () => {
					resolve({
						success: true,
						usedElevenLabs: false,
					});
				};

				utterance.onerror = (event) => {
					resolve({
						success: false,
						error: `Speech synthesis error: ${event.error}`,
						usedElevenLabs: false,
					});
				};

				window.speechSynthesis.speak(utterance);
			} catch (error) {
				resolve({
					success: false,
					error: `Browser TTS error: ${error}`,
					usedElevenLabs: false,
				});
			}
		});
	}

	// Reset quota exceeded flag (for retry)
	resetQuotaFlag(): void {
		this.quotaExceeded = false;
	}

	// Get character usage info
	async getUsageInfo(): Promise<{
		character_count: number;
		character_limit: number;
	} | null> {
		if (!this.isAvailable()) return null;

		try {
			const response = await fetch(
				`${this.baseUrl}/user/subscription`,
				{
					headers: {
						'xi-api-key': this.apiKey!,
					},
				}
			);

			if (!response.ok) return null;

			const data = await response.json();
			return {
				character_count: data.character_count || 0,
				character_limit:
					data.character_limit || 10000,
			};
		} catch (error) {
			console.error(
				'Failed to fetch ElevenLabs usage:',
				error
			);
			return null;
		}
	}
}

export const elevenLabsService = new ElevenLabsService();
