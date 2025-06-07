import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
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
	const {
		isSignedIn: isClerkSignedIn,
		isLoaded: isClerkLoaded,
	} = useUser();
	const { showError } = useToast();

	// Use refs to prevent state updates during render
	const hasRedirectedRef = useRef(false);
	const lastPathRef = useRef(location.pathname);

	// Get authentication status from our own auth service
	const isAuthServiceSignedIn =
		authService.isAuthenticated();

	useEffect(() => {
		// Reset redirect status when path changes
		if (lastPathRef.current !== location.pathname) {
			hasRedirectedRef.current = false;
			lastPathRef.current = location.pathname;
		}

		// Skip if Clerk is not loaded yet
		if (!isClerkLoaded) return;

		// Skip if we've already redirected for this route
		if (hasRedirectedRef.current) return;

		// Handle redirection logic
		if (
			requireAuth &&
			!isAuthServiceSignedIn &&
			!isClerkSignedIn
		) {
			// Don't show error on initial page load for auth pages
			if (location.pathname !== '/auth') {
				showError(
					'Authentication Required',
					'Please sign in to access this page'
				);
			}

			hasRedirectedRef.current = true;
			navigate(redirectTo, { replace: true });
		} else if (
			!requireAuth &&
			(isAuthServiceSignedIn || isClerkSignedIn)
		) {
			hasRedirectedRef.current = true;
			navigate('/chat', { replace: true });
		}
	}, [
		isClerkLoaded,
		isClerkSignedIn,
		isAuthServiceSignedIn,
		requireAuth,
		navigate,
		redirectTo,
		showError,
		location.pathname,
	]);

	// Decide what to render
	if (!isClerkLoaded) {
		return null;
	}

	if (
		requireAuth &&
		!isAuthServiceSignedIn &&
		!isClerkSignedIn
	) {
		return null;
	}

	if (
		!requireAuth &&
		(isAuthServiceSignedIn || isClerkSignedIn)
	) {
		return null;
	}

	return <>{children}</>;
}

export default AuthGuard;
