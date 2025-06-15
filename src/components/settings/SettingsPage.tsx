import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Monitor,
	Sun,
	Moon,
	Volume2,
	RotateCcw,
	AlertCircle,
} from 'lucide-react';
import type {
	SettingsPageProps,
	SettingsCategory,
	AppSettings,
	ThemeMode,
	FontFamily,
	FontSize,
	LayoutMode,
} from '../../types';
import { cn } from '../../utils/classNames';
import { settingsManager } from '../../utils/settings';
import { TTSSettings } from './TTSSettings';
// React Icons imports
import {
	MdPalette,
	MdAccessibility,
	MdSecurity,
	MdSettings,
} from 'react-icons/md';

const SettingsPage: React.FC<SettingsPageProps> = ({
	isVisible,
	settings,
	onSettingsChange,
}) => {
	const [activeCategory, setActiveCategory] =
		useState<SettingsCategory>('appearance');
	const [localSettings, setLocalSettings] =
		useState<AppSettings>(settings);
	const [hasChanges, setHasChanges] = useState(false);

	// Update local settings when props change
	useEffect(() => {
		setLocalSettings(settings);
		setHasChanges(false);
	}, [settings]);

	// Handle settings updates
	const updateLocalSettings = (
		updates: Partial<AppSettings>
	) => {
		const newSettings = {
			...localSettings,
			...updates,
		};
		setLocalSettings(newSettings);
		setHasChanges(true);
	};

	// Save settings
	const saveSettings = () => {
		onSettingsChange(localSettings);
		setHasChanges(false);
	};

	// Reset settings
	const resetSettings = () => {
		settingsManager.resetSettings();
		setHasChanges(false);
	};

	// Discard changes
	const discardChanges = () => {
		setLocalSettings(settings);
		setHasChanges(false);
	};

	// Categories configuration
	const categories: Array<{
		id: SettingsCategory;
		name: string;
		icon: React.ComponentType<{ className?: string }>;
		description: string;
	}> = [
		{
			id: 'appearance' as SettingsCategory,
			name: 'Appearance',
			icon: MdPalette,
			description:
				'Themes, colors, and visual customization',
		},
		{
			id: 'accessibility' as SettingsCategory,
			name: 'Accessibility',
			icon: MdAccessibility,
			description:
				'Accessibility features and options',
		},
		{
			id: 'voiceSynthesis' as SettingsCategory,
			name: 'Voice Synthesis',
			icon: Volume2,
			description:
				'Text-to-speech settings and voice output',
		},
		{
			id: 'privacy' as SettingsCategory,
			name: 'Privacy & Security',
			icon: MdSecurity,
			description:
				'Data collection and privacy settings',
		},
		{
			id: 'advanced' as SettingsCategory,
			name: 'Advanced',
			icon: MdSettings,
			description: 'Advanced configuration options',
		},
	];

	if (!isVisible) return null;

	return (
		<div className='w-full h-full flex items-center justify-center'>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className='bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl min-h-[600px] flex flex-col lg:flex-row overflow-hidden'
			>
				{/* Mobile Category Selector - Only visible on small screens */}
				<div className='lg:hidden p-4 border-b border-gray-200 dark:border-gray-700'>
					<select
						value={activeCategory}
						onChange={(e) =>
							setActiveCategory(
								e.target
									.value as SettingsCategory
							)
						}
						className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
					>
						{categories.map((category) => (
							<option
								key={category.id}
								value={category.id}
							>
								{category.name}
							</option>
						))}
					</select>
				</div>

				{/* Sidebar - Hidden on mobile */}
				<div className='hidden lg:flex w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col'>
					{/* Categories */}
					<div className='flex-1 p-4 space-y-2 overflow-y-auto'>
						{categories.map((category) => {
							const isActive =
								activeCategory ===
								category.id;

							return (
								<button
									key={category.id}
									onClick={() =>
										setActiveCategory(
											category.id
										)
									}
									className={cn(
										'w-full p-4 rounded-xl text-left transition-all duration-200',
										'flex items-start space-x-3 group',
										isActive
											? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
											: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
									)}
								>
									<category.icon
										className={cn(
											'text-xl mt-0.5 flex-shrink-0',
											isActive
												? 'text-blue-600 dark:text-blue-400'
												: 'text-gray-400'
										)}
									/>
									<div className='min-w-0 flex-1'>
										<div className='font-medium'>
											{category.name}
										</div>
										<div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
											{
												category.description
											}
										</div>
									</div>
								</button>
							);
						})}
					</div>

					{/* Actions */}
					{hasChanges && (
						<div className='p-4 border-t border-gray-200 dark:border-gray-700 space-y-2'>
							<div className='flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400'>
								<AlertCircle className='w-4 h-4' />
								<span>
									You have unsaved changes
								</span>
							</div>
							<div className='flex space-x-2'>
								<button
									onClick={saveSettings}
									className='flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
								>
									Save Changes
								</button>
								<button
									onClick={discardChanges}
									className='px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm'
								>
									Discard
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Main Content */}
				<div className='flex-1 flex flex-col overflow-hidden'>
					<div className='flex-1 overflow-y-auto'>
						<AnimatePresence mode='wait'>
							<motion.div
								key={activeCategory}
								initial={{
									opacity: 0,
									x: 20,
								}}
								animate={{
									opacity: 1,
									x: 0,
								}}
								exit={{
									opacity: 0,
									x: -20,
								}}
								transition={{
									duration: 0.2,
								}}
								className='p-4 sm:p-6 lg:p-8'
							>
								{activeCategory ===
									'appearance' && (
									<AppearanceSettings
										settings={
											localSettings
										}
										onUpdate={
											updateLocalSettings
										}
									/>
								)}
								{activeCategory ===
									'accessibility' && (
									<AccessibilitySettings
										settings={
											localSettings
										}
										onUpdate={
											updateLocalSettings
										}
									/>
								)}
								{activeCategory ===
									'voiceSynthesis' && (
									<TTSSettings
										isDark={
											localSettings
												.theme
												.mode ===
												'dark' ||
											(localSettings
												.theme
												.mode ===
												'auto' &&
												window.matchMedia(
													'(prefers-color-scheme: dark)'
												).matches)
										}
									/>
								)}
								{activeCategory ===
									'privacy' && (
									<PrivacySettings
										settings={
											localSettings
										}
										onUpdate={
											updateLocalSettings
										}
									/>
								)}
								{activeCategory ===
									'advanced' && (
									<AdvancedSettings
										settings={
											localSettings
										}
										onUpdate={
											updateLocalSettings
										}
										onReset={
											resetSettings
										}
									/>
								)}
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Mobile Actions - Only visible on small screens */}
					{hasChanges && (
						<div className='lg:hidden p-4 border-t border-gray-200 dark:border-gray-700 space-y-2'>
							<div className='flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400'>
								<AlertCircle className='w-4 h-4' />
								<span>
									You have unsaved changes
								</span>
							</div>
							<div className='flex space-x-2'>
								<button
									onClick={saveSettings}
									className='flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
								>
									Save Changes
								</button>
								<button
									onClick={discardChanges}
									className='px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm'
								>
									Discard
								</button>
							</div>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
};

// Appearance Settings Component
const AppearanceSettings: React.FC<{
	settings: AppSettings;
	onUpdate: (updates: Partial<AppSettings>) => void;
}> = ({ settings, onUpdate }) => {
	return (
		<div className='space-y-6 sm:space-y-8'>
			<div>
				<h3 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
					Appearance
				</h3>
				<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
					Customize the look and feel of your chat
					interface
				</p>
			</div>

			{/* Theme Mode */}
			<div className='space-y-3 sm:space-y-4'>
				<h4 className='text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100'>
					Theme Mode
				</h4>
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
					{[
						{
							id: 'light',
							name: 'Light',
							icon: Sun,
						},
						{
							id: 'dark',
							name: 'Dark',
							icon: Moon,
						},
						{
							id: 'auto',
							name: 'Auto',
							icon: Monitor,
						},
					].map((mode) => {
						const Icon = mode.icon;
						const isSelected =
							settings.theme.mode === mode.id;

						return (
							<button
								key={mode.id}
								onClick={() =>
									onUpdate({
										theme: {
											...settings.theme,
											mode: mode.id as ThemeMode,
										},
									})
								}
								className={cn(
									'p-3 sm:p-4 rounded-xl border-2 transition-all duration-200',
									'flex flex-col items-center space-y-2',
									isSelected
										? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
										: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
								)}
							>
								<Icon
									className={cn(
										'w-5 h-5 sm:w-6 sm:h-6',
										isSelected
											? 'text-blue-600 dark:text-blue-400'
											: 'text-gray-400'
									)}
								/>
								<span
									className={cn(
										'text-sm font-medium',
										isSelected
											? 'text-blue-700 dark:text-blue-300'
											: 'text-gray-700 dark:text-gray-300'
									)}
								>
									{mode.name}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Typography */}
			<div className='space-y-3 sm:space-y-4'>
				<h4 className='text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100'>
					Typography
				</h4>

				{/* Font Family */}
				<div className='space-y-2'>
					<label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
						Font Family
					</label>
					<select
						value={
							settings.typography.fontFamily
						}
						onChange={(e) =>
							onUpdate({
								typography: {
									...settings.typography,
									fontFamily: e.target
										.value as FontFamily,
								},
							})
						}
						className='w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base'
					>
						<option value='inter'>Inter</option>
						<option value='roboto'>
							Roboto
						</option>
						<option value='poppins'>
							Poppins
						</option>
						<option value='opensans'>
							Open Sans
						</option>
						<option value='system'>
							System Default
						</option>
					</select>
				</div>

				{/* Font Size */}
				<div className='space-y-2'>
					<label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
						Font Size
					</label>
					<div className='flex space-x-2'>
						{[
							{ id: 'xs', name: 'XS' },
							{ id: 'sm', name: 'SM' },
							{ id: 'md', name: 'MD' },
							{ id: 'lg', name: 'LG' },
							{ id: 'xl', name: 'XL' },
						].map((size) => {
							const isSelected =
								settings.typography
									.fontSize === size.id;

							return (
								<button
									key={size.id}
									onClick={() =>
										onUpdate({
											typography: {
												...settings.typography,
												fontSize:
													size.id as FontSize,
											},
										})
									}
									className={cn(
										'px-4 py-2 rounded-lg border transition-colors',
										isSelected
											? 'border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
											: 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
									)}
								>
									{size.name}
								</button>
							);
						})}
					</div>
				</div>

				{/* Line Height */}
				<div className='space-y-2'>
					<label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
						Line Height:{' '}
						{settings.typography.lineHeight}
					</label>
					<input
						type='range'
						min='1.2'
						max='2.0'
						step='0.1'
						value={
							settings.typography.lineHeight
						}
						onChange={(e) =>
							onUpdate({
								typography: {
									...settings.typography,
									lineHeight: parseFloat(
										e.target.value
									),
								},
							})
						}
						className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer'
					/>
					<div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
						<span>Tight</span>
						<span>Normal</span>
						<span>Loose</span>
					</div>
				</div>
			</div>

			{/* Layout */}
			<div className='space-y-4'>
				<h4 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
					Layout
				</h4>

				{/* Layout Mode */}
				<div className='space-y-2'>
					<label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
						Layout Mode
					</label>
					<div className='grid grid-cols-3 gap-4'>
						{[
							{
								id: 'compact',
								name: 'Compact',
								description: 'Dense layout',
							},
							{
								id: 'comfortable',
								name: 'Comfortable',
								description:
									'Balanced spacing',
							},
							{
								id: 'spacious',
								name: 'Spacious',
								description:
									'Generous spacing',
							},
						].map((mode) => {
							const isSelected =
								settings.layout.mode ===
								mode.id;

							return (
								<button
									key={mode.id}
									onClick={() =>
										onUpdate({
											layout: {
												...settings.layout,
												mode: mode.id as LayoutMode,
											},
										})
									}
									className={cn(
										'p-3 rounded-lg border-2 transition-all duration-200',
										'flex flex-col items-center space-y-1 text-center',
										isSelected
											? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
											: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
									)}
								>
									<span
										className={cn(
											'text-sm font-medium',
											isSelected
												? 'text-blue-700 dark:text-blue-300'
												: 'text-gray-700 dark:text-gray-300'
										)}
									>
										{mode.name}
									</span>
									<span className='text-xs text-gray-500 dark:text-gray-400'>
										{mode.description}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

// Accessibility Settings Component
const AccessibilitySettings: React.FC<{
	settings: AppSettings;
	onUpdate: (updates: Partial<AppSettings>) => void;
}> = ({ settings, onUpdate }) => {
	const toggleAccessibility = (
		key: keyof typeof settings.accessibility
	) => {
		onUpdate({
			accessibility: {
				...settings.accessibility,
				[key]: !settings.accessibility[key],
			},
		});
	};

	return (
		<div className='space-y-8'>
			<div>
				<h3 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
					Accessibility
				</h3>
				<p className='text-gray-600 dark:text-gray-400'>
					Configure accessibility features to
					improve usability
				</p>
			</div>

			<div className='space-y-6'>
				{[
					{
						key: 'highContrast' as const,
						title: 'High Contrast',
						description:
							'Increase contrast for better visibility',
					},
					{
						key: 'reducedMotion' as const,
						title: 'Reduced Motion',
						description:
							'Minimize animations and transitions',
					},
					{
						key: 'screenReaderSupport' as const,
						title: 'Screen Reader Support',
						description:
							'Enhanced support for screen readers',
					},
					{
						key: 'keyboardNavigation' as const,
						title: 'Keyboard Navigation',
						description:
							'Navigate using keyboard shortcuts',
					},
					{
						key: 'focusIndicators' as const,
						title: 'Focus Indicators',
						description:
							'Show clear focus indicators',
					},
					{
						key: 'largeClickTargets' as const,
						title: 'Large Click Targets',
						description:
							'Increase button and link sizes',
					},
				].map((option) => (
					<div
						key={option.key}
						className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
					>
						<div>
							<h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
								{option.title}
							</h4>
							<p className='text-sm text-gray-600 dark:text-gray-400'>
								{option.description}
							</p>
						</div>
						<button
							onClick={() =>
								toggleAccessibility(
									option.key
								)
							}
							className={cn(
								'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
								settings.accessibility[
									option.key
								]
									? 'bg-blue-600'
									: 'bg-gray-300 dark:bg-gray-600'
							)}
						>
							<span
								className={cn(
									'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
									settings.accessibility[
										option.key
									]
										? 'translate-x-6'
										: 'translate-x-1'
								)}
							/>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

// Privacy Settings Component
const PrivacySettings: React.FC<{
	settings: AppSettings;
	onUpdate: (updates: Partial<AppSettings>) => void;
}> = ({ settings, onUpdate }) => {
	const togglePrivacy = (
		key: keyof typeof settings.privacy
	) => {
		onUpdate({
			privacy: {
				...settings.privacy,
				[key]: !settings.privacy[key],
			},
		});
	};

	return (
		<div className='space-y-8'>
			<div>
				<h3 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
					Privacy
				</h3>
				<p className='text-gray-600 dark:text-gray-400'>
					Control data collection and privacy
					settings
				</p>
			</div>

			<div className='space-y-6'>
				{[
					{
						key: 'analytics' as const,
						title: 'Analytics',
						description:
							'Help improve the app by sharing usage analytics',
					},
					{
						key: 'crashReporting' as const,
						title: 'Crash Reporting',
						description:
							'Automatically report crashes to help fix bugs',
					},
					{
						key: 'dataCollection' as const,
						title: 'Data Collection',
						description:
							'Allow collection of conversation data for improvements',
					},
				].map((option) => (
					<div
						key={option.key}
						className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
					>
						<div>
							<h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
								{option.title}
							</h4>
							<p className='text-sm text-gray-600 dark:text-gray-400'>
								{option.description}
							</p>
						</div>
						<button
							onClick={() =>
								togglePrivacy(option.key)
							}
							className={cn(
								'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
								settings.privacy[option.key]
									? 'bg-blue-600'
									: 'bg-gray-300 dark:bg-gray-600'
							)}
						>
							<span
								className={cn(
									'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
									settings.privacy[
										option.key
									]
										? 'translate-x-6'
										: 'translate-x-1'
								)}
							/>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

// Advanced Settings Component
const AdvancedSettings: React.FC<{
	settings: AppSettings;
	onUpdate: (updates: Partial<AppSettings>) => void;
	onReset: () => void;
}> = ({ settings, onUpdate, onReset }) => {
	const updateAnimations = (
		updates: Partial<typeof settings.animations>
	) => {
		onUpdate({
			animations: {
				...settings.animations,
				...updates,
			},
		});
	};

	return (
		<div className='space-y-8'>
			<div>
				<h3 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
					Advanced
				</h3>
				<p className='text-gray-600 dark:text-gray-400'>
					Advanced configuration and system
					settings
				</p>
			</div>

			{/* Animations */}
			<div className='space-y-4'>
				<h4 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
					Animations
				</h4>

				<div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
					<div>
						<h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
							Enable Animations
						</h4>
						<p className='text-sm text-gray-600 dark:text-gray-400'>
							Show smooth transitions and
							animations
						</p>
					</div>
					<button
						onClick={() =>
							updateAnimations({
								enabled:
									!settings.animations
										.enabled,
							})
						}
						className={cn(
							'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
							settings.animations.enabled
								? 'bg-blue-600'
								: 'bg-gray-300 dark:bg-gray-600'
						)}
					>
						<span
							className={cn(
								'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
								settings.animations.enabled
									? 'translate-x-6'
									: 'translate-x-1'
							)}
						/>
					</button>
				</div>

				{settings.animations.enabled && (
					<div className='space-y-4'>
						<div className='space-y-2'>
							<label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
								Animation Duration:{' '}
								{
									settings.animations
										.duration
								}
								ms
							</label>
							<input
								type='range'
								min='100'
								max='1000'
								step='50'
								value={
									settings.animations
										.duration
								}
								onChange={(e) =>
									updateAnimations({
										duration: parseInt(
											e.target.value
										),
									})
								}
								className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer'
							/>
						</div>
					</div>
				)}
			</div>

			{/* Reset Settings */}
			<div className='space-y-4'>
				<h4 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
					Reset Settings
				</h4>
				<div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
					<div className='flex items-start space-x-3'>
						<AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 mt-0.5' />
						<div className='flex-1'>
							<h4 className='text-sm font-medium text-red-800 dark:text-red-200'>
								Reset All Settings
							</h4>
							<p className='text-sm text-red-700 dark:text-red-300 mt-1'>
								This will reset all settings
								to their default values.
								This action cannot be
								undone.
							</p>
							<button
								onClick={onReset}
								className='mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-2'
							>
								<RotateCcw className='w-4 h-4' />
								<span>
									Reset to Defaults
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
