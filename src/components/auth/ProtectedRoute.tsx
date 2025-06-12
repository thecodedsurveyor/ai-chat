import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
}) => {
	const navigate = useNavigate();
	const { showError } = useToast();

	useEffect(() => {
		const isAuthenticated =
			authService.isAuthenticated();
		const user = authService.getUser();

		if (!isAuthenticated || !user) {
			// Show alert that user needs to login
			showError(
				'Authentication Required',
				'You need to log in to access the chat. Please log in to continue.'
			);

			// Redirect to auth page
			navigate('/auth');
			return;
		}
	}, [navigate, showError]);

	// Only render children if authenticated
	if (!authService.isAuthenticated()) {
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
