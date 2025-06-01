import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

interface ProtectedRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	redirectTo = '/auth',
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<
		boolean | null
	>(null);
	const location = useLocation();

	useEffect(() => {
		const checkAuth = () => {
			const authenticated =
				authService.isAuthenticated();
			const user = authService.getUser();

			// User is authenticated if they have both token and user data
			setIsAuthenticated(authenticated && !!user);
		};

		checkAuth();
	}, []);

	// Show loading state while checking authentication
	if (isAuthenticated === null) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	// Redirect to auth page if not authenticated
	if (!isAuthenticated) {
		return (
			<Navigate
				to={redirectTo}
				state={{ from: location }}
				replace
			/>
		);
	}

	// Render protected content
	return <>{children}</>;
};

export default ProtectedRoute;
