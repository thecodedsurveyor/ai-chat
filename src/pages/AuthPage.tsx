import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
	Mail,
	Lock,
	User,
	Eye,
	EyeOff,
	ArrowRight,
	Shield,
	Heart,
	Star,
	ArrowLeft,
	Check,
	X,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/authService';
import { usePageTitle } from '../hooks/usePageTitle';
import Footer from '../components/layout/Footer';

type AuthMode = 'login' | 'register' | 'forgot-password';

// Password validation interface
interface PasswordValidation {
	minLength: boolean;
	hasUppercase: boolean;
	hasLowercase: boolean;
	hasNumber: boolean;
	hasSpecialChar: boolean;
}

const AuthPage = () => {
	const { isDark } = useTheme();
	const { showSuccess, showError } = useToast();
	const navigate = useNavigate();
	const [authMode, setAuthMode] =
		useState<AuthMode>('login');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		agreeTerms: false,
	});

	// Password validation state
	const [passwordValidation, setPasswordValidation] =
		useState<PasswordValidation>({
			minLength: false,
			hasUppercase: false,
			hasLowercase: false,
			hasNumber: false,
			hasSpecialChar: false,
		});
	const [
		showPasswordRequirements,
		setShowPasswordRequirements,
	] = useState(false);

	// Set page title based on auth mode
	const getAuthTitle = () => {
		switch (authMode) {
			case 'register':
				return 'Create Your AI Chat Account';
			case 'forgot-password':
				return 'Reset Your Password – AI Chat';
			default:
				return 'Sign in or Create an Account';
		}
	};

	usePageTitle(getAuthTitle());

	// Validate password in real-time
	const validatePassword = (
		password: string
	): PasswordValidation => {
		return {
			minLength: password.length >= 8,
			hasUppercase: /[A-Z]/.test(password),
			hasLowercase: /[a-z]/.test(password),
			hasNumber: /\d/.test(password),
			hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(
				password
			),
		};
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));

		// Real-time password validation
		if (name === 'password') {
			const validation = validatePassword(value);
			setPasswordValidation(validation);
			setShowPasswordRequirements(true);
		}
	};

	const resetForm = () => {
		setFormData({
			email: '',
			password: '',
			confirmPassword: '',
			firstName: '',
			lastName: '',
			agreeTerms: false,
		});
		setShowPassword(false);
		setShowConfirmPassword(false);
		setShowPasswordRequirements(false);
		setPasswordValidation({
			minLength: false,
			hasUppercase: false,
			hasLowercase: false,
			hasNumber: false,
			hasSpecialChar: false,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (authMode === 'register') {
				// Validation
				if (
					formData.password !==
					formData.confirmPassword
				) {
					showError(
						'Password Mismatch',
						'Passwords do not match'
					);
					return;
				}

				if (!formData.agreeTerms) {
					showError(
						'Terms Required',
						'Please agree to the terms and conditions'
					);
					return;
				}

				const result = await authService.register({
					email: formData.email,
					password: formData.password,
					firstName: formData.firstName,
					lastName: formData.lastName,
				});

				if (result.success) {
					showSuccess(
						'Registration Successful!',
						'Welcome to AI Chat'
					);
					navigate('/ai-chat');
				} else {
					showError(
						'Registration Failed',
						getSpecificErrorMessage(
							result.message
						)
					);
				}
			} else if (authMode === 'login') {
				const result = await authService.login({
					email: formData.email,
					password: formData.password,
				});

				if (result.success) {
					showSuccess(
						'Login Successful!',
						'Welcome back'
					);
					navigate('/ai-chat');
				} else {
					showError(
						'Login Failed',
						getSpecificErrorMessage(
							result.message
						)
					);
				}
			} else if (authMode === 'forgot-password') {
				// Validate email
				if (!formData.email.trim()) {
					showError(
						'Invalid Input',
						'Please enter your email address'
					);
					return;
				}

				try {
					const result =
						await authService.requestPasswordReset(
							formData.email
						);

					if (result.success) {
						showSuccess(
							'Reset Email Sent',
							'If an account with that email exists, we sent a password reset link. Please check your inbox.'
						);
						// Switch back to login mode after successful request
						setTimeout(() => {
							switchAuthMode('login');
						}, 3000);
					} else {
						showError(
							'Request Failed',
							result.message
						);
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
				}
			}
		} catch (error) {
			console.error('Auth error:', error);
			showError(
				'Error',
				'An unexpected error occurred'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const switchAuthMode = (mode: AuthMode) => {
		setAuthMode(mode);
		resetForm();
	};

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
			},
		},
		exit: {
			opacity: 0,
			y: -20,
			transition: { duration: 0.4 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 300 : -300,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? 300 : -300,
			opacity: 0,
		}),
	};

	const getFormTitle = () => {
		switch (authMode) {
			case 'register':
				return 'Create Account';
			case 'forgot-password':
				return 'Reset Password';
			default:
				return 'Welcome Back';
		}
	};

	const getSubmitButtonText = () => {
		if (isLoading) return 'Please wait...';
		switch (authMode) {
			case 'register':
				return 'Create Account';
			case 'forgot-password':
				return 'Send Reset Link';
			default:
				return 'Sign In';
		}
	};

	// Extract specific error message from backend response
	const getSpecificErrorMessage = (
		message: string
	): string => {
		// If the message contains validation details, extract them
		if (message.includes('Password must contain')) {
			return message;
		}
		if (message.includes('Email')) {
			return message;
		}
		if (
			message.includes('validation failed') ||
			message.includes('Validation failed')
		) {
			return 'Please check your input and try again. Make sure your password meets all requirements.';
		}
		return message;
	};

	return (
		<div
			className={`min-h-screen flex flex-col ${
				isDark
					? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
					: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
			}`}
		>
			{/* Background Elements */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				{Array.from({ length: 20 }, (_, i) => (
					<motion.div
						key={i}
						className={`absolute w-2 h-2 rounded-full ${
							isDark
								? 'bg-white/10'
								: 'bg-purple-400/20'
						}`}
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							y: [0, -20, 0],
							opacity: [0.3, 0.8, 0.3],
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: 4 + i * 0.2,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: i * 0.1,
						}}
					/>
				))}
			</div>

			{/* Main Content */}
			<div className='flex-1 flex items-center justify-center px-6 py-12'>
				<div className='w-full max-w-6xl mx-auto'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
						{/* Left Side - Branding and Benefits */}
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.8,
								delay: 0.2,
							}}
							className='text-center lg:text-left'
						>
							<motion.div
								initial={{
									scale: 0.8,
									opacity: 0,
								}}
								animate={{
									scale: 1,
									opacity: 1,
								}}
								transition={{
									duration: 0.6,
									delay: 0.4,
								}}
								className='mb-8'
							>
								<div className='w-16 h-16 mx-auto lg:mx-0 text-5xl mb-6 flex items-center justify-center'>
									🤖
								</div>
								<h1
									className={`text-4xl md:text-6xl font-exo font-bold mb-6 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Welcome to{' '}
									<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
										NeuronFlow
									</span>
								</h1>
								<p
									className={`text-xl leading-relaxed mb-8 ${
										isDark
											? 'text-gray-300'
											: 'text-gray-600'
									}`}
								>
									Join thousands of users
									experiencing the future
									of AI conversation with
									advanced features and
									personalized
									interactions.
								</p>
							</motion.div>

							{/* Benefits */}
							<motion.div
								initial={{
									opacity: 0,
									y: 30,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								transition={{
									duration: 0.6,
									delay: 0.6,
								}}
								className='space-y-4'
							>
								{[
									{
										icon: Shield,
										text: 'Secure & Private',
										color: 'text-green-500',
									},
									{
										icon: Heart,
										text: 'Easy to Use',
										color: 'text-red-500',
									},
									{
										icon: Star,
										text: 'Premium Features',
										color: 'text-yellow-500',
									},
								].map((benefit, index) => (
									<motion.div
										key={index}
										initial={{
											opacity: 0,
											x: -20,
										}}
										animate={{
											opacity: 1,
											x: 0,
										}}
										transition={{
											duration: 0.4,
											delay:
												0.8 +
												index * 0.1,
										}}
										className='flex items-center gap-3'
									>
										<benefit.icon
											className={`w-5 h-5 ${benefit.color}`}
										/>
										<span
											className={`${
												isDark
													? 'text-gray-300'
													: 'text-gray-600'
											}`}
										>
											{benefit.text}
										</span>
									</motion.div>
								))}
							</motion.div>
						</motion.div>

						{/* Right Side - Auth Forms */}
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.8,
								delay: 0.4,
							}}
							className='relative'
						>
							<div
								className={`backdrop-blur-lg rounded-3xl border p-8 shadow-2xl ${
									isDark
										? 'bg-white/10 border-white/20'
										: 'bg-white/80 border-gray-200'
								}`}
							>
								{/* Form Header */}
								<div className='mb-8'>
									{authMode ===
										'forgot-password' && (
										<button
											onClick={() =>
												switchAuthMode(
													'login'
												)
											}
											className={`flex items-center gap-2 mb-4 text-sm ${
												isDark
													? 'text-gray-300 hover:text-white'
													: 'text-gray-600 hover:text-gray-800'
											} transition-colors`}
										>
											<ArrowLeft className='w-4 h-4' />
											Back to Login
										</button>
									)}

									<h2
										className={`text-2xl font-bold mb-2 ${
											isDark
												? 'text-white'
												: 'text-gray-800'
										}`}
									>
										{getFormTitle()}
									</h2>

									{authMode ===
										'forgot-password' && (
										<p
											className={`text-sm ${
												isDark
													? 'text-gray-300'
													: 'text-gray-600'
											}`}
										>
											Enter your email
											address and
											we'll send you a
											link to reset
											your password.
										</p>
									)}
								</div>

								{/* Form Toggle Buttons (only for login/register) */}
								{authMode !==
									'forgot-password' && (
									<div
										className={`flex rounded-2xl p-1 mb-8 ${
											isDark
												? 'bg-white/10'
												: 'bg-gray-100'
										}`}
									>
										<button
											onClick={() =>
												switchAuthMode(
													'login'
												)
											}
											className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
												authMode ===
												'login'
													? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white shadow-lg'
													: isDark
													? 'text-gray-300 hover:text-white'
													: 'text-gray-600 hover:text-gray-800'
											}`}
										>
											Login
										</button>
										<button
											onClick={() =>
												switchAuthMode(
													'register'
												)
											}
											className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
												authMode ===
												'register'
													? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white shadow-lg'
													: isDark
													? 'text-gray-300 hover:text-white'
													: 'text-gray-600 hover:text-gray-800'
											}`}
										>
											Register
										</button>
									</div>
								)}

								{/* Form Container with Animation */}
								<div className='relative overflow-hidden'>
									<AnimatePresence
										mode='wait'
										custom={
											authMode ===
											'login'
												? -1
												: 1
										}
									>
										<motion.div
											key={authMode}
											custom={
												authMode ===
												'login'
													? -1
													: 1
											}
											variants={
												slideVariants
											}
											initial='enter'
											animate='center'
											exit='exit'
											transition={{
												x: {
													type: 'spring',
													stiffness: 300,
													damping: 30,
												},
												opacity: {
													duration: 0.2,
												},
											}}
										>
											<form
												onSubmit={
													handleSubmit
												}
												className='space-y-6'
											>
												{/* Registration Fields */}
												{authMode ===
													'register' && (
													<motion.div
														variants={
															containerVariants
														}
														initial='hidden'
														animate='visible'
														className='grid grid-cols-1 md:grid-cols-2 gap-4'
													>
														<motion.div
															variants={
																itemVariants
															}
														>
															<label
																className={`block text-sm font-medium mb-2 ${
																	isDark
																		? 'text-gray-300'
																		: 'text-gray-700'
																}`}
															>
																First
																Name
															</label>
															<div className='relative'>
																<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
																<input
																	type='text'
																	name='firstName'
																	value={
																		formData.firstName
																	}
																	onChange={
																		handleInputChange
																	}
																	className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-sm ${
																		isDark
																			? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
																			: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
																	} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all`}
																	placeholder='John'
																	required
																/>
															</div>
														</motion.div>

														<motion.div
															variants={
																itemVariants
															}
														>
															<label
																className={`block text-sm font-medium mb-2 ${
																	isDark
																		? 'text-gray-300'
																		: 'text-gray-700'
																}`}
															>
																Last
																Name
															</label>
															<div className='relative'>
																<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
																<input
																	type='text'
																	name='lastName'
																	value={
																		formData.lastName
																	}
																	onChange={
																		handleInputChange
																	}
																	className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-sm ${
																		isDark
																			? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
																			: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
																	} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all`}
																	placeholder='Doe'
																	required
																/>
															</div>
														</motion.div>
													</motion.div>
												)}

												{/* Email Field */}
												<motion.div
													variants={
														itemVariants
													}
												>
													<label
														className={`block text-sm font-medium mb-2 ${
															isDark
																? 'text-gray-300'
																: 'text-gray-700'
														}`}
													>
														Email
														Address
													</label>
													<div className='relative'>
														<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
														<input
															type='email'
															name='email'
															value={
																formData.email
															}
															onChange={
																handleInputChange
															}
															className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-sm ${
																isDark
																	? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
																	: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
															} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all`}
															placeholder='john@example.com'
															required
														/>
													</div>
												</motion.div>

												{/* Password Field (not for forgot password) */}
												{authMode !==
													'forgot-password' && (
													<motion.div
														variants={
															itemVariants
														}
													>
														<label
															className={`block text-sm font-medium mb-2 ${
																isDark
																	? 'text-gray-300'
																	: 'text-gray-700'
															}`}
														>
															Password
														</label>
														<div className='relative'>
															<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
															<input
																type={
																	showPassword
																		? 'text'
																		: 'password'
																}
																name='password'
																value={
																	formData.password
																}
																onChange={
																	handleInputChange
																}
																className={`w-full pl-10 pr-12 py-3 rounded-xl border backdrop-blur-sm ${
																	isDark
																		? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
																		: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
																} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all`}
																placeholder='••••••••'
																required
															/>
															<button
																type='button'
																onClick={() =>
																	setShowPassword(
																		!showPassword
																	)
																}
																className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
															>
																{showPassword ? (
																	<EyeOff className='w-5 h-5' />
																) : (
																	<Eye className='w-5 h-5' />
																)}
															</button>
														</div>
													</motion.div>
												)}

												{/* Password Requirements (Registration only) */}
												{authMode ===
													'register' &&
													showPasswordRequirements &&
													formData.password && (
														<motion.div
															variants={
																itemVariants
															}
															className={`p-4 rounded-xl border ${
																isDark
																	? 'bg-white/5 border-white/10'
																	: 'bg-gray-50 border-gray-200'
															}`}
														>
															<p
																className={`text-sm font-medium mb-3 ${
																	isDark
																		? 'text-gray-300'
																		: 'text-gray-700'
																}`}
															>
																Password
																Requirements:
															</p>
															<div className='grid grid-cols-1 gap-2'>
																<div className='flex items-center gap-2'>
																	{passwordValidation.minLength ? (
																		<Check className='w-4 h-4 text-green-500' />
																	) : (
																		<X className='w-4 h-4 text-red-500' />
																	)}
																	<span
																		className={`text-sm ${
																			passwordValidation.minLength
																				? 'text-green-500'
																				: isDark
																				? 'text-gray-400'
																				: 'text-gray-600'
																		}`}
																	>
																		At
																		least
																		8
																		characters
																	</span>
																</div>
																<div className='flex items-center gap-2'>
																	{passwordValidation.hasUppercase ? (
																		<Check className='w-4 h-4 text-green-500' />
																	) : (
																		<X className='w-4 h-4 text-red-500' />
																	)}
																	<span
																		className={`text-sm ${
																			passwordValidation.hasUppercase
																				? 'text-green-500'
																				: isDark
																				? 'text-gray-400'
																				: 'text-gray-600'
																		}`}
																	>
																		One
																		uppercase
																		letter
																	</span>
																</div>
																<div className='flex items-center gap-2'>
																	{passwordValidation.hasLowercase ? (
																		<Check className='w-4 h-4 text-green-500' />
																	) : (
																		<X className='w-4 h-4 text-red-500' />
																	)}
																	<span
																		className={`text-sm ${
																			passwordValidation.hasLowercase
																				? 'text-green-500'
																				: isDark
																				? 'text-gray-400'
																				: 'text-gray-600'
																		}`}
																	>
																		One
																		lowercase
																		letter
																	</span>
																</div>
																<div className='flex items-center gap-2'>
																	{passwordValidation.hasNumber ? (
																		<Check className='w-4 h-4 text-green-500' />
																	) : (
																		<X className='w-4 h-4 text-red-500' />
																	)}
																	<span
																		className={`text-sm ${
																			passwordValidation.hasNumber
																				? 'text-green-500'
																				: isDark
																				? 'text-gray-400'
																				: 'text-gray-600'
																		}`}
																	>
																		One
																		number
																	</span>
																</div>
																<div className='flex items-center gap-2'>
																	{passwordValidation.hasSpecialChar ? (
																		<Check className='w-4 h-4 text-green-500' />
																	) : (
																		<X className='w-4 h-4 text-red-500' />
																	)}
																	<span
																		className={`text-sm ${
																			passwordValidation.hasSpecialChar
																				? 'text-green-500'
																				: isDark
																				? 'text-gray-400'
																				: 'text-gray-600'
																		}`}
																	>
																		One
																		special
																		character
																		(!@#$%^&*(),.?":
																		{}
																		|&lt;&gt;)
																	</span>
																</div>
															</div>
														</motion.div>
													)}

												{/* Confirm Password Field (Registration only) */}
												{authMode ===
													'register' && (
													<motion.div
														variants={
															itemVariants
														}
													>
														<label
															className={`block text-sm font-medium mb-2 ${
																isDark
																	? 'text-gray-300'
																	: 'text-gray-700'
															}`}
														>
															Confirm
															Password
														</label>
														<div className='relative'>
															<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
															<input
																type={
																	showConfirmPassword
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
																} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all`}
																placeholder='••••••••'
																required
															/>
															<button
																type='button'
																onClick={() =>
																	setShowConfirmPassword(
																		!showConfirmPassword
																	)
																}
																className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
															>
																{showConfirmPassword ? (
																	<EyeOff className='w-5 h-5' />
																) : (
																	<Eye className='w-5 h-5' />
																)}
															</button>
														</div>
													</motion.div>
												)}

												{/* Terms Agreement (Registration only) */}
												{authMode ===
													'register' && (
													<motion.div
														variants={
															itemVariants
														}
														className='flex items-start gap-3'
													>
														<input
															type='checkbox'
															name='agreeTerms'
															checked={
																formData.agreeTerms
															}
															onChange={
																handleInputChange
															}
															className='w-5 h-5 text-chat-pink focus:ring-chat-pink/50 focus:ring-2 rounded border-gray-300'
															required
														/>
														<label
															className={`text-sm ${
																isDark
																	? 'text-gray-300'
																	: 'text-gray-600'
															}`}
														>
															I
															agree
															to
															the{' '}
															<a
																href='/terms'
																className='text-chat-pink hover:underline'
															>
																Terms
																of
																Service
															</a>{' '}
															and{' '}
															<a
																href='/privacy'
																className='text-chat-pink hover:underline'
															>
																Privacy
																Policy
															</a>
														</label>
													</motion.div>
												)}

												{/* Remember Me / Forgot Password (Login only) */}
												{authMode ===
													'login' && (
													<motion.div
														variants={
															itemVariants
														}
														className='flex items-center justify-between'
													>
														<label className='flex items-center gap-2'>
															<input
																type='checkbox'
																className='w-4 h-4 text-chat-pink focus:ring-chat-pink/50 focus:ring-2 rounded border-gray-300'
															/>
															<span
																className={`text-sm ${
																	isDark
																		? 'text-gray-300'
																		: 'text-gray-600'
																}`}
															>
																Remember
																me
															</span>
														</label>
														<button
															type='button'
															onClick={() =>
																switchAuthMode(
																	'forgot-password'
																)
															}
															className='text-sm text-chat-pink hover:underline'
														>
															Forgot
															password?
														</button>
													</motion.div>
												)}

												{/* Submit Button */}
												<motion.button
													variants={
														itemVariants
													}
													type='submit'
													disabled={
														isLoading
													}
													className='w-full bg-gradient-to-r from-chat-pink to-chat-purple text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-chat-pink/30 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed'
													whileHover={{
														scale: isLoading
															? 1
															: 1.02,
													}}
													whileTap={{
														scale: isLoading
															? 1
															: 0.98,
													}}
												>
													{getSubmitButtonText()}
													{!isLoading && (
														<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
													)}
												</motion.button>
											</form>
										</motion.div>
									</AnimatePresence>
								</div>

								{/* Social Login Options (only for login/register) */}
								{authMode !==
									'forgot-password' && (
									<motion.div
										initial={{
											opacity: 0,
											y: 20,
										}}
										animate={{
											opacity: 1,
											y: 0,
										}}
										transition={{
											duration: 0.6,
											delay: 0.8,
										}}
										className='mt-8'
									>
										<div className='relative'>
											<div className='absolute inset-0 flex items-center'>
												<div
													className={`w-full border-t ${
														isDark
															? 'border-gray-600'
															: 'border-gray-300'
													}`}
												/>
											</div>
											<div className='relative flex justify-center text-sm'>
												<span
													className={`px-4 ${
														isDark
															? 'bg-chat-secondary rounded-full text-2xl py-2 px-4 text-gray-300'
															: 'bg-white rounded-full text-2xl text-gray-500 py-2 px-4'
													}`}
												>
													Or
												</span>
											</div>
										</div>

										<div className='mt-6 grid grid-cols-1 gap-3'>
											<button
												className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
													isDark
														? 'border-white/20 hover:bg-white/10 text-white'
														: 'border-gray-300 hover:bg-gray-50 text-gray-700'
												}`}
											>
												<svg
													className='w-5 h-5'
													viewBox='0 0 24 24'
												>
													<path
														fill='currentColor'
														d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
													/>
													<path
														fill='currentColor'
														d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
													/>
													<path
														fill='currentColor'
														d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
													/>
													<path
														fill='currentColor'
														d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
													/>
												</svg>
												Continue
												with Google
											</button>
										</div>
									</motion.div>
								)}
							</div>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default AuthPage;
