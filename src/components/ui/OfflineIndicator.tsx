import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const OfflineIndicator: React.FC = () => {
	const { isDark } = useTheme();
	const [isOnline, setIsOnline] = useState(
		navigator.onLine
	);
	const [showIndicator, setShowIndicator] =
		useState(false);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
			setShowIndicator(true);
			// Hide after 3 seconds when back online
			setTimeout(() => setShowIndicator(false), 3000);
		};

		const handleOffline = () => {
			setIsOnline(false);
			setShowIndicator(true);
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		// Show indicator initially if offline
		if (!navigator.onLine) {
			setShowIndicator(true);
		}

		return () => {
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

	return (
		<AnimatePresence>
			{showIndicator && (
				<motion.div
					initial={{ y: -100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -100, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg border backdrop-blur-md ${
						isOnline
							? isDark
								? 'bg-green-500/20 border-green-500/30 text-green-400'
								: 'bg-green-500/20 border-green-500/30 text-green-600'
							: isDark
							? 'bg-red-500/20 border-red-500/30 text-red-400'
							: 'bg-red-500/20 border-red-500/30 text-red-600'
					}`}
				>
					<div className='flex items-center gap-2 text-sm font-medium'>
						{isOnline ? (
							<>
								<Wifi className='w-4 h-4' />
								<span>Back online</span>
							</>
						) : (
							<>
								<WifiOff className='w-4 h-4' />
								<span>You're offline</span>
							</>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default OfflineIndicator;
