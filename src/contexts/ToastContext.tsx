import React, {
	createContext,
	useContext,
	useState,
} from 'react';
import type { ReactNode } from 'react';
import Toast from '../components/ui/Toast';

interface ToastData {
	id: string;
	type: 'success' | 'error' | 'info';
	title: string;
	message?: string;
	duration?: number;
}

interface ToastContextType {
	showToast: (toast: Omit<ToastData, 'id'>) => void;
	showSuccess: (title: string, message?: string) => void;
	showError: (title: string, message?: string) => void;
	showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<
	ToastContextType | undefined
>(undefined);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error(
			'useToast must be used within a ToastProvider'
		);
	}
	return context;
};

interface ToastProviderProps {
	children: ReactNode;
}

export const ToastProvider: React.FC<
	ToastProviderProps
> = ({ children }) => {
	const [toasts, setToasts] = useState<ToastData[]>([]);

	const removeToast = (id: string) => {
		setToasts((prev) =>
			prev.filter((toast) => toast.id !== id)
		);
	};

	const showToast = (toast: Omit<ToastData, 'id'>) => {
		const id =
			Date.now().toString() +
			Math.random().toString(36).substr(2, 9);
		const newToast: ToastData = { ...toast, id };
		setToasts((prev) => [...prev, newToast]);
	};

	const showSuccess = (
		title: string,
		message?: string
	) => {
		showToast({ type: 'success', title, message });
	};

	const showError = (title: string, message?: string) => {
		showToast({ type: 'error', title, message });
	};

	const showInfo = (title: string, message?: string) => {
		showToast({ type: 'info', title, message });
	};

	return (
		<ToastContext.Provider
			value={{
				showToast,
				showSuccess,
				showError,
				showInfo,
			}}
		>
			{children}

			{/* Toast Container */}
			<div className='fixed top-4 right-4 z-50 space-y-2 max-w-sm'>
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						id={toast.id}
						type={toast.type}
						title={toast.title}
						message={toast.message}
						duration={toast.duration}
						onClose={removeToast}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
};
