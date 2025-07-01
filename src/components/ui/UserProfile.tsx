import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
	User,
	Settings,
	LogOut,
	BarChart3,
	ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/authService';
import { createPortal } from 'react-dom';

const UserProfile: React.FC = () => {
	const { isDark } = useTheme();
	const { showSuccess } = useToast();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
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
		} catch {
			// Logout error occurred
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

	const renderAvatar = (
		size: 'small' | 'medium' | 'large'
	) => {
		const sizeClasses =
			size === 'small'
				? 'w-10 h-10 text-sm'
				: size === 'medium'
				? 'w-12 h-12 text-base'
				: 'w-14 h-14 text-lg';

		if (user.avatar) {
			return (
				<img
					src={user.avatar}
					alt={`${user.firstName} ${user.lastName}`}
					className={`${sizeClasses} rounded-full object-cover border-2 border-white/20 shadow-lg`}
					onError={(e) => {
						// Hide the image and let the fallback div show
						e.currentTarget.style.display =
							'none';
					}}
				/>
			);
		}

		return (
			<div
				className={`${sizeClasses} rounded-full flex items-center justify-center font-semibold shadow-lg ${
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
			{/* Enhanced Profile Button with Settings Indicator */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className={`relative flex items-center gap-2 p-2 pr-3 rounded-full transition-all duration-300 group ${
					isDark
						? 'hover:bg-white/10 hover:shadow-lg'
						: 'hover:bg-gray-100 hover:shadow-lg'
				} ${
					isOpen
						? isDark
							? 'bg-white/10 shadow-lg'
							: 'bg-gray-100 shadow-lg'
						: ''
				}`}
				title={`${user.firstName} ${user.lastName} - Click for settings`}
			>
				{/* Avatar with enhanced visual feedback */}
				<div className='relative'>
					{renderAvatar('medium')}

					{/* Settings indicator - subtle ring */}
					<div
						className={`absolute -inset-0.5 rounded-full transition-all duration-300 ${
							isHovered || isOpen
								? 'bg-gradient-to-r from-chat-pink to-chat-purple opacity-50'
								: 'bg-transparent'
						}`}
					/>

					{/* Settings icon indicator */}
					<div
						className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
							isDark
								? 'bg-chat-secondary border-2 border-chat-primary'
								: 'bg-white border-2 border-gray-200'
						} shadow-lg ${
							isHovered || isOpen
								? 'scale-110'
								: 'scale-100'
						}`}
					>
						<Settings
							className={`w-3 h-3 transition-colors ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						/>
					</div>
				</div>

				{/* Name and dropdown indicator (hidden on mobile to save space) */}
				<div className='hidden sm:flex items-center gap-1'>
					<span
						className={`text-sm font-medium transition-colors ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
					>
						{user.firstName}
					</span>
					<ChevronDown
						className={`w-4 h-4 transition-transform duration-300 ${
							isOpen
								? 'rotate-180'
								: 'rotate-0'
						} ${
							isDark
								? 'text-chat-accent'
								: 'text-gray-500'
						}`}
					/>
				</div>

				{/* Static gradient background */}
				{!isOpen && (
					<div
						className={`absolute inset-0 rounded-full opacity-20 ${
							isDark
								? 'bg-gradient-to-r from-chat-pink to-chat-purple'
								: 'bg-gradient-to-r from-blue-500 to-purple-500'
						}`}
					/>
				)}
			</button>

			{/* Enhanced Dropdown Menu */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop for mobile - prevents interaction with elements behind (via portal) */}
						{typeof window !== 'undefined' &&
							createPortal(
								<div
									className='fixed inset-0 z-40 md:hidden'
									onClick={() =>
										setIsOpen(false)
									}
								/>,
								document.body
							)}
						{/* Dropdown Menu via Portal */}
						{typeof window !== 'undefined' &&
							createPortal(
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
									transition={{
										duration: 0.2,
									}}
									className={`fixed right-4 top-20 w-72 rounded-xl border z-50 ${
										isDark
											? 'bg-chat-secondary border-white/10 shadow-2xl'
											: 'bg-white border-gray-300 shadow-2xl ring-1 ring-black/10'
									}`}
									style={{}}
								>
									{/* Enhanced User Info Header */}
									<div
										className={`px-4 py-4 border-b ${
											isDark
												? 'border-white/10'
												: 'border-gray-100'
										}`}
									>
										<div className='flex items-center gap-3'>
											{renderAvatar(
												'large'
											)}
											<div className='flex-1'>
												<div
													className={`font-semibold text-base ${
														isDark
															? 'text-white'
															: 'text-gray-800'
													}`}
												>
													{
														user.firstName
													}{' '}
													{
														user.lastName
													}
												</div>
												<div
													className={`text-sm opacity-75 ${
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}`}
												>
													{
														user.email
													}
												</div>
											</div>
										</div>
									</div>

									{/* Enhanced Menu Items */}
									<div className='py-2'>
										<button
											onClick={
												handleProfile
											}
											className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:scale-[1.02] ${
												isDark
													? 'hover:bg-white/5 text-gray-300 hover:text-white'
													: 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
											}`}
										>
											<div
												className={`p-2 rounded-lg ${
													isDark
														? 'bg-blue-500/20 text-blue-400'
														: 'bg-blue-50 text-blue-600'
												}`}
											>
												<User className='w-5 h-5' />
											</div>
											<div>
												<div className='font-medium'>
													My
													Profile
												</div>
												<div
													className={`text-xs opacity-75 ${
														isDark
															? 'text-gray-400'
															: 'text-gray-500'
													}`}
												>
													Manage
													your
													account
												</div>
											</div>
										</button>

										<button
											onClick={
												handleSettings
											}
											className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:scale-[1.02] ${
												isDark
													? 'hover:bg-white/5 text-gray-300 hover:text-white'
													: 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
											}`}
										>
											<div
												className={`p-2 rounded-lg ${
													isDark
														? 'bg-purple-500/20 text-purple-400'
														: 'bg-purple-50 text-purple-600'
												}`}
											>
												<Settings className='w-5 h-5' />
											</div>
											<div>
												<div className='font-medium'>
													Settings
												</div>
												<div
													className={`text-xs opacity-75 ${
														isDark
															? 'text-gray-400'
															: 'text-gray-500'
													}`}
												>
													App
													preferences
												</div>
											</div>
										</button>

										<button
											onClick={
												handleAnalytics
											}
											className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:scale-[1.02] ${
												isDark
													? 'hover:bg-white/5 text-gray-300 hover:text-white'
													: 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
											}`}
										>
											<div
												className={`p-2 rounded-lg ${
													isDark
														? 'bg-green-500/20 text-green-400'
														: 'bg-green-50 text-green-600'
												}`}
											>
												<BarChart3 className='w-5 h-5' />
											</div>
											<div>
												<div className='font-medium'>
													Analytics
												</div>
												<div
													className={`text-xs opacity-75 ${
														isDark
															? 'text-gray-400'
															: 'text-gray-500'
													}`}
												>
													Usage
													insights
												</div>
											</div>
										</button>

										<div
											className={`my-2 border-t ${
												isDark
													? 'border-white/10'
													: 'border-gray-100'
											}`}
										/>

										<button
											onClick={
												handleLogout
											}
											className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:scale-[1.02] ${
												isDark
													? 'hover:bg-red-500/10 text-red-400 hover:text-red-300'
													: 'hover:bg-red-50 text-red-600 hover:text-red-700'
											}`}
										>
											<div
												className={`p-2 rounded-lg ${
													isDark
														? 'bg-red-500/20 text-red-400'
														: 'bg-red-50 text-red-600'
												}`}
											>
												<LogOut className='w-5 h-5' />
											</div>
											<div>
												<div className='font-medium'>
													Sign Out
												</div>
												<div
													className={`text-xs opacity-75 ${
														isDark
															? 'text-gray-400'
															: 'text-gray-500'
													}`}
												>
													End your
													session
												</div>
											</div>
										</button>
									</div>
								</motion.div>,
								document.body
							)}
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default UserProfile;
