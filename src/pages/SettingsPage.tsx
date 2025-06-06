import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/authService';
import { settingsManager } from '../utils/settings';
import { usePageTitle } from '../hooks/usePageTitle';
import SettingsComponent from '../components/settings/SettingsPage';
import { cn } from '../utils/classNames';
import type { AppSettings } from '../types';

const SettingsPage: React.FC = () => {
	const { isDark } = useTheme();
	const navigate = useNavigate();

	// Set page title
	usePageTitle('Settings & Preferences – AI Chat');

	const [settings, setSettings] = useState<AppSettings>(
		settingsManager.getSettings()
	);

	// Redirect if not authenticated
	useEffect(() => {
		const user = authService.getUser();
		if (!user) {
			navigate('/auth');
		}
	}, [navigate]);

	const handleSettingsChange = (
		partialSettings: Partial<AppSettings>
	) => {
		const newSettings = {
			...settings,
			...partialSettings,
		};
		settingsManager.updateSettings(newSettings);
		setSettings(newSettings);
	};

	const handleBackToChat = () => {
		navigate('/ai-chat');
	};

	return (
		<div
			className={cn(
				'min-h-screen',
				isDark
					? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
					: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
			)}
		>
			{/* Header */}
			<div
				className={cn(
					'sticky top-0 z-10 border-b-2 backdrop-blur-sm',
					isDark
						? 'bg-chat-primary/90 border-chat-accent/30'
						: 'bg-white/90 border-chat-purple/30'
				)}
			>
				<div className='max-w-7xl mx-auto px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-4'>
							<button
								onClick={handleBackToChat}
								className={cn(
									'p-2 rounded-lg transition-colors',
									isDark
										? 'text-chat-accent hover:text-white hover:bg-chat-secondary'
										: 'text-chat-light-accent hover:text-chat-light-text hover:bg-gray-100'
								)}
							>
								<ArrowLeft className='w-5 h-5' />
							</button>
							<div>
								<h1
									className={cn(
										'text-3xl font-bold',
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									)}
								>
									⚙️ Settings
								</h1>
								<p
									className={cn(
										'text-sm mt-1',
										isDark
											? 'text-chat-accent'
											: 'text-chat-light-accent'
									)}
								>
									Customize your
									experience
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Settings Component */}
			<div className='max-w-6xl mx-auto px-6 py-8'>
				<SettingsComponent
					isVisible={true}
					settings={settings}
					onSettingsChange={handleSettingsChange}
				/>
			</div>
		</div>
	);
};

export default SettingsPage;
