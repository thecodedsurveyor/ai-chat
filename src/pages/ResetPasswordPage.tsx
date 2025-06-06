import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import {
	Lock,
	Eye,
	EyeOff,
	ArrowLeft,
	AlertCircle,
	Check,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/authService';
import Footer from '../components/layout/Footer';
import { cn } from '../utils/classNames';

const ResetPasswordPage: React.FC = () => {
	const { isDark } = useTheme();
	const { showSuccess, showError } = useToast();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [isLoading, setIsLoading] = useState(false);
	const [showPasswords, setShowPasswords] = useState({
		new: false,
		confirm: false,
	});
	const [formData, setFormData] = useState({
		newPassword: '',
		confirmPassword: '',
	});
	const [passwordValidation, setPasswordValidation] =
		useState({
			length: false,
			uppercase: false,
			lowercase: false,
			number: false,
			special: false,
		});
	const [isTokenValid, setIsTokenValid] = useState<
		boolean | null
	>(null);
	const [canResend, setCanResend] = useState(false);
	const [resendLoading, setResendLoading] =
		useState(false);
	const [resendTimer, setResendTimer] = useState(60);

	// Get token and email from URL parameters
	const token = searchParams.get('token');
	const email = searchParams.get('email');

	useEffect(() => {
		// Validate token and email presence
		if (!token || !email) {
			setIsTokenValid(false);
		} else {
			setIsTokenValid(true);
		}
	}, [token, email]);

	// Start timer for resend button
	useEffect(() => {
		if (!email || !token) return;
		setCanResend(false);
		setResendTimer(60);
		const interval = setInterval(() => {
			setResendTimer((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [email, token]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Validate new password in real-time
		if (name === 'newPassword') {
			setPasswordValidation({
				length: value.length >= 8,
				uppercase: /[A-Z]/.test(value),
				lowercase: /[a-z]/.test(value),
				number: /\d/.test(value),
				special:
					/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/]/.test(
						value
					),
			});
		}
	};

	const togglePasswordVisibility = (
		field: 'new' | 'confirm'
	) => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const isPasswordValid = Object.values(
		passwordValidation
	).every(Boolean);
	const passwordsMatch =
		formData.newPassword === formData.confirmPassword;
	const isFormValid =
		isPasswordValid &&
		passwordsMatch &&
		formData.newPassword &&
		formData.confirmPassword;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isFormValid || !token || !email) {
			showError(
				'Invalid Input',
				'Please check all fields and requirements'
			);
			return;
		}

		setIsLoading(true);

		try {
			const result =
				await authService.resetPasswordWithToken(
					token,
					email,
					formData.newPassword
				);

			if (result.success) {
				showSuccess(
					'Password Reset Successfully',
					'Your password has been reset. You can now login with your new password.'
				);
				// Redirect to login page after a short delay
				setTimeout(() => {
					navigate('/auth');
				}, 2000);
			} else {
				showError('Reset Failed', result.message);
			}
		} catch (error) {
			console.error('Reset password error:', error);
			showError(
				'Error',
				'An unexpected error occurred'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResend = async () => {
		if (!email) return;
		setResendLoading(true);
		try {
			const result =
				await authService.requestPasswordReset(
					email
				);
			if (result.success) {
				showSuccess(
					'Reset Email Sent',
					'If an account with that email exists, we sent a password reset link.'
				);
				setCanResend(false);
				setResendTimer(60);
				// Restart timer
				const interval = setInterval(() => {
					setResendTimer((prev) => {
						if (prev <= 1) {
							clearInterval(interval);
							setCanResend(true);
							return 0;
						}
						return prev - 1;
					});
				}, 1000);
			} else {
				showError('Resend Failed', result.message);
			}
		} catch (error) {
			showError(
				'Error',
				'An unexpected error occurred'
			);
		} finally {
			setResendLoading(false);
		}
	};

	if (isTokenValid === null) {
		return (
			<div
				className={`min-h-screen flex items-center justify-center ${
					isDark
						? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
						: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
				}`}
			>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-chat-pink mx-auto'></div>
					<p
						className={`mt-4 ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
					>
						Validating reset link...
					</p>
				</div>
			</div>
		);
	}

	if (!isTokenValid) {
		return (
			<div
				className={`min-h-screen ${
					isDark
						? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
						: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
				}`}
			>
				{/* Header */}
				<div className='relative'>
					<div className='absolute top-6 left-6 z-10'>
						<button
							onClick={() =>
								navigate('/auth')
							}
							className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
								isDark
									? 'bg-white/10 hover:bg-white/20 text-white'
									: 'bg-white/80 hover:bg-white text-gray-800'
							} backdrop-blur-sm border ${
								isDark
									? 'border-white/20'
									: 'border-gray-200'
							}`}
						>
							<ArrowLeft className='w-4 h-4' />
							<span>Back to Login</span>
						</button>
					</div>
				</div>

				{/* Error Content */}
				<div className='flex items-center justify-center min-h-screen px-6 py-12'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='w-full max-w-md'
					>
						<div
							className={`backdrop-blur-lg rounded-3xl border p-8 shadow-2xl text-center ${
								isDark
									? 'bg-white/10 border-white/20'
									: 'bg-white/80 border-gray-200'
							}`}
						>
							<div className='mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6'>
								<AlertCircle className='w-8 h-8 text-red-600' />
							</div>

							<h1
								className={`text-2xl font-bold mb-4 ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								Invalid Reset Link
							</h1>

							<p
								className={`text-sm mb-6 ${
									isDark
										? 'text-gray-300'
										: 'text-gray-600'
								}`}
							>
								This password reset link is
								invalid or has expired.
								Please request a new
								password reset.
							</p>

							<button
								onClick={() =>
									navigate('/auth')
								}
								className='w-full py-3 px-4 bg-gradient-to-r from-chat-pink to-chat-purple text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95'
							>
								Go to Login
							</button>
						</div>
					</motion.div>
				</div>

				<Footer />
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen ${
				isDark
					? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
					: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
			}`}
		>
			{/* Header */}
			<div className='relative'>
				<div className='absolute top-6 left-6 z-10'>
					<button
						onClick={() => navigate('/auth')}
						className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
							isDark
								? 'bg-white/10 hover:bg-white/20 text-white'
								: 'bg-white/80 hover:bg-white text-gray-800'
						} backdrop-blur-sm border ${
							isDark
								? 'border-white/20'
								: 'border-gray-200'
						}`}
					>
						<ArrowLeft className='w-4 h-4' />
						<span>Back to Login</span>
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className='flex items-center justify-center min-h-screen px-6 py-12'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='w-full max-w-md'
				>
					<div
						className={`backdrop-blur-lg rounded-3xl border p-8 shadow-2xl ${
							isDark
								? 'bg-white/10 border-white/20'
								: 'bg-white/80 border-gray-200'
						}`}
					>
						{/* Header */}
						<div className='text-center mb-8'>
							<div
								className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-4 ${
									isDark
										? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
										: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
								}`}
							>
								🔐
							</div>
							<h1
								className={`text-2xl font-bold mb-2 ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								Reset Your Password
							</h1>
							<p
								className={`text-sm ${
									isDark
										? 'text-gray-300'
										: 'text-gray-600'
								}`}
							>
								Enter your new password
								below
							</p>
						</div>

						{/* Form */}
						<form
							onSubmit={handleSubmit}
							className='space-y-4'
						>
							{/* New Password */}
							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									}`}
								>
									New Password
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
									<input
										type={
											showPasswords.new
												? 'text'
												: 'password'
										}
										name='newPassword'
										value={
											formData.newPassword
										}
										onChange={
											handleInputChange
										}
										className={`w-full pl-10 pr-12 py-3 rounded-xl border backdrop-blur-sm ${
											isDark
												? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
												: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
										} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all`}
										placeholder='Enter new password'
										required
									/>
									<button
										type='button'
										onClick={() =>
											togglePasswordVisibility(
												'new'
											)
										}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
									>
										{showPasswords.new ? (
											<EyeOff className='w-5 h-5' />
										) : (
											<Eye className='w-5 h-5' />
										)}
									</button>
								</div>
							</div>

							{/* Password Requirements */}
							{formData.newPassword && (
								<div
									className={`p-3 rounded-lg ${
										isDark
											? 'bg-white/5'
											: 'bg-gray-50'
									}`}
								>
									<p
										className={`text-xs font-medium mb-2 ${
											isDark
												? 'text-gray-300'
												: 'text-gray-700'
										}`}
									>
										Password
										Requirements:
									</p>
									<div className='grid grid-cols-2 gap-2 text-xs'>
										{[
											{
												key: 'length',
												label: 'At least 8 characters',
											},
											{
												key: 'uppercase',
												label: 'Uppercase letter',
											},
											{
												key: 'lowercase',
												label: 'Lowercase letter',
											},
											{
												key: 'number',
												label: 'Number',
											},
											{
												key: 'special',
												label: 'Special character',
											},
										].map((req) => (
											<div
												key={
													req.key
												}
												className={cn(
													'flex items-center gap-1',
													passwordValidation[
														req.key as keyof typeof passwordValidation
													]
														? 'text-green-500'
														: isDark
														? 'text-gray-400'
														: 'text-gray-500'
												)}
											>
												<Check
													className={cn(
														'w-3 h-3',
														passwordValidation[
															req.key as keyof typeof passwordValidation
														]
															? 'opacity-100'
															: 'opacity-30'
													)}
												/>
												<span>
													{
														req.label
													}
												</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Confirm Password */}
							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									}`}
								>
									Confirm New Password
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
									<input
										type={
											showPasswords.confirm
												? 'text'
												: 'password'
										}
										name='confirmPassword'
										value={
											formData.confirmPassword
										}
										onChange={
											handleInputChange
										}
										className={`w-full pl-10 pr-12 py-3 rounded-xl border backdrop-blur-sm ${
											isDark
												? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
												: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
										} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all ${
											formData.confirmPassword &&
											!passwordsMatch
												? 'border-red-500 focus:ring-red-500/50'
												: ''
										}`}
										placeholder='Confirm new password'
										required
									/>
									<button
										type='button'
										onClick={() =>
											togglePasswordVisibility(
												'confirm'
											)
										}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
									>
										{showPasswords.confirm ? (
											<EyeOff className='w-5 h-5' />
										) : (
											<Eye className='w-5 h-5' />
										)}
									</button>
								</div>
								{formData.confirmPassword &&
									!passwordsMatch && (
										<p className='text-red-500 text-xs mt-1'>
											Passwords do not
											match
										</p>
									)}
							</div>

							{/* Submit Button */}
							<div className='pt-4'>
								<button
									type='submit'
									disabled={
										!isFormValid ||
										isLoading
									}
									className={cn(
										'w-full py-3 px-4 rounded-xl font-medium transition-all',
										'bg-gradient-to-r from-chat-pink to-chat-purple text-white',
										isFormValid &&
											!isLoading
											? 'hover:shadow-lg active:scale-95'
											: 'opacity-50 cursor-not-allowed'
									)}
								>
									{isLoading
										? 'Resetting Password...'
										: 'Reset Password'}
								</button>
							</div>
						</form>

						{/* Below the form, before <Footer /> */}
						<div className='flex flex-col items-center mt-6'>
							{!canResend ? (
								<p
									className={`text-xs ${
										isDark
											? 'text-gray-400'
											: 'text-gray-600'
									}`}
								>
									Didn't receive the
									email? You can resend in{' '}
									{resendTimer}s
								</p>
							) : (
								<button
									onClick={handleResend}
									disabled={resendLoading}
									className={cn(
										'mt-2 py-2 px-6 rounded-xl font-medium transition-all',
										'bg-gradient-to-r from-chat-pink to-chat-purple text-white',
										resendLoading
											? 'opacity-50 cursor-not-allowed'
											: 'hover:shadow-lg active:scale-95'
									)}
								>
									{resendLoading
										? 'Resending...'
										: 'Resend Email'}
								</button>
							)}
						</div>
					</div>
				</motion.div>
			</div>

			<Footer />
		</div>
	);
};

export default ResetPasswordPage;
