import { authService } from '../services/authService';

/**
 * Session manager utility to handle session validation and cleanup
 */
export class SessionManager {
	private static checkInProgress = false;

	/**
	 * Check if the current user's session is still valid
	 * This will automatically logout users whose accounts have been deleted
	 */
	static async validateSession(): Promise<boolean> {
		// Prevent multiple simultaneous checks
		if (SessionManager.checkInProgress) {
			return authService.isAuthenticated();
		}

		SessionManager.checkInProgress = true;

		try {
			if (!authService.isAuthenticated()) {
				return false;
			}

			// Try to get user profile - this will trigger logout if user is deleted
			const profileResult =
				await authService.getProfile();

			// If the request failed due to user not found, getProfile() already handled logout
			return profileResult.success;
		} catch (error) {
			console.error(
				'Session validation error:',
				error
			);
			// If there's any error, assume session is invalid
			await authService.logout();
			return false;
		} finally {
			SessionManager.checkInProgress = false;
		}
	}

	/**
	 * Initialize session monitoring - call this when the app starts
	 */
	static initSessionMonitoring(): void {
		// Check session validity on app start
		SessionManager.validateSession();

		// Set up periodic session checks (every 5 minutes)
		setInterval(() => {
			SessionManager.validateSession();
		}, 5 * 60 * 1000);

		// Check session when user becomes active (focus/visibility change)
		if (typeof window !== 'undefined') {
			document.addEventListener(
				'visibilitychange',
				() => {
					if (!document.hidden) {
						SessionManager.validateSession();
					}
				}
			);

			window.addEventListener('focus', () => {
				SessionManager.validateSession();
			});
		}
	}

	/**
	 * Force a session check - useful after critical operations
	 */
	static async forceSessionCheck(): Promise<boolean> {
		SessionManager.checkInProgress = false; // Reset the flag to allow forced check
		return await SessionManager.validateSession();
	}
}

export default SessionManager;
