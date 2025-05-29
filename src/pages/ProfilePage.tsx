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
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/authService';
import Footer from '../components/layout/Footer';

const ProfilePage: React.FC = () => {
	const { isDark } = useTheme();
	const { showSuccess, showError } = useToast();
	const navigate = useNavigate();
	const user = authService.getUser();

	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		email: user?.email || '',
	});

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
			// For now, just update localStorage since we don't have backend profile update
			// In a real app, this would call an API endpoint
			const updatedUser = {
				...user!,
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
			};

			localStorage.setItem(
				'user',
				JSON.stringify(updatedUser)
			);

			showSuccess(
				'Profile Updated',
				'Your profile has been successfully updated'
			);
			setIsEditing(false);
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
