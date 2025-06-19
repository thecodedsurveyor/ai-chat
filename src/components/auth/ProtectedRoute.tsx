import React, { useRef, useEffect } from 'react';
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

	// Use useEffect for navigation to avoid render-time side effects
	useEffect(() => {
		if (
			(!isAuthenticated || !user) &&
			!hasRedirected.current
		) {
			hasRedirected.current = true;
			showToast(
				'error',
				'You need to log in to access the chat. Please log in to continue.'
			);
			navigate('/auth');
		}
	}, [isAuthenticated, user, navigate]);

	// If not authenticated, return null while useEffect handles navigation
	if (!isAuthenticated || !user) {
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
