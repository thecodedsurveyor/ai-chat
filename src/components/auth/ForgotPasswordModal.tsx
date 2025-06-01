import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Mail,
	X,
	ArrowLeft,
	CheckCircle,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/authService';
import { cn } from '../../utils/classNames';

interface ForgotPasswordModalProps {
	isVisible: boolean;
	onClose: () => void;
}

const ForgotPasswordModal: React.FC<
	ForgotPasswordModalProps
> = ({ isVisible, onClose }) => {
	const { isDark } = useTheme();
	const { showSuccess, showError } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [isEmailSent, setIsEmailSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			showError(
				'Invalid Input',
				'Please enter your email address'
			);
			return;
		}

		setIsLoading(true);

		try {
			const result =
				await authService.requestPasswordReset(
					email
				);

			if (result.success) {
				setIsEmailSent(true);
				showSuccess(
					'Email Sent',
					'If an account with that email exists, we sent a password reset link.'
				);
			} else {
				showError('Request Failed', result.message);
			}
		} catch (error) {
			console.error(
				'Password reset request error:',
				error
			);
			showError(
				'Error',
				'An unexpected error occurred'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setEmail('');
		setIsEmailSent(false);
		setIsLoading(false);
		onClose();
	};

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.2 }}
					className={`w-full max-w-md backdrop-blur-lg rounded-3xl border p-6 shadow-2xl ${
						isDark
							? 'bg-white/10 border-white/20'
							: 'bg-white/90 border-gray-200'
					}`}
				>
					{/* Header */}
					<div className='flex items-center justify-between mb-6'>
						<h2
							className={`text-xl font-bold ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							{isEmailSent
								? 'Check Your Email'
								: 'Reset Password'}
						</h2>
						<button
							onClick={handleClose}
							className={`p-2 rounded-lg transition-colors ${
								isDark
									? 'hover:bg-white/10 text-gray-400 hover:text-white'
									: 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
							}`}
						>
							<X className='w-5 h-5' />
						</button>
					</div>

					{!isEmailSent ? (
						<>
							{/* Instructions */}
							<div className='mb-6'>
								<p
									className={`text-sm ${
										isDark
											? 'text-gray-300'
											: 'text-gray-600'
									}`}
								>
									Enter your email address
									and we'll send you a
									link to reset your
									password.
								</p>
							</div>

							{/* Form */}
							<form
								onSubmit={handleSubmit}
								className='space-y-4'
							>
								{/* Email Input */}
								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											isDark
												? 'text-gray-300'
												: 'text-gray-700'
										}`}
									>
										Email Address
									</label>
									<div className='relative'>
										<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
										<input
											type='email'
											value={email}
											onChange={(e) =>
												setEmail(
													e.target
														.value
												)
											}
											className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-sm ${
												isDark
													? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
													: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
											} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all`}
											placeholder='Enter your email address'
											required
										/>
									</div>
								</div>

								{/* Submit Button */}
								<div className='flex gap-3 pt-4'>
									<button
										type='button'
										onClick={
											handleClose
										}
										className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
											isDark
												? 'bg-white/10 text-gray-300 hover:bg-white/20'
												: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
										}`}
									>
										Cancel
									</button>
									<button
										type='submit'
										disabled={
											!email.trim() ||
											isLoading
										}
										className={cn(
											'flex-1 py-3 px-4 rounded-xl font-medium transition-all',
											'bg-gradient-to-r from-chat-pink to-chat-purple text-white',
											email.trim() &&
												!isLoading
												? 'hover:shadow-lg active:scale-95'
												: 'opacity-50 cursor-not-allowed'
										)}
									>
										{isLoading
											? 'Sending...'
											: 'Send Reset Link'}
									</button>
								</div>
							</form>
						</>
					) : (
						<>
							{/* Success State */}
							<div className='text-center'>
								<div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
									<CheckCircle className='w-8 h-8 text-green-600' />
								</div>

								<p
									className={`text-sm mb-6 ${
										isDark
											? 'text-gray-300'
											: 'text-gray-600'
									}`}
								>
									We've sent a password
									reset link to{' '}
									<span className='font-medium text-chat-pink'>
										{email}
									</span>
									. Check your inbox and
									follow the instructions
									to reset your password.
								</p>

								<div
									className={`p-4 rounded-xl mb-6 ${
										isDark
											? 'bg-blue-500/10 border border-blue-500/20'
											: 'bg-blue-50 border border-blue-200'
									}`}
								>
									<p
										className={`text-xs ${
											isDark
												? 'text-blue-300'
												: 'text-blue-700'
										}`}
									>
										<strong>
											Tip:
										</strong>{' '}
										The reset link will
										expire in 1 hour for
										security. If you
										don't see the email,
										check your spam
										folder.
									</p>
								</div>

								<button
									onClick={handleClose}
									className='w-full py-3 px-4 bg-gradient-to-r from-chat-pink to-chat-purple text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95'
								>
									<ArrowLeft className='w-4 h-4 mr-2 inline' />
									Back to Login
								</button>
							</div>
						</>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default ForgotPasswordModal;
