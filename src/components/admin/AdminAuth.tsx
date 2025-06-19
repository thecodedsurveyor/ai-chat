import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
	Shield,
	Eye,
	EyeOff,
	AlertCircle,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { adminService } from '../../services/adminService';
import type { AdminAuthProps } from '../../types/admin';
import { cn } from '../../utils/classNames';

const AdminAuth: React.FC<AdminAuthProps> = ({
	onLoginSuccess,
}) => {
	const { isDark } = useTheme();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (error) setError('');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const result = await adminService.login(
				formData.email,
				formData.password
			);

			if (result.success && result.data) {
				onLoginSuccess(result.data.admin);
			} else {
				setError(result.message || 'Login failed');
			}
		} catch {
			setError('An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div
			className={cn(
				'min-h-screen flex items-center justify-center p-4',
				isDark
					? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
					: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
			)}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className={cn(
					'w-full max-w-md rounded-2xl shadow-2xl border p-8',
					isDark
						? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm'
						: 'bg-white/90 border-gray-200 backdrop-blur-sm'
				)}
			>
				{/* Header */}
				<div className='text-center mb-8'>
					<div
						className={cn(
							'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4',
							'bg-gradient-to-r from-blue-500 to-purple-600'
						)}
					>
						<Shield className='w-8 h-8 text-white' />
					</div>
					<h1
						className={cn(
							'text-2xl font-bold mb-2',
							isDark
								? 'text-white'
								: 'text-gray-900'
						)}
					>
						Admin Portal
					</h1>
					<p
						className={cn(
							'text-sm',
							isDark
								? 'text-gray-300'
								: 'text-gray-600'
						)}
					>
						NeuronFlow Administration Dashboard
					</p>
				</div>

				{/* Test Credentials Info */}
				<div
					className={cn(
						'mb-6 p-4 rounded-lg border-l-4',
						isDark
							? 'bg-blue-900/30 border-blue-500 text-blue-300'
							: 'bg-blue-50 border-blue-500 text-blue-700'
					)}
				>
					<h3 className='font-semibold text-sm mb-2'>
						Test Admin Credentials:
					</h3>
					<div className='text-xs space-y-1'>
						<div>
							Email:{' '}
							<code className='font-mono'>
								admin@neuronflow.ai
							</code>
						</div>
						<div>
							Password:{' '}
							<code className='font-mono'>
								admin123!
							</code>
						</div>
					</div>
				</div>

				{/* Login Form */}
				<form
					onSubmit={handleSubmit}
					className='space-y-6'
				>
					{/* Email Field */}
					<div>
						<label
							className={cn(
								'block text-sm font-medium mb-2',
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							)}
						>
							Email Address
						</label>
						<input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleInputChange}
							required
							className={cn(
								'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2',
								isDark
									? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
									: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
							)}
							placeholder='Enter your admin email'
						/>
					</div>

					{/* Password Field */}
					<div>
						<label
							className={cn(
								'block text-sm font-medium mb-2',
								isDark
									? 'text-gray-300'
									: 'text-gray-700'
							)}
						>
							Password
						</label>
						<div className='relative'>
							<input
								type={
									showPassword
										? 'text'
										: 'password'
								}
								name='password'
								value={formData.password}
								onChange={handleInputChange}
								required
								className={cn(
									'w-full px-4 py-3 pr-12 rounded-lg border transition-colors focus:outline-none focus:ring-2',
									isDark
										? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
										: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
								)}
								placeholder='Enter your password'
							/>
							<button
								type='button'
								onClick={
									togglePasswordVisibility
								}
								className={cn(
									'absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors',
									isDark
										? 'text-gray-400 hover:text-gray-300'
										: 'text-gray-500 hover:text-gray-700'
								)}
							>
								{showPassword ? (
									<EyeOff className='w-5 h-5' />
								) : (
									<Eye className='w-5 h-5' />
								)}
							</button>
						</div>
					</div>

					{/* Error Message */}
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className={cn(
								'flex items-center gap-2 p-3 rounded-lg',
								isDark
									? 'bg-red-900/30 border border-red-500/30 text-red-300'
									: 'bg-red-50 border border-red-200 text-red-700'
							)}
						>
							<AlertCircle className='w-4 h-4 flex-shrink-0' />
							<span className='text-sm'>
								{error}
							</span>
						</motion.div>
					)}

					{/* Submit Button */}
					<button
						type='submit'
						disabled={isLoading}
						className={cn(
							'w-full py-3 rounded-lg font-semibold transition-all duration-200',
							'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
							'hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
							'disabled:opacity-50 disabled:cursor-not-allowed',
							isLoading && 'animate-pulse'
						)}
					>
						{isLoading ? (
							<div className='flex items-center justify-center gap-2'>
								<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
								Signing in...
							</div>
						) : (
							'Sign In to Dashboard'
						)}
					</button>
				</form>

				{/* Security Notice */}
				<div
					className={cn(
						'mt-6 text-center text-xs',
						isDark
							? 'text-gray-400'
							: 'text-gray-500'
					)}
				>
					<Shield className='w-3 h-3 inline mr-1' />
					Secure admin access · All actions are
					logged
				</div>
			</motion.div>
		</div>
	);
};

export default AdminAuth;
