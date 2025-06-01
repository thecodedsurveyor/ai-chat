import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, X, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/authService';
import { cn } from '../../utils/classNames';

interface ChangePasswordModalProps {
	isVisible: boolean;
	onClose: () => void;
}

interface PasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

const ChangePasswordModal: React.FC<
	ChangePasswordModalProps
> = ({ isVisible, onClose }) => {
	const { isDark } = useTheme();
	const { showSuccess, showError } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	});
	const [formData, setFormData] =
		useState<PasswordFormData>({
			currentPassword: '',
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
		field: 'current' | 'new' | 'confirm'
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
		formData.currentPassword &&
		isPasswordValid &&
		passwordsMatch;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isFormValid) {
			showError(
				'Invalid Input',
				'Please check all fields and requirements'
			);
			return;
		}

		setIsLoading(true);

		try {
			const result = await authService.changePassword(
				{
					currentPassword:
						formData.currentPassword,
					newPassword: formData.newPassword,
				}
			);

			if (result.success) {
				showSuccess(
					'Password Changed',
					'Your password has been successfully updated. You may need to log in again.'
				);
				handleClose();
			} else {
				showError('Change Failed', result.message);
			}
		} catch (error) {
			console.error('Change password error:', error);
			showError(
				'Error',
				'An unexpected error occurred'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});
		setPasswordValidation({
			length: false,
			uppercase: false,
			lowercase: false,
			number: false,
			special: false,
		});
		setShowPasswords({
			current: false,
			new: false,
			confirm: false,
		});
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
							Change Password
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

					{/* Form */}
					<form
						onSubmit={handleSubmit}
						className='space-y-4'
					>
						{/* Current Password */}
						<div>
							<label
								className={`block text-sm font-medium mb-2 ${
									isDark
										? 'text-gray-300'
										: 'text-gray-700'
								}`}
							>
								Current Password
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
								<input
									type={
										showPasswords.current
											? 'text'
											: 'password'
									}
									name='currentPassword'
									value={
										formData.currentPassword
									}
									onChange={
										handleInputChange
									}
									className={`w-full pl-10 pr-12 py-3 rounded-xl border backdrop-blur-sm ${
										isDark
											? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
											: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
									} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all`}
									placeholder='Enter current password'
									required
								/>
								<button
									type='button'
									onClick={() =>
										togglePasswordVisibility(
											'current'
										)
									}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
								>
									{showPasswords.current ? (
										<EyeOff className='w-5 h-5' />
									) : (
										<Eye className='w-5 h-5' />
									)}
								</button>
							</div>
						</div>

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
									Password Requirements:
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
											key={req.key}
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
												{req.label}
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
						<div className='flex gap-3 pt-4'>
							<button
								type='button'
								onClick={handleClose}
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
									!isFormValid ||
									isLoading
								}
								className={cn(
									'flex-1 py-3 px-4 rounded-xl font-medium transition-all',
									'bg-gradient-to-r from-chat-pink to-chat-purple text-white',
									isFormValid &&
										!isLoading
										? 'hover:shadow-lg active:scale-95'
										: 'opacity-50 cursor-not-allowed'
								)}
							>
								{isLoading
									? 'Changing...'
									: 'Change Password'}
							</button>
						</div>
					</form>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default ChangePasswordModal;
