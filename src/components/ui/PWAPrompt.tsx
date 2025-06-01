import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/classNames';
// React Icons imports
import { MdDownload } from 'react-icons/md';

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
	}>;
}

const PWAPrompt: React.FC = () => {
	const { isDark } = useTheme();
	const [isVisible, setIsVisible] = useState(false);
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isOnline, setIsOnline] = useState(
		navigator.onLine
	);

	useEffect(() => {
		// Listen for the install prompt
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(
				e as BeforeInstallPromptEvent
			);
			setIsVisible(true);
		};

		// Listen for network status changes
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener(
			'beforeinstallprompt',
			handleBeforeInstallPrompt
		);
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt
			);
			window.removeEventListener(
				'online',
				handleOnline
			);
			window.removeEventListener(
				'offline',
				handleOffline
			);
		};
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		try {
			await deferredPrompt.prompt();
			const choiceResult =
				await deferredPrompt.userChoice;

			if (choiceResult.outcome === 'accepted') {
				// User accepted the install prompt
			} else {
				// User dismissed the install prompt
			}

			setDeferredPrompt(null);
			setIsVisible(false);
		} catch {
			// Error during installation
		}
	};

	const handleDismiss = () => {
		setIsVisible(false);
		setDeferredPrompt(null);
	};

	return (
		<>
			{/* Network Status Indicator */}
			<div
				className={cn(
					'fixed top-4 right-4 z-50 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300',
					isOnline
						? 'bg-green-500 text-white'
						: 'bg-red-500 text-white shadow-lg'
				)}
			>
				<div className='flex items-center gap-2'>
					<div
						className={cn(
							'w-2 h-2 rounded-full',
							isOnline
								? 'bg-white'
								: 'bg-white animate-pulse'
						)}
					></div>
					{isOnline ? 'Online' : 'Offline'}
				</div>
			</div>

			{/* PWA Install Prompt */}
			{isVisible && deferredPrompt && (
				<div className='fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto'>
					<div
						className={cn(
							'p-4 rounded-lg shadow-lg border',
							isDark
								? 'bg-chat-primary border-chat-accent/30 text-white'
								: 'bg-white border-gray-200 text-gray-900'
						)}
					>
						<div className='flex items-start gap-3'>
							<div className='p-2 rounded-lg bg-gradient-to-r from-chat-pink to-chat-purple'>
								<MdDownload className='text-white' />
							</div>
							<div className='flex-1 min-w-0'>
								<h3 className='font-semibold text-sm mb-1'>
									Install AI Chat App
								</h3>
								<p className='text-xs opacity-75 mb-3'>
									Install this app for
									better performance and
									offline access
								</p>
								<div className='flex gap-2'>
									<button
										onClick={
											handleInstallClick
										}
										className='flex-1 py-2 px-3 bg-gradient-to-r from-chat-pink to-chat-purple text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity'
									>
										Install
									</button>
									<button
										onClick={
											handleDismiss
										}
										className={cn(
											'py-2 px-3 text-xs font-medium rounded-lg transition-colors',
											isDark
												? 'text-gray-400 hover:text-white hover:bg-white/10'
												: 'text-chat-light-button-secondary hover:text-white hover:bg-chat-light-button-secondary'
										)}
									>
										Later
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PWAPrompt;
