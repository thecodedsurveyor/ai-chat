import { useState, useCallback, useEffect } from 'react';
import Toast, { type Toast as ToastData } from './Toast';
import {
	setToastManager,
	type ToastType,
} from '../../utils/toast';

type ToastContainerProps = {
	children: React.ReactNode;
};

const ToastContainer = ({
	children,
}: ToastContainerProps) => {
	const [toasts, setToasts] = useState<ToastData[]>([]);

	const addToast = useCallback(
		(
			title: string,
			message?: string,
			type: ToastType = 'info',
			duration?: number
		) => {
			const id = crypto.randomUUID();
			const newToast: ToastData = {
				id,
				title,
				message,
				type,
				duration,
			};

			setToasts((prev) => [...prev, newToast]);
		},
		[]
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) =>
			prev.filter((toast) => toast.id !== id)
		);
	}, []);

	// Set global reference
	useEffect(() => {
		setToastManager(addToast);
	}, [addToast]);

	return (
		<>
			{children}

			{/* Toast Container */}
			<div className='fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full'>
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						toast={toast}
						onRemove={removeToast}
					/>
				))}
			</div>
		</>
	);
};

export default ToastContainer;
