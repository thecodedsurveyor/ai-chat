import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	CheckCircle,
	XCircle,
	X,
	Info,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message?: string;
	duration?: number;
}

interface ToastProps {
	toast: Toast;
	onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
	toast,
	onRemove,
}) => {
	const { isDark } = useTheme();
	const [isVisible, setIsVisible] = useState(true);

	// Default values in case toast is undefined
	const id = toast?.id || 'default-id';
	const type = toast?.type || 'info';
	const title = toast?.title || 'Notification';
	const message = toast?.message;
	const duration = toast?.duration || 5000;

	useEffect(() => {
		if (!toast) {
			return;
		}

		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => onRemove(id), 300);
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, id, onRemove, toast]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => onRemove(id), 300);
	};

	const getIcon = () => {
		switch (type) {
			case 'success':
				return (
					<CheckCircle className='w-5 h-5 text-green-500' />
				);
			case 'error':
				return (
					<XCircle className='w-5 h-5 text-red-500' />
				);
			case 'warning':
				return (
					<Info className='w-5 h-5 text-yellow-500' />
				);
			default:
				return (
					<Info className='w-5 h-5 text-blue-500' />
				);
		}
	};

	const getColors = () => {
		if (isDark) {
			switch (type) {
				case 'success':
					return 'bg-green-900/90 border-green-700 text-green-100';
				case 'error':
					return 'bg-red-900/90 border-red-700 text-red-100';
				case 'warning':
					return 'bg-yellow-900/90 border-yellow-700 text-yellow-100';
				default:
					return 'bg-blue-900/90 border-blue-700 text-blue-100';
			}
		} else {
			switch (type) {
				case 'success':
					return 'bg-green-50 border-green-200 text-green-800';
				case 'error':
					return 'bg-red-50 border-red-200 text-red-800';
				case 'warning':
					return 'bg-yellow-50 border-yellow-200 text-yellow-800';
				default:
					return 'bg-blue-50 border-blue-200 text-blue-800';
			}
		}
	};

	// Don't render if toast is completely missing
	if (!toast) {
		return null;
	}

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{
						opacity: 0,
						y: -50,
						scale: 0.95,
					}}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{
						opacity: 0,
						y: -50,
						scale: 0.95,
					}}
					transition={{
						duration: 0.3,
						ease: 'easeOut',
					}}
					className={`
						relative flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg
						${getColors()}
					`}
				>
					<div className='flex-shrink-0 mt-0.5'>
						{getIcon()}
					</div>

					<div className='flex-1 min-w-0'>
						<h4 className='font-semibold text-sm'>
							{title || 'Notification'}
						</h4>
						{message && (
							<p className='mt-1 text-sm opacity-90'>
								{message}
							</p>
						)}
					</div>

					<button
						onClick={handleClose}
						className='flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors'
					>
						<X className='w-4 h-4' />
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Toast;
