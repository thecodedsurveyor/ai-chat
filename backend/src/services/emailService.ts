/**
 * Mock Email Service
 * This service logs email actions instead of sending actual emails
 * Resend functionality has been removed
 */

class EmailService {
	constructor() {
		console.log(
			'📧 Email Service initialized in mock mode (Resend functionality removed)'
		);
	}

	/**
	 * Mock: Send welcome email after user registration
	 */
	async sendWelcomeEmail(
		email: string,
		firstName: string,
		lastName: string
	): Promise<boolean> {
		console.log(
			'📧 [MOCK] Welcome email would be sent to:',
			{
				to: email,
				firstName,
				lastName,
				subject: 'Welcome to AI Chat! 🚀',
			}
		);
		return true; // Always return success for mock
	}

	/**
	 * Mock: Send password reset email
	 */
	async sendPasswordResetEmail(
		email: string,
		firstName: string,
		resetToken: string
	): Promise<boolean> {
		const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

		console.log(
			'📧 [MOCK] Password reset email would be sent to:',
			{
				to: email,
				firstName,
				subject: 'Reset Your Password - AI Chat',
				resetUrl,
			}
		);
		return true; // Always return success for mock
	}

	/**
	 * Mock: Send password change confirmation email
	 */
	async sendPasswordChangeConfirmation(
		email: string,
		firstName: string
	): Promise<boolean> {
		console.log(
			'📧 [MOCK] Password change confirmation email would be sent to:',
			{
				to: email,
				firstName,
				subject:
					'Password Changed Successfully - AI Chat',
			}
		);
		return true; // Always return success for mock
	}
}

// Export singleton instance
export default new EmailService();
