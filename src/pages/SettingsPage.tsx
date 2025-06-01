import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/authService';
import { settingsManager } from '../utils/settings';
import { usePageTitle } from '../hooks/usePageTitle';
import SettingsComponent from '../components/settings/SettingsPage';
import type { AppSettings } from '../types';

const SettingsPage: React.FC = () => {
	const { isDark } = useTheme();
	const navigate = useNavigate();

	// Set page title
	usePageTitle('Settings');

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

	const handleClose = () => {
		navigate('/ai-chat');
	};

	return (
		<div
			className={`min-h-screen ${
				isDark
					? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
					: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
			}`}
		>
			{/* Header */}
			<div className='relative'>
				<div className='absolute top-6 left-6 z-10'>
					<button
						onClick={() => navigate('/ai-chat')}
						className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
							isDark
								? 'bg-white/10 hover:bg-white/20 text-white'
								: 'bg-white/80 hover:bg-white text-gray-800'
						} backdrop-blur-sm border ${
							isDark
								? 'border-white/20'
								: 'border-gray-200'
						}`}
					>
						<ArrowLeft className='w-4 h-4' />
						<span>Back to Chat</span>
					</button>
				</div>
			</div>

			{/* Settings Component */}
			<div className='pt-20'>
				<SettingsComponent
					isVisible={true}
					onClose={handleClose}
					settings={settings}
					onSettingsChange={handleSettingsChange}
				/>
			</div>
		</div>
	);
};

export default SettingsPage;
