import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
	BiCheckCircle,
	BiErrorCircle,
	BiError,
	BiInfoCircle,
	BiX,
} from 'react-icons/bi';

export type ToastType =
	| 'success'
	| 'error'
	| 'warning'
	| 'info';

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
}

interface ToastProps {
	toast: Toast;
	onRemove: (id: string) => void;
}

const Toast = ({ toast, onRemove }: ToastProps) => {
	const { isDark } = useTheme();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Trigger animation
		const timer = setTimeout(
			() => setIsVisible(true),
			10
		);

		// Auto remove
		const removeTimer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => onRemove(toast.id), 300);
		}, toast.duration || 3000);

		return () => {
			clearTimeout(timer);
			clearTimeout(removeTimer);
		};
	}, [toast.id, toast.duration, onRemove]);

	const getToastStyles = () => {
		const baseStyles = `transform transition-all duration-300 ${
			isVisible
				? 'translate-x-0 opacity-100'
				: 'translate-x-full opacity-0'
		}`;

		switch (toast.type) {
			case 'success':
				return `${baseStyles} ${
					isDark
						? 'bg-green-900/90 border-green-500/50 text-green-100'
						: 'bg-green-50 border-green-200 text-green-800'
				}`;
			case 'error':
				return `${baseStyles} ${
					isDark
						? 'bg-red-900/90 border-red-500/50 text-red-100'
						: 'bg-red-50 border-red-200 text-red-800'
				}`;
			case 'warning':
				return `${baseStyles} ${
					isDark
						? 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100'
						: 'bg-yellow-50 border-yellow-200 text-yellow-800'
				}`;
			default:
				return `${baseStyles} ${
					isDark
						? 'bg-blue-900/90 border-blue-500/50 text-blue-100'
						: 'bg-blue-50 border-blue-200 text-blue-800'
				}`;
		}
	};

	const getIcon = () => {
		switch (toast.type) {
			case 'success':
				return (
					<BiCheckCircle className='text-lg' />
				);
			case 'error':
				return (
					<BiErrorCircle className='text-lg' />
				);
			case 'warning':
				return <BiError className='text-lg' />;
			default:
				return <BiInfoCircle className='text-lg' />;
		}
	};

	return (
		<div
			className={`${getToastStyles()} flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm max-w-sm`}
		>
			<div className='flex-shrink-0 mt-0.5'>
				{getIcon()}
			</div>

			<div className='flex-1 min-w-0'>
				<h4 className='font-medium text-sm'>
					{toast.title}
				</h4>
				{toast.message && (
					<p className='text-xs mt-1 opacity-90'>
						{toast.message}
					</p>
				)}
			</div>

			<button
				onClick={() => onRemove(toast.id)}
				className='flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity'
			>
				<BiX className='text-lg' />
			</button>
		</div>
	);
};

export default Toast;
