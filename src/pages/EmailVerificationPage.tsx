import React, {
	useEffect,
	useState,
	useCallback,
} from 'react';
import {
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';

const EmailVerificationPage: React.FC = () => {
	usePageTitle('Verify Email – NeuronFlow');
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { showToast } = useToast();
	const [isVerifying, setIsVerifying] = useState(true);
	const [verificationStatus, setVerificationStatus] =
		useState<'pending' | 'success' | 'error'>(
			'pending'
		);
	const [errorMessage, setErrorMessage] = useState('');
	const [resendingEmail, setResendingEmail] =
		useState(false);

	const token = searchParams.get('token');
	const email = searchParams.get('email');

	const verifyEmail = useCallback(async () => {
		try {
			setIsVerifying(true);
			const response = await authService.verifyEmail(
				token!,
				email!
			);

			if (response.success) {
				setVerificationStatus('success');

				// Store the tokens
				if (
					response.data?.accessToken &&
					response.data?.refreshToken
				) {
					localStorage.setItem(
						'accessToken',
						response.data.accessToken
					);
					localStorage.setItem(
						'refreshToken',
						response.data.refreshToken
					);
				}

				showToast({
					type: 'success',
					title: 'Email verified successfully! Welcome to NeuronFlow!',
				});

				// Redirect to chat after 2 seconds
				setTimeout(() => {
					navigate('/chat');
				}, 2000);
			} else {
				setVerificationStatus('error');
				setErrorMessage(
					response.message ||
						'Verification failed'
				);
			}
		} catch (error) {
			console.error(
				'Email verification error:',
				error
			);
			setVerificationStatus('error');
			setErrorMessage(
				error instanceof Error
					? error.message
					: 'Verification failed. Please try again.'
			);
		} finally {
			setIsVerifying(false);
		}
	}, [token, email, navigate, showToast]);

	useEffect(() => {
		if (!email) {
			setVerificationStatus('error');
			setErrorMessage(
				'Invalid verification link. Please check your email and try again.'
			);
			setIsVerifying(false);
			return;
		}

		if (!token) {
			// User landed here with just email (from login redirect)
			setVerificationStatus('error');
			setErrorMessage(
				"Please check your email for the verification link. If you haven't received it, you can resend it below."
			);
			setIsVerifying(false);
			return;
		}

		verifyEmail();
	}, [token, email, verifyEmail]);

	const handleResendEmail = async () => {
		if (!email) return;

		try {
			setResendingEmail(true);
			const response =
				await authService.resendVerificationEmail(
					email
				);

			if (response.success) {
				showToast({
					type: 'success',
					title: 'Verification email sent! Please check your inbox.',
				});
			} else {
				showToast({
					type: 'error',
					title:
						response.message ||
						'Failed to send email',
				});
			}
		} catch (error) {
			console.error('Resend email error:', error);
			showToast({
				type: 'error',
				title:
					error instanceof Error
						? error.message
						: 'Failed to send email',
			});
		} finally {
			setResendingEmail(false);
		}
	};

	const renderContent = () => {
		if (isVerifying) {
			return (
				<div className='text-center py-12'>
					<div className='animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6'></div>
					<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
						Verifying Your Email
					</h2>
					<p className='text-gray-600 dark:text-gray-400'>
						Please wait while we verify your
						email address...
					</p>
				</div>
			);
		}

		if (verificationStatus === 'success') {
			return (
				<div className='text-center py-12'>
					<div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6'>
						<svg
							className='w-8 h-8 text-green-600 dark:text-green-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
					</div>
					<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
						Email Verified Successfully! 🎉
					</h2>
					<p className='text-gray-600 dark:text-gray-400 mb-4'>
						Welcome to NeuronFlow! Your account
						is now active.
					</p>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Redirecting you to the chat
						interface...
					</p>
				</div>
			);
		}

		return (
			<div className='text-center py-12'>
				<div className='w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6'>
					<svg
						className='w-8 h-8 text-red-600 dark:text-red-400'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
						/>
					</svg>
				</div>
				<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
					Verification Failed
				</h2>
				<p className='text-gray-600 dark:text-gray-400 mb-6'>
					{errorMessage}
				</p>

				{email && (
					<div className='space-y-4'>
						<button
							onClick={handleResendEmail}
							disabled={resendingEmail}
							className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto'
						>
							{resendingEmail ? (
								<>
									<div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
									Sending...
								</>
							) : (
								<>
									<svg
										className='w-4 h-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
										/>
									</svg>
									Resend Verification
									Email
								</>
							)}
						</button>

						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Didn't receive the email? Check
							your spam folder or try
							resending.
						</p>
					</div>
				)}

				<div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
					<button
						onClick={() => navigate('/auth')}
						className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium'
					>
						← Back to Sign In
					</button>
				</div>
			</div>
		);
	};

	return (
		<PageLayout title='Email Verification'>
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8'>
					{renderContent()}
				</div>
			</div>
		</PageLayout>
	);
};

export default EmailVerificationPage;
