export type ToastType =
	| 'success'
	| 'error'
	| 'warning'
	| 'info';

export interface ToastData {
	id: string;
	title: string;
	message?: string;
	type: ToastType;
	duration?: number;
}

// Global toast manager
let addToastGlobal:
	| ((
			title: string,
			message?: string,
			type?: ToastType,
			duration?: number
	  ) => void)
	| null = null;

export const setToastManager = (
	manager: (
		title: string,
		message?: string,
		type?: ToastType,
		duration?: number
	) => void
) => {
	addToastGlobal = manager;
};

export const showToast = (
	title: string,
	message?: string,
	type: ToastType = 'info',
	duration?: number
) => {
	if (addToastGlobal) {
		addToastGlobal(title, message, type, duration);
	} else {
		// Toast manager not initialized
	}
};

export const showErrorToast = (
	title: string,
	message?: string,
	duration?: number
) => {
	showToast(title, message, 'error', duration);
};

export const showSuccessToast = (
	title: string,
	message?: string,
	duration?: number
) => {
	showToast(title, message, 'success', duration);
};

export const showWarningToast = (
	title: string,
	message?: string,
	duration?: number
) => {
	showToast(title, message, 'warning', duration);
};

export const showInfoToast = (
	title: string,
	message?: string,
	duration?: number
) => {
	showToast(title, message, 'info', duration);
};
