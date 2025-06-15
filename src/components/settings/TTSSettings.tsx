import React from 'react';
import { useEnhancedTTS } from '../../hooks/useEnhancedTTS';
import type { TTSSettings as TTSSettingsType } from '../../hooks/useEnhancedTTS';

interface TTSSettingsProps {
	isDark: boolean;
}

export const TTSSettings: React.FC<TTSSettingsProps> = ({
	isDark,
}) => {
	const {
		voices,
		settings,
		usageInfo,
		isElevenLabsAvailable,
		lastUsedService,
		updateSettings,
		loadVoices,
		resetQuota,
	} = useEnhancedTTS();

	const handleSettingChange = (
		key: keyof TTSSettingsType,
		value: any
	) => {
		updateSettings({ [key]: value });
	};

	const selectedVoice = voices.find(
		(v) => v.id === settings.selectedVoiceId
	);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<h3
					className={`text-lg font-semibold ${
						isDark
							? 'text-white'
							: 'text-gray-900'
					}`}
				>
					Text-to-Speech Settings
				</h3>

				{/* Service Status */}
				<div className='flex items-center gap-2'>
					<div
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							isElevenLabsAvailable
								? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
								: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
						}`}
					>
						{isElevenLabsAvailable
							? 'ElevenLabs Active'
							: 'Browser TTS Only'}
					</div>

					{lastUsedService && (
						<div
							className={`px-2 py-1 rounded-full text-xs ${
								isDark
									? 'bg-gray-700 text-gray-300'
									: 'bg-gray-200 text-gray-700'
							}`}
						>
							Last:{' '}
							{lastUsedService ===
							'elevenlabs'
								? 'ElevenLabs'
								: 'Browser'}
						</div>
					)}
				</div>
			</div>

			{/* ElevenLabs Usage Info */}
			{isElevenLabsAvailable && usageInfo && (
				<div
					className={`p-4 rounded-lg border ${
						isDark
							? 'bg-gray-800 border-gray-700'
							: 'bg-gray-50 border-gray-200'
					}`}
				>
					<div className='flex items-center justify-between mb-2'>
						<span
							className={`text-sm font-medium ${
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							}`}
						>
							ElevenLabs Usage
						</span>
						<span
							className={`text-sm ${
								isDark
									? 'text-gray-400'
									: 'text-gray-600'
							}`}
						>
							{usageInfo.characterCount.toLocaleString()}{' '}
							/{' '}
							{usageInfo.characterLimit.toLocaleString()}{' '}
							chars
						</span>
					</div>

					<div
						className={`w-full bg-gray-200 rounded-full h-2 ${
							isDark
								? 'bg-gray-700'
								: 'bg-gray-200'
						}`}
					>
						<div
							className={`h-2 rounded-full transition-all duration-300 ${
								usageInfo.percentage > 90
									? 'bg-red-500'
									: usageInfo.percentage >
									  70
									? 'bg-yellow-500'
									: 'bg-green-500'
							}`}
							style={{
								width: `${Math.min(
									usageInfo.percentage,
									100
								)}%`,
							}}
						/>
					</div>

					<div className='flex items-center justify-between mt-2'>
						<span
							className={`text-xs ${
								isDark
									? 'text-gray-400'
									: 'text-gray-600'
							}`}
						>
							{usageInfo.percentage.toFixed(
								1
							)}
							% used
						</span>

						{usageInfo.percentage > 95 && (
							<button
								onClick={resetQuota}
								className='text-xs text-blue-500 hover:text-blue-600 underline'
							>
								Reset & Retry
							</button>
						)}
					</div>
				</div>
			)}

			{/* Voice Selection */}
			<div className='space-y-3'>
				<label
					className={`block text-sm font-medium ${
						isDark
							? 'text-gray-300'
							: 'text-gray-700'
					}`}
				>
					Voice Selection
				</label>

				<div className='flex gap-2'>
					<select
						value={settings.selectedVoiceId}
						onChange={(e) =>
							handleSettingChange(
								'selectedVoiceId',
								e.target.value
							)
						}
						className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
							isDark
								? 'bg-gray-700 border-gray-600 text-white'
								: 'bg-white border-gray-300 text-gray-900'
						}`}
					>
						<option value=''>
							Select a voice...
						</option>
						{voices.map((voice) => (
							<option
								key={voice.id}
								value={voice.id}
							>
								{voice.name}
							</option>
						))}
					</select>

					<button
						onClick={loadVoices}
						className={`px-3 py-2 rounded-lg border transition-colors ${
							isDark
								? 'border-gray-600 text-gray-300 hover:bg-gray-700'
								: 'border-gray-300 text-gray-700 hover:bg-gray-50'
						}`}
						title='Refresh voices'
					>
						🔄
					</button>
				</div>

				{selectedVoice && (
					<div
						className={`text-xs ${
							isDark
								? 'text-gray-400'
								: 'text-gray-600'
						}`}
					>
						Type:{' '}
						{selectedVoice.type === 'elevenlabs'
							? 'ElevenLabs AI Voice'
							: 'Browser Voice'}
					</div>
				)}
			</div>

			{/* Preference Toggle */}
			<div className='space-y-3'>
				<label
					className={`flex items-center gap-3 cursor-pointer ${
						isDark
							? 'text-gray-300'
							: 'text-gray-700'
					}`}
				>
					<input
						type='checkbox'
						checked={settings.preferElevenLabs}
						onChange={(e) =>
							handleSettingChange(
								'preferElevenLabs',
								e.target.checked
							)
						}
						className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
					/>
					<span className='text-sm font-medium'>
						Prefer ElevenLabs (when available)
					</span>
				</label>

				<p
					className={`text-xs ${
						isDark
							? 'text-gray-400'
							: 'text-gray-600'
					}`}
				>
					When enabled, ElevenLabs voices will be
					used first. Falls back to browser TTS
					when quota is exceeded or API is
					unavailable.
				</p>
			</div>

			{/* ElevenLabs Settings */}
			{selectedVoice?.type === 'elevenlabs' && (
				<div className='space-y-4'>
					<h4
						className={`text-md font-medium ${
							isDark
								? 'text-gray-300'
								: 'text-gray-700'
						}`}
					>
						ElevenLabs Voice Settings
					</h4>

					{/* Stability */}
					<div className='space-y-2'>
						<label
							className={`block text-sm ${
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							}`}
						>
							Stability:{' '}
							{settings.stability.toFixed(2)}
						</label>
						<input
							type='range'
							min='0'
							max='1'
							step='0.01'
							value={settings.stability}
							onChange={(e) =>
								handleSettingChange(
									'stability',
									parseFloat(
										e.target.value
									)
								)
							}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
						/>
						<p
							className={`text-xs ${
								isDark
									? 'text-gray-400'
									: 'text-gray-600'
							}`}
						>
							Higher values make the voice
							more stable but less expressive
						</p>
					</div>

					{/* Similarity Boost */}
					<div className='space-y-2'>
						<label
							className={`block text-sm ${
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							}`}
						>
							Similarity Boost:{' '}
							{settings.similarityBoost.toFixed(
								2
							)}
						</label>
						<input
							type='range'
							min='0'
							max='1'
							step='0.01'
							value={settings.similarityBoost}
							onChange={(e) =>
								handleSettingChange(
									'similarityBoost',
									parseFloat(
										e.target.value
									)
								)
							}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
						/>
						<p
							className={`text-xs ${
								isDark
									? 'text-gray-400'
									: 'text-gray-600'
							}`}
						>
							Enhances similarity to the
							original voice
						</p>
					</div>

					{/* Style */}
					<div className='space-y-2'>
						<label
							className={`block text-sm ${
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							}`}
						>
							Style:{' '}
							{settings.style.toFixed(2)}
						</label>
						<input
							type='range'
							min='0'
							max='1'
							step='0.01'
							value={settings.style}
							onChange={(e) =>
								handleSettingChange(
									'style',
									parseFloat(
										e.target.value
									)
								)
							}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
						/>
						<p
							className={`text-xs ${
								isDark
									? 'text-gray-400'
									: 'text-gray-600'
							}`}
						>
							Adds more character and emotion
							to the voice
						</p>
					</div>

					{/* Speaker Boost */}
					<label
						className={`flex items-center gap-3 cursor-pointer ${
							isDark
								? 'text-gray-300'
								: 'text-gray-700'
						}`}
					>
						<input
							type='checkbox'
							checked={
								settings.useSpeakerBoost
							}
							onChange={(e) =>
								handleSettingChange(
									'useSpeakerBoost',
									e.target.checked
								)
							}
							className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
						/>
						<span className='text-sm'>
							Use Speaker Boost
						</span>
					</label>
				</div>
			)}

			{/* Browser TTS Settings */}
			{(selectedVoice?.type === 'browser' ||
				!settings.preferElevenLabs) && (
				<div className='space-y-4'>
					<h4
						className={`text-md font-medium ${
							isDark
								? 'text-gray-300'
								: 'text-gray-700'
						}`}
					>
						Browser Voice Settings
					</h4>

					{/* Rate */}
					<div className='space-y-2'>
						<label
							className={`block text-sm ${
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							}`}
						>
							Rate: {settings.rate.toFixed(1)}
							x
						</label>
						<input
							type='range'
							min='0.1'
							max='3'
							step='0.1'
							value={settings.rate}
							onChange={(e) =>
								handleSettingChange(
									'rate',
									parseFloat(
										e.target.value
									)
								)
							}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
						/>
					</div>

					{/* Pitch */}
					<div className='space-y-2'>
						<label
							className={`block text-sm ${
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							}`}
						>
							Pitch:{' '}
							{settings.pitch.toFixed(1)}
						</label>
						<input
							type='range'
							min='0'
							max='2'
							step='0.1'
							value={settings.pitch}
							onChange={(e) =>
								handleSettingChange(
									'pitch',
									parseFloat(
										e.target.value
									)
								)
							}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
						/>
					</div>

					{/* Volume */}
					<div className='space-y-2'>
						<label
							className={`block text-sm ${
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							}`}
						>
							Volume:{' '}
							{Math.round(
								settings.volume * 100
							)}
							%
						</label>
						<input
							type='range'
							min='0'
							max='1'
							step='0.01'
							value={settings.volume}
							onChange={(e) =>
								handleSettingChange(
									'volume',
									parseFloat(
										e.target.value
									)
								)
							}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
						/>
					</div>
				</div>
			)}

			{/* API Key Status */}
			{!isElevenLabsAvailable && (
				<div
					className={`p-4 rounded-lg border-l-4 border-yellow-400 ${
						isDark
							? 'bg-yellow-900/20'
							: 'bg-yellow-50'
					}`}
				>
					<div className='flex'>
						<div className='ml-3'>
							<p
								className={`text-sm ${
									isDark
										? 'text-yellow-200'
										: 'text-yellow-800'
								}`}
							>
								<strong>
									ElevenLabs API Key
									Required
								</strong>
							</p>
							<p
								className={`mt-1 text-sm ${
									isDark
										? 'text-yellow-300'
										: 'text-yellow-700'
								}`}
							>
								Add your ElevenLabs API key
								to the .env file to enable
								high-quality AI voices.
								Currently using browser TTS
								as fallback.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
