import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';

interface AuthGuardProps {
	children: ReactNode;
	redirectTo?: string;
	requireAuth?: boolean;
}

/**
 * AuthGuard component to protect routes that require authentication
 * or redirect authenticated users away from auth pages
 */
function AuthGuard({
	children,
	redirectTo = '/auth',
	requireAuth = true,
}: AuthGuardProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const { showError } = useToast();

	// Use refs to prevent state updates during render
	const hasRedirectedRef = useRef(false);
	const lastPathRef = useRef(location.pathname);

	// Get authentication status from our own auth service
	const isAuthenticated = authService.isAuthenticated();

	useEffect(() => {
		// Reset redirect status when path changes
		if (lastPathRef.current !== location.pathname) {
			hasRedirectedRef.current = false;
			lastPathRef.current = location.pathname;
		}

		// Skip if we've already redirected for this route
		if (hasRedirectedRef.current) return;

		// Handle redirection logic
		if (requireAuth && !isAuthenticated) {
			// Don't show error on initial page load for auth pages
			if (location.pathname !== '/auth') {
				showError(
					'Authentication Required',
					'Please sign in to access this page'
				);
			}

			hasRedirectedRef.current = true;
			navigate(redirectTo, { replace: true });
		} else if (!requireAuth && isAuthenticated) {
			hasRedirectedRef.current = true;
			navigate('/chat', { replace: true });
		}
	}, [
		isAuthenticated,
		requireAuth,
		navigate,
		redirectTo,
		showError,
		location.pathname,
	]);

	// Decide what to render
	if (requireAuth && !isAuthenticated) {
		return null;
	}

	if (!requireAuth && isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}

export default AuthGuard;
