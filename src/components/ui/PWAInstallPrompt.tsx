import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
	}>;
}

const PWAInstallPrompt: React.FC = () => {
	const { isDark } = useTheme();
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);
	const [isInstallable, setIsInstallable] =
		useState(false);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			setDeferredPrompt(
				e as BeforeInstallPromptEvent
			);
			setIsInstallable(true);

			// Show our custom prompt after a delay (don't be too aggressive)
			setTimeout(() => {
				const hasSeenPrompt = localStorage.getItem(
					'pwa-install-prompt-dismissed'
				);
				if (!hasSeenPrompt) {
					setShowPrompt(true);
				}
			}, 10000); // Show after 10 seconds
		};

		const handleAppInstalled = () => {
			setDeferredPrompt(null);
			setIsInstallable(false);
			setShowPrompt(false);
			localStorage.setItem(
				'pwa-install-prompt-dismissed',
				'true'
			);
		};

		window.addEventListener(
			'beforeinstallprompt',
			handleBeforeInstallPrompt
		);
		window.addEventListener(
			'appinstalled',
			handleAppInstalled
		);

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt
			);
			window.removeEventListener(
				'appinstalled',
				handleAppInstalled
			);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		// Show the install prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			console.log('PWA installation accepted');
		} else {
			console.log('PWA installation dismissed');
		}

		setDeferredPrompt(null);
		setShowPrompt(false);
		localStorage.setItem(
			'pwa-install-prompt-dismissed',
			'true'
		);
	};

	const handleDismiss = () => {
		setShowPrompt(false);
		localStorage.setItem(
			'pwa-install-prompt-dismissed',
			'true'
		);
	};

	// Don't show if already dismissed or not installable
	if (!isInstallable || !showPrompt) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 100, opacity: 0 }}
				transition={{ duration: 0.4 }}
				className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 p-4 rounded-xl shadow-2xl border backdrop-blur-md ${
					isDark
						? 'bg-chat-secondary/95 border-white/10'
						: 'bg-white/95 border-gray-200'
				}`}
			>
				<div className='flex items-start gap-3'>
					<div
						className={`p-2 rounded-lg ${
							isDark
								? 'bg-gradient-to-r from-chat-pink to-chat-purple'
								: 'bg-gradient-to-r from-blue-500 to-purple-500'
						}`}
					>
						<Smartphone className='w-5 h-5 text-white' />
					</div>

					<div className='flex-1'>
						<h3
							className={`font-semibold text-sm ${
								isDark
									? 'text-white'
									: 'text-gray-900'
							}`}
						>
							Install NeuronFlow
						</h3>
						<p
							className={`text-xs mt-1 ${
								isDark
									? 'text-gray-300'
									: 'text-gray-600'
							}`}
						>
							Get the full app experience with
							offline support, faster loading,
							and native mobile features.
						</p>

						<div className='flex gap-2 mt-3'>
							<button
								onClick={handleInstall}
								className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
									isDark
										? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white hover:shadow-lg'
										: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
								}`}
							>
								<Download className='w-3 h-3' />
								Install
							</button>
							<button
								onClick={handleDismiss}
								className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
									isDark
										? 'text-gray-300 hover:bg-white/10'
										: 'text-gray-600 hover:bg-gray-100'
								}`}
							>
								Maybe later
							</button>
						</div>
					</div>

					<button
						onClick={handleDismiss}
						className={`p-1 rounded-lg transition-colors ${
							isDark
								? 'text-gray-400 hover:text-white hover:bg-white/10'
								: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
						}`}
					>
						<X className='w-4 h-4' />
					</button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default PWAInstallPrompt;
