// services/emailService.ts
import * as dotenv from 'dotenv';
dotenv.config();

import sgMail from '@sendgrid/mail';
import { Resend } from 'resend';

// Import your HTML templates
import { welcomeEmailTemplate } from '../templates/welcomeEmail';
import { passwordResetEmailTemplate } from '../templates/passwordResetEmail';
import { passwordChangedEmailTemplate } from '../templates/passwordChangedEmail';
import { emailVerificationTemplate } from '../templates/emailVerificationTemplate';

enum EmailProvider {
	SENDGRID = 'sendgrid',
	RESEND = 'resend',
	MOCK = 'mock',
}

class EmailService {
	private provider: EmailProvider;
	private sendgrid: typeof sgMail | null = null;
	private resend: Resend | null = null;
	private fromEmail: string;
	private fromName: string;
	private isInitialized = false;

	constructor() {
		// 1) Decide provider from EMAIL_PROVIDER in .env
		const providerEnv = (
			process.env.EMAIL_PROVIDER || 'mock'
		).toLowerCase();

		if (
			providerEnv === EmailProvider.SENDGRID &&
			process.env.SENDGRID_API_KEY
		) {
			this.provider = EmailProvider.SENDGRID;
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);
			this.sendgrid = sgMail;
		} else if (
			providerEnv === EmailProvider.RESEND &&
			process.env.RESEND_API_KEY
		) {
			this.provider = EmailProvider.RESEND;
			this.resend = new Resend(
				process.env.RESEND_API_KEY
			);
		} else {
			this.provider = EmailProvider.MOCK;
		}

		// 2) Read the "from" address and friendly name from .env
		this.fromEmail =
			process.env.EMAIL_FROM_ADDRESS ||
			(this.provider === EmailProvider.RESEND
				? 'onboarding@resend.dev' // Resend's verified domain for testing
				: 'noreply@neuronflow.app');
		this.fromName =
			process.env.EMAIL_FROM_NAME || 'NeuronFlow';

		this.isInitialized = true;
	}

	/**
	 * Send a welcome email after user registration
	 */
	async sendWelcomeEmail(
		email: string,
		firstName: string,
		lastName: string
	): Promise<boolean> {
		const subject = 'Welcome to NeuronFlow! 🚀';
		const htmlContent = welcomeEmailTemplate({
			firstName,
			lastName,
			appName: 'NeuronFlow',
			loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth`,
		});

		return this.sendEmail(email, subject, htmlContent);
	}

	/**
	 * Send password reset email
	 */
	async sendPasswordResetEmail(
		email: string,
		firstName: string,
		resetToken: string
	): Promise<boolean> {
		const subject = 'Reset Your Password - NeuronFlow';
		const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(
			email
		)}`;

		const htmlContent = passwordResetEmailTemplate({
			firstName,
			resetUrl,
			appName: 'NeuronFlow',
			expiryHours: 1,
		});

		return this.sendEmail(email, subject, htmlContent);
	}

	/**
	 * Send password change confirmation email
	 */
	async sendPasswordChangeConfirmation(
		email: string,
		firstName: string
	): Promise<boolean> {
		const subject =
			'Password Changed Successfully - NeuronFlow';
		const htmlContent = passwordChangedEmailTemplate({
			firstName,
			appName: 'NeuronFlow',
			supportEmail:
				process.env.SUPPORT_EMAIL ||
				'support@neuronflow.app',
			loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth`,
		});

		return this.sendEmail(email, subject, htmlContent);
	}

	/**
	 * Send email verification email
	 */
	async sendEmailVerification(
		email: string,
		firstName: string,
		verificationToken: string
	): Promise<boolean> {
		const subject = 'Verify Your Email - NeuronFlow';
		const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(
			email
		)}`;

		const htmlContent = emailVerificationTemplate({
			firstName,
			verificationUrl,
			appName: 'NeuronFlow',
		});

		return this.sendEmail(email, subject, htmlContent);
	}

	/**
	 * Generic email‐sending method that routes to the appropriate provider
	 */
	private async sendEmail(
		to: string,
		subject: string,
		html: string
	): Promise<boolean> {
		if (!this.isInitialized) {
			console.error('Email service not initialized');
			return false;
		}

		// Format the "from" as "Name <address>"
		const formattedFrom = `${this.fromName} <${this.fromEmail}>`;

		try {
			switch (this.provider) {
				case EmailProvider.SENDGRID:
					if (this.sendgrid) {
						await this.sendgrid.send({
							to: [to], // always pass as an array
							from: formattedFrom,
							subject,
							html,
						});
					}
					break;

				case EmailProvider.RESEND:
					if (this.resend) {
						// Resend requires verified domain for 'from' field
						// Use simple format: "Name <email@domain.com>"
						await this.resend.emails.send({
							from: `${this.fromName} <${this.fromEmail}>`,
							to: [to],
							subject,
							html,
							replyTo: this.fromEmail,
						});
					}
					break;

				case EmailProvider.MOCK:
					// In mock mode, email would be sent
					break;
			}

			return true;
		} catch (error) {
			console.error('Failed to send email:', {
				provider: this.provider,
				to,
				subject: subject.substring(0, 50) + '...',
				error:
					error instanceof Error
						? error.message
						: error,
				details:
					error instanceof Error
						? error.stack
						: undefined,
			});
			return false;
		}
	}

	/**
	 * Get email service status for debugging
	 */
	getStatus(): {
		provider: string;
		isInitialized: boolean;
		fromEmail: string;
		fromName: string;
		hasApiKey: boolean;
	} {
		return {
			provider: this.provider,
			isInitialized: this.isInitialized,
			fromEmail: this.fromEmail,
			fromName: this.fromName,
			hasApiKey:
				this.provider === EmailProvider.RESEND
					? !!process.env.RESEND_API_KEY
					: this.provider ===
						  EmailProvider.SENDGRID
						? !!process.env.SENDGRID_API_KEY
						: false,
		};
	}
}

export default new EmailService();
