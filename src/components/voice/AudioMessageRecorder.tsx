import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
} from 'react';
import {
	BiMicrophone,
	BiStop,
	BiPlay,
	BiPause,
	BiTrash,
	BiSend,
} from 'react-icons/bi';
import { useTheme } from '../../contexts/ThemeContext';
import type { AudioRecording } from '../../types';

interface AudioMessageRecorderProps {
	onSendAudio?: (recording: AudioRecording) => void;
	onCancel?: () => void;
	className?: string;
}

const AudioMessageRecorder: React.FC<
	AudioMessageRecorderProps
> = ({ onSendAudio, onCancel, className = '' }) => {
	const { isDark } = useTheme();
	const [isRecording, setIsRecording] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(
		null
	);
	const [audioUrl, setAudioUrl] = useState<string | null>(
		null
	);
	const [isSupported, setIsSupported] = useState(false);

	const mediaRecorderRef = useRef<MediaRecorder | null>(
		null
	);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	// Check if audio recording is supported
	useEffect(() => {
		const checkSupport = async () => {
			try {
				const hasMediaDevices =
					navigator.mediaDevices &&
					navigator.mediaDevices.getUserMedia;
				const hasMediaRecorder =
					'MediaRecorder' in window;
				setIsSupported(
					hasMediaDevices && hasMediaRecorder
				);
			} catch (error) {
				console.error(
					'Error checking audio support:',
					error
				);
				setIsSupported(false);
			}
		};

		checkSupport();
	}, []);

	// Start recording
	const startRecording = useCallback(async () => {
		if (!isSupported) return;

		try {
			const stream =
				await navigator.mediaDevices.getUserMedia({
					audio: {
						echoCancellation: true,
						noiseSuppression: true,
						autoGainControl: true,
					},
				});

			streamRef.current = stream;
			chunksRef.current = [];

			const mediaRecorder = new MediaRecorder(
				stream,
				{
					mimeType: MediaRecorder.isTypeSupported(
						'audio/webm'
					)
						? 'audio/webm'
						: 'audio/mp4',
				}
			);

			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunksRef.current, {
					type: mediaRecorder.mimeType,
				});
				setAudioBlob(blob);
				setAudioUrl(URL.createObjectURL(blob));

				// Clean up stream
				if (streamRef.current) {
					streamRef.current
						.getTracks()
						.forEach((track) => track.stop());
					streamRef.current = null;
				}
			};

			mediaRecorder.start(100); // Collect data every 100ms
			setIsRecording(true);
			setRecordingTime(0);

			// Start timer
			timerRef.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);
		} catch (error) {
			console.error(
				'Error starting recording:',
				error
			);
			alert(
				'Could not access microphone. Please check permissions.'
			);
		}
	}, [isSupported]);

	// Stop recording
	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);

			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}
	}, [isRecording]);

	// Play recorded audio
	const playAudio = useCallback(() => {
		if (audioUrl && !isPlaying) {
			const audio = new Audio(audioUrl);
			audioRef.current = audio;

			audio.onended = () => {
				setIsPlaying(false);
				audioRef.current = null;
			};

			audio.onerror = () => {
				setIsPlaying(false);
				audioRef.current = null;
			};

			audio.play();
			setIsPlaying(true);
		}
	}, [audioUrl, isPlaying]);

	// Pause audio
	const pauseAudio = useCallback(() => {
		if (audioRef.current && isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
			audioRef.current = null;
		}
	}, [isPlaying]);

	// Delete recording
	const deleteRecording = useCallback(() => {
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}
		setAudioBlob(null);
		setAudioUrl(null);
		setRecordingTime(0);
		setIsPlaying(false);

		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}
	}, [audioUrl]);

	// Send recording
	const sendRecording = useCallback(() => {
		if (audioBlob && onSendAudio) {
			const recording: AudioRecording = {
				id: Date.now().toString(),
				blob: audioBlob,
				duration: recordingTime,
				timestamp: new Date().toISOString(),
			};

			onSendAudio(recording);
			deleteRecording();
		}
	}, [
		audioBlob,
		recordingTime,
		onSendAudio,
		deleteRecording,
	]);

	// Cancel recording
	const cancelRecording = useCallback(() => {
		if (isRecording) {
			stopRecording();
		}
		deleteRecording();
		if (onCancel) {
			onCancel();
		}
	}, [
		isRecording,
		stopRecording,
		deleteRecording,
		onCancel,
	]);

	// Format time
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs
			.toString()
			.padStart(2, '0')}`;
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
			if (streamRef.current) {
				streamRef.current
					.getTracks()
					.forEach((track) => track.stop());
			}
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
			if (audioRef.current) {
				audioRef.current.pause();
			}
		};
	}, [audioUrl]);

	if (!isSupported) {
		return null; // Don't render if not supported
	}

	return (
		<div
			className={`flex items-center gap-2 p-3 rounded-lg border ${
				isDark
					? 'bg-gray-800 border-gray-700'
					: 'bg-gray-50 border-gray-200'
			} ${className}`}
		>
			{/* Recording State */}
			{!audioBlob && (
				<>
					<button
						onClick={
							isRecording
								? stopRecording
								: startRecording
						}
						className={`p-2 rounded-full transition-colors ${
							isRecording
								? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
								: isDark
								? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
								: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
						}`}
						title={
							isRecording
								? 'Stop recording'
								: 'Start recording'
						}
					>
						{isRecording ? (
							<BiStop className='w-5 h-5' />
						) : (
							<BiMicrophone className='w-5 h-5' />
						)}
					</button>

					{isRecording && (
						<div
							className={`flex items-center gap-2 ${
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							}`}
						>
							<div className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />
							<span className='text-sm font-mono'>
								{formatTime(recordingTime)}
							</span>
						</div>
					)}
				</>
			)}

			{/* Playback State */}
			{audioBlob && (
				<>
					<button
						onClick={
							isPlaying
								? pauseAudio
								: playAudio
						}
						className={`p-2 rounded-full transition-colors ${
							isDark
								? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
								: 'bg-green-100 text-green-600 hover:bg-green-200'
						}`}
						title={isPlaying ? 'Pause' : 'Play'}
					>
						{isPlaying ? (
							<BiPause className='w-5 h-5' />
						) : (
							<BiPlay className='w-5 h-5' />
						)}
					</button>

					<div
						className={`flex items-center gap-2 ${
							isDark
								? 'text-gray-300'
								: 'text-gray-700'
						}`}
					>
						<span className='text-sm font-mono'>
							{formatTime(recordingTime)}
						</span>
					</div>

					<div className='flex items-center gap-1 ml-auto'>
						<button
							onClick={deleteRecording}
							className={`p-2 rounded-full transition-colors ${
								isDark
									? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
									: 'bg-red-100 text-red-600 hover:bg-red-200'
							}`}
							title='Delete recording'
						>
							<BiTrash className='w-4 h-4' />
						</button>

						<button
							onClick={sendRecording}
							className={`p-2 rounded-full transition-colors ${
								isDark
									? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
									: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
							}`}
							title='Send recording'
						>
							<BiSend className='w-4 h-4' />
						</button>
					</div>
				</>
			)}

			{/* Cancel button (always visible) */}
			<button
				onClick={cancelRecording}
				className={`p-1 rounded transition-colors ${
					isDark
						? 'text-gray-500 hover:text-gray-300'
						: 'text-gray-400 hover:text-gray-600'
				}`}
				title='Cancel'
			>
				×
			</button>
		</div>
	);
};

export default AudioMessageRecorder;
