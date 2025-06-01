import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
	User,
	Mail,
	Calendar,
	Edit3,
	Save,
	X,
	ArrowLeft,
	Shield,
	Lock,
	Eye,
	EyeOff,
	ChevronDown,
	ChevronUp,
	Check,
	AlertTriangle,
	Trash2,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/authService';
import { usePageTitle } from '../hooks/usePageTitle';
import Footer from '../components/layout/Footer';

// Password validation interface (reused from AuthPage)
interface PasswordValidation {
	minLength: boolean;
	hasUppercase: boolean;
	hasLowercase: boolean;
	hasNumber: boolean;
	hasSpecialChar: boolean;
}

// Change password form data interface
interface ChangePasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

const ProfilePage: React.FC = () => {
	const { isDark } = useTheme();
	const { showSuccess, showError } = useToast();
	const navigate = useNavigate();
	const user = authService.getUser();

	// Set page title
	usePageTitle('Profile');

	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		email: user?.email || '',
	});

	// Change password state
	const [showChangePassword, setShowChangePassword] =
		useState(false);
	const [changePasswordData, setChangePasswordData] =
		useState<ChangePasswordFormData>({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	});
	const [passwordValidation, setPasswordValidation] =
		useState<PasswordValidation>({
			minLength: false,
			hasUppercase: false,
			hasLowercase: false,
			hasNumber: false,
			hasSpecialChar: false,
		});
	const [isChangingPassword, setIsChangingPassword] =
		useState(false);

	// Deactivate account state
	const [
		showDeleteConfirmation,
		setShowDeleteConfirmation,
	] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] =
		useState('');

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!user) {
			navigate('/auth');
		}
	}, [user, navigate]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = async () => {
		try {
			// Use the new authService.updateProfile method
			const result = await authService.updateProfile({
				firstName: formData.firstName,
				lastName: formData.lastName,
				// Note: email updates may require additional verification
				// For now, we'll only update firstName and lastName
			});

			if (result.success) {
				showSuccess(
					'Profile Updated',
					'Your profile has been successfully updated'
				);
				setIsEditing(false);

				// Refresh the page data to show updated information
				window.location.reload();
			} else {
				showError(
					'Update Failed',
					result.message ||
						'Failed to update profile. Please try again.'
				);
			}
		} catch (error) {
			console.error('Profile update error:', error);
			showError(
				'Update Failed',
				'Failed to update profile. Please try again.'
			);
		}
	};

	const handleCancel = () => {
		setFormData({
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			email: user?.email || '',
		});
		setIsEditing(false);
	};

	const getInitials = (
		firstName: string,
		lastName: string
	) => {
		return `${firstName.charAt(0)}${lastName.charAt(
			0
		)}`.toUpperCase();
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString(
			'en-US',
			{
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}
		);
	};

	// Validate password in real-time (reused from AuthPage)
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

	const handleChangePasswordInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setChangePasswordData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Real-time password validation for new password
		if (name === 'newPassword') {
			const validation = validatePassword(value);
			setPasswordValidation(validation);
		}
	};

	const handleChangePasswordSubmit = async (
		e: React.FormEvent
	) => {
		e.preventDefault();
		setIsChangingPassword(true);

		try {
			// Validation
			if (
				changePasswordData.newPassword !==
				changePasswordData.confirmPassword
			) {
				showError(
					'Password Mismatch',
					'New passwords do not match'
				);
				return;
			}

			// Check if new password meets requirements
			const validation = validatePassword(
				changePasswordData.newPassword
			);
			if (!Object.values(validation).every(Boolean)) {
				showError(
					'Invalid Password',
					'New password does not meet all requirements'
				);
				return;
			}

			const result = await authService.changePassword(
				{
					currentPassword:
						changePasswordData.currentPassword,
					newPassword:
						changePasswordData.newPassword,
				}
			);

			if (result.success) {
				showSuccess(
					'Password Changed',
					'Password changed successfully. Please login again.'
				);
				// Reset form
				setChangePasswordData({
					currentPassword: '',
					newPassword: '',
					confirmPassword: '',
				});
				setShowChangePassword(false);
				// Navigate to auth page since backend invalidates all sessions
				navigate('/auth');
			} else {
				showError(
					'Password Change Failed',
					result.message
				);
			}
		} catch (error) {
			console.error('Change password error:', error);
			showError(
				'Error',
				'An unexpected error occurred'
			);
		} finally {
			setIsChangingPassword(false);
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

	const handleDeleteAccount = async () => {
		if (deleteConfirmText !== 'DELETE') {
			showError(
				'Confirmation Required',
				'Please type "DELETE" to confirm account deletion'
			);
			return;
		}

		setIsDeleting(true);

		try {
			const result =
				await authService.deleteAccount();

			if (result.success) {
				showSuccess(
					'Account Deleted',
					'Your account has been permanently deleted'
				);
				// User is automatically logged out by the authService
				navigate('/auth');
			} else {
				showError(
					'Account Deletion Failed',
					result.message
				);
			}
		} catch (error) {
			console.error('Delete account error:', error);
			showError(
				'Error',
				'An unexpected error occurred'
			);
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirmation(false);
			setDeleteConfirmText('');
		}
	};

	if (!user) {
		return null;
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
						onClick={() => navigate('/ai-chat')}
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
						<span>Back to Chat</span>
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className='flex items-center justify-center min-h-screen px-6 py-12'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='w-full max-w-2xl'
				>
					<div
						className={`backdrop-blur-lg rounded-3xl border p-8 shadow-2xl ${
							isDark
								? 'bg-white/10 border-white/20'
								: 'bg-white/80 border-gray-200'
						}`}
					>
						{/* Profile Header */}
						<div className='text-center mb-8'>
							<div
								className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-4 ${
									isDark
										? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
										: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
								}`}
							>
								{getInitials(
									user.firstName,
									user.lastName
								)}
							</div>
							<h1
								className={`text-3xl font-bold mb-2 ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								{user.firstName}{' '}
								{user.lastName}
							</h1>
							<p
								className={`text-lg ${
									isDark
										? 'text-gray-300'
										: 'text-gray-600'
								}`}
							>
								{user.email}
							</p>
						</div>

						{/* Profile Information */}
						<div className='space-y-6'>
							{/* Edit Toggle */}
							<div className='flex justify-between items-center'>
								<h2
									className={`text-xl font-semibold ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Profile Information
								</h2>
								{!isEditing ? (
									<button
										onClick={() =>
											setIsEditing(
												true
											)
										}
										className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
											isDark
												? 'bg-chat-accent/20 hover:bg-chat-accent/30 text-chat-accent'
												: 'bg-blue-100 hover:bg-blue-200 text-blue-600'
										}`}
									>
										<Edit3 className='w-4 h-4' />
										<span>
											Edit Profile
										</span>
									</button>
								) : (
									<div className='flex gap-2'>
										<button
											onClick={
												handleCancel
											}
											className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
												isDark
													? 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400'
													: 'bg-gray-100 hover:bg-gray-200 text-gray-600'
											}`}
										>
											<X className='w-4 h-4' />
											<span>
												Cancel
											</span>
										</button>
										<button
											onClick={
												handleSave
											}
											className='flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple text-white hover:shadow-lg transition-all'
										>
											<Save className='w-4 h-4' />
											<span>
												Save Changes
											</span>
										</button>
									</div>
								)}
							</div>

							{/* Form Fields */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{/* First Name */}
								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											isDark
												? 'text-gray-300'
												: 'text-gray-700'
										}`}
									>
										First Name
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
											disabled={
												!isEditing
											}
											className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-sm ${
												isDark
													? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
													: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
											} ${
												isEditing
													? 'focus:outline-none focus:ring-2 focus:ring-chat-pink/50'
													: 'cursor-not-allowed opacity-75'
											} transition-all`}
											placeholder='Enter your first name'
										/>
									</div>
								</div>

								{/* Last Name */}
								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											isDark
												? 'text-gray-300'
												: 'text-gray-700'
										}`}
									>
										Last Name
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
											disabled={
												!isEditing
											}
											className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-sm ${
												isDark
													? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
													: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
											} ${
												isEditing
													? 'focus:outline-none focus:ring-2 focus:ring-chat-pink/50'
													: 'cursor-not-allowed opacity-75'
											} transition-all`}
											placeholder='Enter your last name'
										/>
									</div>
								</div>

								{/* Email */}
								<div className='md:col-span-2'>
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
											name='email'
											value={
												formData.email
											}
											onChange={
												handleInputChange
											}
											disabled={
												!isEditing
											}
											className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-sm ${
												isDark
													? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
													: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
											} ${
												isEditing
													? 'focus:outline-none focus:ring-2 focus:ring-chat-pink/50'
													: 'cursor-not-allowed opacity-75'
											} transition-all`}
											placeholder='Enter your email address'
										/>
									</div>
								</div>
							</div>

							{/* Account Information */}
							<div
								className={`mt-8 pt-6 border-t ${
									isDark
										? 'border-white/20'
										: 'border-gray-200'
								}`}
							>
								<h3
									className={`text-lg font-semibold mb-4 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Account Information
								</h3>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div
										className={`flex items-center gap-3 p-4 rounded-xl ${
											isDark
												? 'bg-white/5 border border-white/10'
												: 'bg-gray-50 border border-gray-200'
										}`}
									>
										<Calendar className='w-5 h-5 text-blue-500' />
										<div>
											<div
												className={`text-sm font-medium ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												Member Since
											</div>
											<div
												className={`text-sm ${
													isDark
														? 'text-gray-400'
														: 'text-gray-600'
												}`}
											>
												{formatDate(
													user.createdAt
												)}
											</div>
										</div>
									</div>
									<div
										className={`flex items-center gap-3 p-4 rounded-xl ${
											isDark
												? 'bg-white/5 border border-white/10'
												: 'bg-gray-50 border border-gray-200'
										}`}
									>
										<Shield className='w-5 h-5 text-green-500' />
										<div>
											<div
												className={`text-sm font-medium ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												Account
												Status
											</div>
											<div className='text-sm text-green-500'>
												Active
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Change Password Section */}
							<div
								className={`mt-8 pt-6 border-t ${
									isDark
										? 'border-white/20'
										: 'border-gray-200'
								}`}
							>
								<div className='flex justify-between items-center mb-4'>
									<h3
										className={`text-lg font-semibold ${
											isDark
												? 'text-white'
												: 'text-gray-800'
										}`}
									>
										Security Settings
									</h3>
									<button
										onClick={() =>
											setShowChangePassword(
												!showChangePassword
											)
										}
										className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
											isDark
												? 'bg-chat-accent/20 hover:bg-chat-accent/30 text-chat-accent'
												: 'bg-blue-100 hover:bg-blue-200 text-blue-600'
										}`}
									>
										<Lock className='w-4 h-4' />
										<span>
											Change Password
										</span>
										{showChangePassword ? (
											<ChevronUp className='w-4 h-4' />
										) : (
											<ChevronDown className='w-4 h-4' />
										)}
									</button>
								</div>

								{/* Change Password Dropdown */}
								{showChangePassword && (
									<motion.div
										initial={{
											opacity: 0,
											height: 0,
										}}
										animate={{
											opacity: 1,
											height: 'auto',
										}}
										exit={{
											opacity: 0,
											height: 0,
										}}
										transition={{
											duration: 0.3,
										}}
										className={`overflow-hidden rounded-xl border p-6 ${
											isDark
												? 'bg-white/5 border-white/10'
												: 'bg-gray-50 border-gray-200'
										}`}
									>
										<form
											onSubmit={
												handleChangePasswordSubmit
											}
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
													Current
													Password
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
															changePasswordData.currentPassword
														}
														onChange={
															handleChangePasswordInputChange
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
													New
													Password
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
															changePasswordData.newPassword
														}
														onChange={
															handleChangePasswordInputChange
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
											{changePasswordData.newPassword && (
												<div
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
												</div>
											)}

											{/* Confirm New Password */}
											<div>
												<label
													className={`block text-sm font-medium mb-2 ${
														isDark
															? 'text-gray-300'
															: 'text-gray-700'
													}`}
												>
													Confirm
													New
													Password
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
															changePasswordData.confirmPassword
														}
														onChange={
															handleChangePasswordInputChange
														}
														className={`w-full pl-10 pr-12 py-3 rounded-xl border backdrop-blur-sm ${
															isDark
																? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
																: 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
														} focus:outline-none focus:ring-2 focus:ring-chat-pink/50 transition-all`}
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
											</div>

											{/* Submit Buttons */}
											<div className='flex gap-3 pt-4'>
												<button
													type='button'
													onClick={() => {
														setShowChangePassword(
															false
														);
														setChangePasswordData(
															{
																currentPassword:
																	'',
																newPassword:
																	'',
																confirmPassword:
																	'',
															}
														);
													}}
													className={`flex-1 py-3 px-4 rounded-xl transition-all ${
														isDark
															? 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400'
															: 'bg-gray-100 hover:bg-gray-200 text-gray-600'
													}`}
												>
													Cancel
												</button>
												<button
													type='submit'
													disabled={
														isChangingPassword
													}
													className='flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
												>
													{isChangingPassword
														? 'Changing...'
														: 'Change Password'}
												</button>
											</div>
										</form>
									</motion.div>
								)}
							</div>

							{/* Deactivate Account Section */}
							<div
								className={`mt-8 pt-6 border-t ${
									isDark
										? 'border-red-900/30'
										: 'border-red-200'
								}`}
							>
								<div className='flex justify-between items-center mb-4'>
									<div>
										<h3
											className={`text-lg font-semibold ${
												isDark
													? 'text-red-400'
													: 'text-red-600'
											}`}
										>
											Danger Zone
										</h3>
										<p
											className={`text-sm mt-1 ${
												isDark
													? 'text-gray-400'
													: 'text-gray-600'
											}`}
										>
											Permanently
											delete your
											account and all
											data
										</p>
									</div>
									<button
										onClick={() =>
											setShowDeleteConfirmation(
												true
											)
										}
										className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
											isDark
												? 'bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-900/30'
												: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
										}`}
									>
										<Trash2 className='w-4 h-4' />
										<span>
											Deactivate
											Account
										</span>
									</button>
								</div>
							</div>

							{/* Delete Confirmation Dialog */}
							{showDeleteConfirmation && (
								<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
									<motion.div
										initial={{
											opacity: 0,
											scale: 0.95,
										}}
										animate={{
											opacity: 1,
											scale: 1,
										}}
										exit={{
											opacity: 0,
											scale: 0.95,
										}}
										transition={{
											duration: 0.2,
										}}
										className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
											isDark
												? 'bg-chat-secondary border-red-900/30'
												: 'bg-white border-red-200'
										}`}
									>
										<div className='text-center mb-6'>
											<div
												className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
													isDark
														? 'bg-red-900/20 text-red-400'
														: 'bg-red-100 text-red-600'
												}`}
											>
												<AlertTriangle className='w-8 h-8' />
											</div>
											<h3
												className={`text-xl font-semibold mb-2 ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												Delete
												Account
											</h3>
											<p
												className={`text-sm ${
													isDark
														? 'text-gray-300'
														: 'text-gray-600'
												}`}
											>
												This action
												cannot be
												undone. This
												will
												permanently
												delete your
												account and
												remove all
												your data.
											</p>
										</div>

										<div className='space-y-4'>
											<div>
												<label
													className={`block text-sm font-medium mb-2 ${
														isDark
															? 'text-gray-300'
															: 'text-gray-700'
													}`}
												>
													Type
													"DELETE"
													to
													confirm:
												</label>
												<input
													type='text'
													value={
														deleteConfirmText
													}
													onChange={(
														e
													) =>
														setDeleteConfirmText(
															e
																.target
																.value
														)
													}
													className={`w-full px-4 py-3 rounded-xl border backdrop-blur-sm ${
														isDark
															? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
															: 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
													} focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all`}
													placeholder='Type DELETE here'
												/>
											</div>

											<div className='flex gap-3'>
												<button
													onClick={() => {
														setShowDeleteConfirmation(
															false
														);
														setDeleteConfirmText(
															''
														);
													}}
													disabled={
														isDeleting
													}
													className={`flex-1 py-3 px-4 rounded-xl transition-all ${
														isDark
															? 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400'
															: 'bg-gray-100 hover:bg-gray-200 text-gray-600'
													} disabled:opacity-50 disabled:cursor-not-allowed`}
												>
													Cancel
												</button>
												<button
													onClick={
														handleDeleteAccount
													}
													disabled={
														isDeleting ||
														deleteConfirmText !==
															'DELETE'
													}
													className='flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
												>
													{isDeleting
														? 'Deleting...'
														: 'Delete Account'}
												</button>
											</div>
										</div>
									</motion.div>
								</div>
							)}
						</div>
					</div>
				</motion.div>
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default ProfilePage;
