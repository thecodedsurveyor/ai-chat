import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { showToast } from '../../utils/toast';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
}) => {
	const navigate = useNavigate();
	const hasRedirected = useRef(false);

	// Check authentication immediately
	const isAuthenticated = authService.isAuthenticated();
	const user = authService.getUser();

	// If not authenticated and haven't redirected yet, redirect
	if (!isAuthenticated || !user) {
		if (!hasRedirected.current) {
			hasRedirected.current = true;
			// Use setTimeout to avoid updating during render
			setTimeout(() => {
				showToast(
					'error',
					'You need to log in to access the chat. Please log in to continue.'
				);
				navigate('/auth');
			}, 0);
		}
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
