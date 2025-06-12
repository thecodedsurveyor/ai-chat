import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
	User,
	Settings,
	LogOut,
	ChevronDown,
	BarChart3,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/authService';

const UserProfile: React.FC = () => {
	const { isDark } = useTheme();
	const { showSuccess } = useToast();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const user = authService.getUser();

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(
					event.target as Node
				)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener(
			'mousedown',
			handleClickOutside
		);
		return () => {
			document.removeEventListener(
				'mousedown',
				handleClickOutside
			);
		};
	}, []);

	const handleLogout = async () => {
		try {
			await authService.logout();
			showSuccess(
				'Logged Out',
				'You have been successfully logged out'
			);
			navigate('/auth');
		} catch (error) {
			console.error('Logout error:', error);
		}
		setIsOpen(false);
	};

	const handleProfile = () => {
		navigate('/profile');
		setIsOpen(false);
	};

	const handleSettings = () => {
		navigate('/settings');
		setIsOpen(false);
	};

	const handleAnalytics = () => {
		navigate('/analytics');
		setIsOpen(false);
	};

	if (!user) {
		return null;
	}

	const getInitials = (
		firstName: string,
		lastName: string
	) => {
		return `${firstName.charAt(0)}${lastName.charAt(
			0
		)}`.toUpperCase();
	};

	const renderAvatar = (size: 'small' | 'large') => {
		const sizeClasses =
			size === 'small'
				? 'w-8 h-8 text-sm'
				: 'w-12 h-12 text-lg';

		if (user.avatar) {
			return (
				<img
					src={user.avatar}
					alt={`${user.firstName} ${user.lastName}`}
					className={`${sizeClasses} rounded-full object-cover border-2 border-white/20`}
					onError={(e) => {
						console.error(
							'Avatar failed to load:',
							e
						);
						// Hide the image and let the fallback div show
						e.currentTarget.style.display =
							'none';
					}}
				/>
			);
		}

		return (
			<div
				className={`${sizeClasses} rounded-full flex items-center justify-center font-semibold ${
					isDark
						? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
						: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
				}`}
			>
				{getInitials(user.firstName, user.lastName)}
			</div>
		);
	};

	return (
		<div className='relative' ref={dropdownRef}>
			{/* Profile Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
					isDark
						? 'bg-chat-secondary/50 hover:bg-chat-secondary/70 text-white'
						: 'bg-white/80 hover:bg-white text-gray-800'
				} border ${
					isDark
						? 'border-white/10'
						: 'border-gray-200'
				} shadow-lg hover:shadow-xl`}
			>
				{/* Avatar */}
				{renderAvatar('small')}

				{/* User Info */}
				<div className='flex flex-col items-start'>
					<span className='text-sm font-medium'>
						{user.firstName} {user.lastName}
					</span>
					<span
						className={`text-xs ${
							isDark
								? 'text-gray-400'
								: 'text-gray-500'
						}`}
					>
						{user.email}
					</span>
				</div>

				{/* Dropdown Arrow */}
				<ChevronDown
					className={`w-4 h-4 transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{/* Dropdown Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{
							opacity: 0,
							y: -10,
							scale: 0.95,
						}}
						animate={{
							opacity: 1,
							y: 0,
							scale: 1,
						}}
						exit={{
							opacity: 0,
							y: -10,
							scale: 0.95,
						}}
						transition={{ duration: 0.2 }}
						className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border z-50 ${
							isDark
								? 'bg-chat-secondary border-white/10'
								: 'bg-white border-gray-200'
						}`}
					>
						{/* User Info Header */}
						<div
							className={`px-4 py-3 border-b ${
								isDark
									? 'border-white/10'
									: 'border-gray-100'
							}`}
						>
							<div className='flex items-center gap-3'>
								{renderAvatar('large')}
								<div>
									<div
										className={`font-semibold ${
											isDark
												? 'text-white'
												: 'text-gray-800'
										}`}
									>
										{user.firstName}{' '}
										{user.lastName}
									</div>
									<div
										className={`text-sm ${
											isDark
												? 'text-gray-400'
												: 'text-gray-500'
										}`}
									>
										{user.email}
									</div>
								</div>
							</div>
						</div>

						{/* Menu Items */}
						<div className='py-2'>
							<button
								onClick={handleProfile}
								className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
									isDark
										? 'hover:bg-white/5 text-gray-300 hover:text-white'
										: 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
								}`}
							>
								<User className='w-5 h-5' />
								<span>My Profile</span>
							</button>

							<button
								onClick={handleSettings}
								className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
									isDark
										? 'hover:bg-white/5 text-gray-300 hover:text-white'
										: 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
								}`}
							>
								<Settings className='w-5 h-5' />
								<span>Settings</span>
							</button>

							<button
								onClick={handleAnalytics}
								className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
									isDark
										? 'hover:bg-white/5 text-gray-300 hover:text-white'
										: 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
								}`}
							>
								<BarChart3 className='w-5 h-5' />
								<span>Analytics</span>
							</button>

							<div
								className={`my-2 border-t ${
									isDark
										? 'border-white/10'
										: 'border-gray-100'
								}`}
							/>

							<button
								onClick={handleLogout}
								className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
									isDark
										? 'hover:bg-red-500/10 text-red-400 hover:text-red-300'
										: 'hover:bg-red-50 text-red-600 hover:text-red-700'
								}`}
							>
								<LogOut className='w-5 h-5' />
								<span>Sign Out</span>
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default UserProfile;
