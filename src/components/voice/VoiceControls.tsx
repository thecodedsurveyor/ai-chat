import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/classNames';
import type { VoiceSettings } from '../../types';
// React Icons imports
import {
	MdMicOff,
	MdMic,
	MdStop,
	MdVolumeUp,
} from 'react-icons/md';

interface VoiceCommand {
	action: string;
	data: unknown;
}

interface VoiceControlsProps {
	onVoiceInput: (text: string) => void;
	onVoiceCommand: (command: VoiceCommand) => void;
	lastMessage?: string;
	className?: string;
	voiceSettings?: VoiceSettings;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
	onVoiceInput,
	onVoiceCommand,
	lastMessage,
	className = '',
	voiceSettings: externalVoiceSettings,
}) => {
	const { isDark } = useTheme();
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [transcript, setTranscript] = useState('');

	const [isSupported, setIsSupported] = useState(false);
	const [voices, setVoices] = useState<
		SpeechSynthesisVoice[]
	>([]);
	const [audioLevel, setAudioLevel] = useState(0);
	const [lastProcessedCommand, setLastProcessedCommand] =
		useState<string>('');

	// Use external voice settings if provided, otherwise use default local state
	const defaultVoiceSettings: VoiceSettings = {
		rate: 1,
		pitch: 1,
		volume: 0.8,
		language: 'en-US',
		autoPlay: false,
		noiseSuppressionEnabled: true,
	};

	const voiceSettings =
		externalVoiceSettings || defaultVoiceSettings;

	const recognitionRef = useRef<SpeechRecognition | null>(
		null
	);
	const synthRef = useRef<SpeechSynthesis | null>(null);
	const audioContextRef = useRef<AudioContext | null>(
		null
	);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const animationRef = useRef<number | null>(null);

	// Stop speaking
	const stopSpeaking = useCallback(() => {
		if (synthRef.current) {
			synthRef.current.cancel();
			setIsSpeaking(false);
		}
	}, []);

	// Speak text
	const speak = useCallback(
		(text: string) => {
			if (!synthRef.current || !text.trim()) return;

			synthRef.current.cancel();

			const cleanText = text
				.replace(/[*_`~]/g, '')
				.replace(/https?:\/\/[^\s]+/g, 'link')
				.replace(/\n+/g, '. ');

			const utterance = new SpeechSynthesisUtterance(
				cleanText
			);
			utterance.rate = voiceSettings.rate;
			utterance.pitch = voiceSettings.pitch;
			utterance.volume = voiceSettings.volume;
			utterance.lang = voiceSettings.language;

			const voice = voices.find((v) =>
				v.lang.startsWith(
					voiceSettings.language.split('-')[0]
				)
			);
			if (voice) utterance.voice = voice;

			utterance.onstart = () => setIsSpeaking(true);
			utterance.onend = () => setIsSpeaking(false);
			utterance.onerror = () => setIsSpeaking(false);

			synthRef.current.speak(utterance);
		},
		[voiceSettings, voices]
	);

	// Declare stopListening as a function first to avoid circular dependencies
	const stopListeningFn = (
		recognition: SpeechRecognition | null,
		animate: number | null,
		setListeningState: React.Dispatch<
			React.SetStateAction<boolean>
		>,
		setAudioLevelState: React.Dispatch<
			React.SetStateAction<number>
		>
	): void => {
		console.log('Stopping voice recognition');
		if (recognition) {
			recognition.stop();
			setListeningState(false);
			setAudioLevelState(0);
			if (animate) {
				cancelAnimationFrame(animate);
			}
		}
	};

	// Process voice input
	const processVoiceInput = useCallback(
		(text: string) => {
			const lowerText = text.toLowerCase().trim();

			// Prevent duplicate processing of the same command
			if (lowerText === lastProcessedCommand) {
				return;
			}
			setLastProcessedCommand(lowerText);

			// Check for voice commands first
			let commandProcessed = false;

			if (
				lowerText.includes('new chat') ||
				lowerText.includes('create chat')
			) {
				onVoiceCommand({
					action: 'CREATE_CHAT',
					data: null,
				});
				commandProcessed = true;
			} else if (
				lowerText.includes('delete chat') ||
				lowerText.includes('remove chat')
			) {
				onVoiceCommand({
					action: 'DELETE_CHAT',
					data: null,
				});
				commandProcessed = true;
			} else if (
				lowerText.includes('show chat list') ||
				lowerText.includes('open chat list')
			) {
				onVoiceCommand({
					action: 'SHOW_CHAT_LIST',
					data: null,
				});
				commandProcessed = true;
			} else if (
				lowerText.includes('hide chat list') ||
				lowerText.includes('close chat list')
			) {
				onVoiceCommand({
					action: 'HIDE_CHAT_LIST',
					data: null,
				});
				commandProcessed = true;
			} else if (lowerText.includes('search for')) {
				const searchTerm = text
					.replace(/.*search for/i, '')
					.trim();
				onVoiceCommand({
					action: 'SEARCH',
					data: searchTerm,
				});
				commandProcessed = true;
			} else if (
				lowerText.includes('open search') ||
				lowerText.includes('show search')
			) {
				onVoiceCommand({
					action: 'OPEN_SEARCH',
					data: null,
				});
				commandProcessed = true;
			} else if (
				lowerText.includes('open templates') ||
				lowerText.includes('show templates')
			) {
				onVoiceCommand({
					action: 'OPEN_TEMPLATES',
					data: null,
				});
				commandProcessed = true;
			} else if (
				lowerText.includes('open analytics') ||
				lowerText.includes('show analytics')
			) {
				onVoiceCommand({
					action: 'OPEN_ANALYTICS',
					data: null,
				});
				commandProcessed = true;
			} else if (
				lowerText.includes('export chats') ||
				lowerText.includes('download chats')
			) {
				onVoiceCommand({
					action: 'EXPORT_CHATS',
					data: null,
				});
				commandProcessed = true;
			} else if (
				lowerText.includes('go home') ||
				lowerText.includes('navigate home')
			) {
				onVoiceCommand({
					action: 'GO_HOME',
					data: null,
				});
				commandProcessed = true;
			} else if (
				lowerText.includes('stop listening') ||
				lowerText.includes('stop recording')
			) {
				if (recognitionRef.current) {
					stopListeningFn(
						recognitionRef.current,
						animationRef.current,
						setIsListening,
						setAudioLevel
					);
				}
				commandProcessed = true;
			} else if (
				lowerText.includes('stop speaking') ||
				lowerText.includes('stop talking')
			) {
				stopSpeaking();
				commandProcessed = true;
			}

			// If no command was processed, treat as regular input
			if (!commandProcessed) {
				onVoiceInput(text);
			}

			setTranscript('');

			// Clear the last processed command after a delay to allow new commands
			setTimeout(() => {
				setLastProcessedCommand('');
			}, 2000);
		},
		[
			lastProcessedCommand,
			onVoiceCommand,
			onVoiceInput,
			stopSpeaking,
		]
	);

	// Start audio level monitoring
	const startAudioMonitoring = useCallback(async () => {
		try {
			const stream =
				await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
			audioContextRef.current = new AudioContext();
			analyserRef.current =
				audioContextRef.current.createAnalyser();
			const source =
				audioContextRef.current.createMediaStreamSource(
					stream
				);

			source.connect(analyserRef.current);
			analyserRef.current.fftSize = 256;

			const dataArray = new Uint8Array(
				analyserRef.current.frequencyBinCount
			);

			const updateAudioLevel = () => {
				if (analyserRef.current && isListening) {
					analyserRef.current.getByteFrequencyData(
						dataArray
					);
					const average =
						dataArray.reduce(
							(sum, value) => sum + value,
							0
						) / dataArray.length;
					const normalizedLevel = average / 255;
					setAudioLevel(normalizedLevel);

					animationRef.current =
						requestAnimationFrame(
							updateAudioLevel
						);
				}
			};

			updateAudioLevel();
		} catch (error) {
			console.error(
				'Error accessing microphone:',
				error
			);
			setIsListening(false);
		}
	}, [isListening]);

	// Start listening
	const startListening = useCallback(() => {
		if (recognitionRef.current && !isListening) {
			try {
				recognitionRef.current.lang =
					voiceSettings.language;
				recognitionRef.current.start();
				setIsListening(true);
				setTranscript('');
				startAudioMonitoring();
			} catch (error) {
				console.error(
					'Error starting recognition:',
					error
				);
			}
		}
	}, [
		isListening,
		voiceSettings.language,
		startAudioMonitoring,
	]);

	// Initialize speech recognition and synthesis
	useEffect(() => {
		const SpeechRecognition:
			| typeof window.SpeechRecognition
			| undefined =
			window.SpeechRecognition ||
			window.webkitSpeechRecognition;

		if (SpeechRecognition) {
			recognitionRef.current =
				new SpeechRecognition();
			if (recognitionRef.current) {
				recognitionRef.current.continuous = true;
				recognitionRef.current.interimResults =
					true;
				recognitionRef.current.lang =
					voiceSettings.language;

				recognitionRef.current.onresult = (
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
								event.results[i][0]
									.transcript;
						}
					}
					if (finalTranscript) {
						console.log(
							'Speech recognized:',
							finalTranscript
						);
						setTranscript(finalTranscript);
						processVoiceInput(finalTranscript);
					}
				};

				recognitionRef.current.onerror = (
					event: SpeechRecognitionErrorEvent
				) => {
					console.error(
						'Speech recognition error:',
						event.error
					);
					setIsListening(false);
				};

				recognitionRef.current.onend = () => {
					setIsListening(false);
				};
			}
			setIsSupported(true);
		} else {
			console.warn(
				'Speech Recognition API not supported in this browser'
			);
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
			if (
				synthRef.current.onvoiceschanged !==
				undefined
			) {
				synthRef.current.onvoiceschanged =
					loadVoices;
			}
		}

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
			if (synthRef.current) {
				synthRef.current.cancel();
			}
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [voiceSettings.language, processVoiceInput]);

	// Audio visualizer component
	const AudioVisualizer = () => (
		<div className='flex items-center justify-center gap-1 h-6'>
			{[...Array(5)].map((_, i) => (
				<motion.div
					key={i}
					className={`w-1 bg-gradient-to-t from-chat-pink to-chat-purple rounded-full ${
						isDark ? 'opacity-80' : 'opacity-90'
					}`}
					animate={{
						height: isListening
							? `${Math.max(
									4,
									audioLevel * 24 +
										Math.random() * 8
							  )}px`
							: '4px',
					}}
					transition={{
						duration: 0.1,
						ease: 'easeOut',
					}}
				/>
			))}
		</div>
	);

	if (!isSupported) {
		return (
			<div
				className={cn(
					'flex items-center gap-2 p-2 rounded-lg text-sm',
					isDark
						? 'bg-chat-secondary/30 text-chat-accent'
						: 'bg-gray-100 text-gray-600',
					className
				)}
			>
				<MdMicOff />
				<span>Voice features not supported</span>
			</div>
		);
	}

	return (
		<div
			className={cn(
				'flex items-center gap-2',
				className
			)}
		>
			{/* Voice Recognition Button */}
			<motion.button
				onClick={
					isListening
						? () =>
								stopListeningFn(
									recognitionRef.current,
									animationRef.current,
									setIsListening,
									setAudioLevel
								)
						: startListening
				}
				className={cn(
					'relative flex items-center justify-center rounded-xl transition-all duration-300',
					// Responsive sizing based on className
					className?.includes('gap-1')
						? 'w-8 h-8' // Mobile size
						: 'w-10 h-10', // Desktop size
					isListening
						? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
						: isDark
						? 'bg-chat-secondary text-chat-accent hover:text-chat-pink hover:bg-chat-secondary/80'
						: 'bg-gray-100 text-gray-600 hover:text-chat-pink hover:bg-gray-200'
				)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				title={
					isListening
						? 'Stop voice recognition'
						: 'Start voice recognition'
				}
			>
				{isListening ? (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className={cn(
							'bg-white rounded-sm',
							className?.includes('gap-1')
								? 'w-3 h-3' // Mobile size
								: 'w-4 h-4' // Desktop size
						)}
					/>
				) : (
					<MdMic
						className={cn(
							className?.includes('gap-1')
								? 'text-lg' // Mobile size
								: 'text-xl' // Desktop size
						)}
					/>
				)}

				{isListening && (
					<motion.div
						className='absolute inset-0 rounded-xl border-2 border-white/30'
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.5, 0, 0.5],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					/>
				)}
			</motion.button>

			{/* Text-to-Speech Button */}
			<motion.button
				onClick={
					isSpeaking
						? stopSpeaking
						: () =>
								lastMessage &&
								speak(lastMessage)
				}
				disabled={!lastMessage}
				className={cn(
					'flex items-center justify-center rounded-xl transition-all duration-300',
					// Responsive sizing based on className
					className?.includes('gap-1')
						? 'w-8 h-8' // Mobile size
						: 'w-10 h-10', // Desktop size
					isSpeaking
						? 'bg-gradient-to-r from-chat-orange to-chat-pink text-white shadow-lg shadow-chat-orange/25'
						: isDark
						? 'bg-chat-secondary text-chat-accent hover:text-chat-orange hover:bg-chat-secondary/80 disabled:opacity-50'
						: 'bg-gray-100 text-gray-600 hover:text-chat-orange hover:bg-gray-200 disabled:opacity-50'
				)}
				whileHover={{
					scale: lastMessage ? 1.05 : 1,
				}}
				whileTap={{
					scale: lastMessage ? 0.95 : 1,
				}}
				title={
					isSpeaking
						? 'Stop speech'
						: 'Read last message aloud'
				}
			>
				{isSpeaking ? (
					<motion.div
						animate={{
							scale: [1, 1.1, 1],
						}}
						transition={{
							duration: 1,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					>
						<MdStop
							className={cn(
								className?.includes('gap-1')
									? 'text-lg' // Mobile size
									: 'text-xl' // Desktop size
							)}
						/>
					</motion.div>
				) : (
					<MdVolumeUp
						className={cn(
							className?.includes('gap-1')
								? 'text-lg' // Mobile size
								: 'text-xl' // Desktop size
						)}
					/>
				)}
			</motion.button>

			{/* Audio Visualizer - Hide on mobile when space is limited */}
			{isListening &&
				!className?.includes('gap-1') && (
					<motion.div
						initial={{
							opacity: 0,
							scale: 0.8,
						}}
						animate={{
							opacity: 1,
							scale: 1,
						}}
						exit={{
							opacity: 0,
							scale: 0.8,
						}}
						className={cn(
							'flex items-center gap-2 px-3 py-2 rounded-lg',
							isDark
								? 'bg-chat-secondary/50'
								: 'bg-gray-100/80'
						)}
					>
						<AudioVisualizer />
						<span
							className={cn(
								'text-sm font-medium',
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							)}
						>
							Listening...
						</span>
					</motion.div>
				)}

			{/* Mobile Audio Indicator - Simple version for mobile */}
			{isListening &&
				className?.includes('gap-1') && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className={cn(
							'flex items-center px-2 py-1 rounded text-xs',
							isDark
								? 'bg-chat-secondary/50 text-chat-accent'
								: 'bg-gray-100/80 text-gray-600'
						)}
					>
						<AudioVisualizer />
					</motion.div>
				)}

			{/* Transcript Display */}
			<AnimatePresence>
				{transcript && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className={cn(
							'p-2 rounded-lg text-sm',
							// Responsive sizing
							className?.includes('gap-1')
								? 'max-w-[200px] text-xs' // Mobile - smaller max width and text
								: 'max-w-xs', // Desktop
							isDark
								? 'bg-chat-secondary/50 text-white'
								: 'bg-gray-100 text-gray-800'
						)}
					>
						{transcript}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default VoiceControls;
