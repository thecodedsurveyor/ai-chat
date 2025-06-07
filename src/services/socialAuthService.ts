import { authService } from './authService';

// Define our own type for Clerk User to avoid direct dependency
type ClerkUser = {
	id: string;
	firstName?: string | null;
	lastName?: string | null;
	primaryEmailAddress?: {
		emailAddress: string;
	} | null;
};

/**
 * Service to bridge Clerk's OAuth authentication with our existing backend
 */
export class SocialAuthService {
	/**
	 * Register or login a user from Clerk OAuth in our backend system
	 */
	async syncUserWithBackend(
		clerkUser: ClerkUser
	): Promise<boolean> {
		try {
			// Extract required user data from Clerk
			const primaryEmail =
				clerkUser.primaryEmailAddress?.emailAddress;
			const firstName = clerkUser.firstName || '';
			const lastName = clerkUser.lastName || '';

			if (!primaryEmail) {
				console.error(
					'No primary email found for the user'
				);
				return false;
			}

			// First try to login the user
			const loginResult = await authService.login({
				email: primaryEmail,
				password: `social-auth-${clerkUser.id}`, // A placeholder, not used for validation
			});

			// If login successful, user exists in our system
			if (loginResult.success) {
				return true;
			}

			// If login failed, try to register the user
			const registerResult =
				await authService.register({
					email: primaryEmail,
					password: `social-auth-${clerkUser.id}`, // A secure random password
					firstName,
					lastName,
				});

			return registerResult.success;
		} catch (error) {
			console.error(
				'Error syncing user with backend:',
				error
			);
			return false;
		}
	}

	/**
	 * Check if the user exists in our backend system
	 */
	async doesUserExist(email: string): Promise<boolean> {
		try {
			// Try to login with a known-to-fail password to check if user exists
			const response = await fetch(
				`${
					import.meta.env.VITE_API_BASE_URL ||
					'http://localhost:3003/api'
				}/auth/check-email-exists`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email }),
				}
			);

			const result = await response.json();
			return result.exists;
		} catch (error) {
			console.error(
				'Error checking if user exists:',
				error
			);
			return false;
		}
	}
}

export const socialAuthService = new SocialAuthService();
