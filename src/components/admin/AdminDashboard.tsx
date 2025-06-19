import React, {
	useState,
	useEffect,
	useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Shield,
	Users,
	Activity,
	BarChart3,
	Flag,
	LogOut,
	Menu,
	Clock,
	TrendingUp,
	CheckCircle,
	XCircle,
	Search,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/classNames';
import type {
	AdminUser,
	UserAnalytics,
	SystemHealth,
	FeatureFlag,
	AdminAnalytics,
} from '../../types/admin';
import { adminService } from '../../services/adminService';
import AdminAuth from './AdminAuth';
import UserManagement from './UserManagement';
import SystemHealthComponent from './SystemHealth';
import FeatureFlags from './FeatureFlags';
import useSwipeGesture from '../../hooks/useSwipeGesture';
import {
	SkeletonStats,
	SkeletonList,
	SkeletonTable,
} from '../../components/ui/LoadingSkeleton';
import {
	useUserSearch,
	useFeatureFlagSearch,
} from '../../hooks/useSearchAndFilter';

interface AdminDashboardProps {
	isVisible: boolean;
	onClose: () => void;
}

type TabType =
	| 'overview'
	| 'users'
	| 'health'
	| 'flags'
	| 'analytics';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
	isVisible,
	onClose,
}) => {
	const { isDark } = useTheme();
	const [admin, setAdmin] = useState<AdminUser | null>(
		null
	);
	const [activeTab, setActiveTab] =
		useState<TabType>('overview');
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<UserAnalytics[]>([]);
	const [systemHealth, setSystemHealth] =
		useState<SystemHealth | null>(null);
	const [featureFlags, setFeatureFlags] = useState<
		FeatureFlag[]
	>([]);
	const [analytics, setAnalytics] =
		useState<AdminAnalytics | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Search and filter hooks
	const userSearch = useUserSearch(
		users as unknown as UserAnalytics[]
	);
	const flagSearch = useFeatureFlagSearch(
		featureFlags as unknown as FeatureFlag[]
	);

	// Check if screen is mobile size
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () =>
			window.removeEventListener(
				'resize',
				checkMobile
			);
	}, []);

	// Auto-close sidebar on mobile when tab changes
	useEffect(() => {
		if (isMobile) {
			setSidebarOpen(false);
		}
	}, [activeTab, isMobile]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key) {
					case '1':
						setActiveTab('overview');
						e.preventDefault();
						break;
					case '2':
						setActiveTab('users');
						e.preventDefault();
						break;
					case '3':
						setActiveTab('health');
						e.preventDefault();
						break;
					case '4':
						setActiveTab('flags');
						e.preventDefault();
						break;
					case '5':
						setActiveTab('analytics');
						e.preventDefault();
						break;
					case 'Escape':
						if (sidebarOpen && isMobile) {
							setSidebarOpen(false);
						} else {
							onClose();
						}
						e.preventDefault();
						break;
				}
			}

			// Toggle sidebar with 'b' key
			if (
				e.key === 'b' &&
				!e.ctrlKey &&
				!e.metaKey &&
				!e.altKey
			) {
				if (isMobile) {
					setSidebarOpen(!sidebarOpen);
					e.preventDefault();
				}
			}
		};

		if (isVisible) {
			document.addEventListener(
				'keydown',
				handleKeydown
			);
			return () =>
				document.removeEventListener(
					'keydown',
					handleKeydown
				);
		}
	}, [isVisible, onClose, sidebarOpen, isMobile]);

	// Swipe gesture support
	const swipeRef = useSwipeGesture({
		onSwipeLeft: () => {
			if (isMobile && sidebarOpen) {
				setSidebarOpen(false);
			}
		},
		onSwipeRight: () => {
			if (isMobile && !sidebarOpen) {
				setSidebarOpen(true);
			}
		},
	});

	const loadDashboardData = useCallback(async () => {
		try {
			setLoading(true);
			const [
				usersData,
				healthData,
				flagsData,
				analyticsData,
			] = await Promise.all([
				adminService.getAllUsers(),
				adminService.getSystemHealth(),
				adminService.getFeatureFlags(),
				adminService.getAdminAnalytics(),
			]);

			setUsers(usersData);
			setSystemHealth(healthData);
			setFeatureFlags(flagsData);
			setAnalytics(analyticsData);
		} catch (error) {
			console.error(
				'Failed to load dashboard data:',
				error
			);
		} finally {
			setLoading(false);
		}
	}, []);

	const checkAuthAndLoadData = useCallback(async () => {
		const isAuthenticated =
			adminService.isAuthenticated();
		if (isAuthenticated) {
			const adminUser = adminService.getAdmin();
			setAdmin(adminUser);
			await loadDashboardData();
		}
	}, [loadDashboardData]);

	const handleLoginSuccess = (adminUser: AdminUser) => {
		setAdmin(adminUser);
		loadDashboardData();
	};

	const handleLogout = async () => {
		await adminService.logout();
		setAdmin(null);
		onClose();
	};

	const handleUserAction = async (
		userId: string,
		action: 'suspend' | 'activate' | 'delete'
	) => {
		try {
			setLoading(true);
			const success =
				await adminService.updateUserStatus(
					userId,
					action
				);

			if (success) {
				// Reload users data to reflect changes
				const updatedUsers =
					await adminService.getAllUsers();
				setUsers(updatedUsers);
			}
		} catch (error) {
			console.error('User action error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleFlag = async (
		flagId: string,
		enabled: boolean
	) => {
		try {
			setLoading(true);
			const flagToUpdate = featureFlags.find(
				(f) => f.id === flagId
			);
			if (!flagToUpdate) return;

			const success =
				await adminService.updateFeatureFlag(
					flagId,
					{
						...flagToUpdate,
						enabled: enabled,
					}
				);

			if (success) {
				// Reload feature flags to get updated data
				const updatedFlags =
					await adminService.getFeatureFlags();
				setFeatureFlags(updatedFlags);
			}
		} catch (error) {
			console.error('Toggle flag error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateRollout = async (
		flagId: string,
		rolloutPercentage: number
	) => {
		try {
			setLoading(true);
			const flagToUpdate = featureFlags.find(
				(f) => f.id === flagId
			);
			if (!flagToUpdate) return;

			const success =
				await adminService.updateFeatureFlag(
					flagId,
					{
						...flagToUpdate,
						rolloutPercentage:
							rolloutPercentage,
					}
				);

			if (success) {
				// Reload feature flags to get updated data
				const updatedFlags =
					await adminService.getFeatureFlags();
				setFeatureFlags(updatedFlags);
			}
		} catch (error) {
			console.error('Update rollout error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateFlag = async (
		flagData: Omit<
			FeatureFlag,
			'id' | 'createdAt' | 'lastModified'
		>
	) => {
		try {
			setLoading(true);
			const success =
				await adminService.createFeatureFlag(
					flagData
				);

			if (success) {
				// Reload feature flags to include new flag
				const updatedFlags =
					await adminService.getFeatureFlags();
				setFeatureFlags(updatedFlags);
			}
		} catch (error) {
			console.error('Create flag error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleEditFlag = async (
		flagId: string,
		updates: Partial<FeatureFlag>
	) => {
		try {
			console.log(
				'🎯 AdminDashboard handleEditFlag called:',
				flagId,
				updates
			);
			setLoading(true);
			const success =
				await adminService.updateFeatureFlag(
					flagId,
					updates
				);

			console.log('✅ Edit flag success:', success);

			if (success) {
				// Reload feature flags to get updated data
				const updatedFlags =
					await adminService.getFeatureFlags();
				console.log(
					'🔄 Reloaded flags:',
					updatedFlags
				);
				setFeatureFlags(updatedFlags);
			}
		} catch (error) {
			console.error('Edit flag error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteFlag = async (flagId: string) => {
		try {
			setLoading(true);
			const success =
				await adminService.deleteFeatureFlag(
					flagId
				);

			if (success) {
				// Reload feature flags to remove deleted flag
				const updatedFlags =
					await adminService.getFeatureFlags();
				setFeatureFlags(updatedFlags);
			}
		} catch (error) {
			console.error('Delete flag error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleRefreshHealth = async () => {
		try {
			const healthData =
				await adminService.getSystemHealth();
			setSystemHealth(healthData);
		} catch (error) {
			console.error(
				'Failed to refresh health data:',
				error
			);
		}
	};

	useEffect(() => {
		if (isVisible) {
			checkAuthAndLoadData();
		}
	}, [isVisible, checkAuthAndLoadData]);

	const tabs = [
		{
			id: 'overview',
			label: 'Overview',
			icon: BarChart3,
			shortcut: '⌘1',
		},
		{
			id: 'users',
			label: 'Users',
			icon: Users,
			shortcut: '⌘2',
		},
		{
			id: 'health',
			label: 'System Health',
			icon: Activity,
			shortcut: '⌘3',
		},
		{
			id: 'flags',
			label: 'Feature Flags',
			icon: Flag,
			shortcut: '⌘4',
		},
		{
			id: 'analytics',
			label: 'Analytics',
			icon: BarChart3,
			shortcut: '⌘5',
		},
	] as const;

	if (!isVisible) return null;

	// Show login screen if not authenticated
	if (!admin) {
		return (
			<div className='fixed inset-0 z-50'>
				<AdminAuth
					onLoginSuccess={handleLoginSuccess}
				/>
			</div>
		);
	}

	return (
		<div
			ref={
				swipeRef as React.RefObject<HTMLDivElement>
			}
			className='fixed inset-0 z-50 flex bg-chat-primary dark:bg-chat-primary'
		>
			{/* Sidebar Overlay for Mobile */}
			{isMobile && sidebarOpen && (
				<div
					className='fixed inset-0 z-40 bg-black/50 md:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<motion.div
				initial={{ x: isMobile ? -300 : 0 }}
				animate={{
					x: isMobile
						? sidebarOpen
							? 0
							: -300
						: 0,
				}}
				className={cn(
					'h-full border-r flex flex-col z-50',
					isMobile
						? 'fixed top-0 left-0 w-[280px] md:w-64'
						: 'w-64',
					isDark
						? 'bg-chat-secondary border-chat-accent/30'
						: 'bg-chat-light-primary border-chat-light-border'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'p-6 border-b',
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-light-border'
					)}
				>
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 rounded-lg bg-gradient-to-r from-chat-pink to-chat-purple flex items-center justify-center'>
							<Shield className='w-6 h-6 text-white' />
						</div>
						<div>
							<h1
								className={cn(
									'font-exo font-bold text-lg',
									isDark
										? 'text-chat-accent'
										: 'text-chat-light-accent'
								)}
							>
								Admin Portal
							</h1>
							<p
								className={cn(
									'text-xs',
									isDark
										? 'text-chat-text/70'
										: 'text-chat-light-muted'
								)}
							>
								NeuronFlow Dashboard
							</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className='flex-1 p-4 space-y-2'>
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								key={tab.id}
								onClick={() =>
									setActiveTab(tab.id)
								}
								className={cn(
									'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group',
									activeTab === tab.id
										? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white shadow-lg'
										: isDark
										? 'text-chat-accent hover:bg-chat-primary hover:text-chat-pink'
										: 'text-chat-light-accent hover:bg-chat-light-hover hover:text-chat-light-button-primary'
								)}
							>
								<Icon className='w-5 h-5' />
								<span className='font-medium flex-1'>
									{tab.label}
								</span>
								{!isMobile && (
									<span
										className={cn(
											'text-xs opacity-50 group-hover:opacity-75',
											activeTab ===
												tab.id
												? 'text-white/70'
												: ''
										)}
									>
										{tab.shortcut}
									</span>
								)}
							</button>
						);
					})}
				</nav>

				{/* User Info */}
				<div
					className={cn(
						'p-4 border-t',
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-light-border'
					)}
				>
					<div className='flex items-center gap-3 mb-3'>
						<div className='w-8 h-8 rounded-full bg-gradient-to-r from-chat-pink to-chat-purple flex items-center justify-center text-white font-semibold text-sm'>
							{admin.firstName.charAt(0)}
							{admin.lastName.charAt(0)}
						</div>
						<div className='flex-1 min-w-0'>
							<p
								className={cn(
									'font-medium text-sm truncate',
									isDark
										? 'text-chat-accent'
										: 'text-chat-light-accent'
								)}
							>
								{admin.firstName}{' '}
								{admin.lastName}
							</p>
							<p
								className={cn(
									'text-xs truncate',
									isDark
										? 'text-chat-text/70'
										: 'text-chat-light-muted'
								)}
							>
								{admin.role.replace(
									'_',
									' '
								)}
							</p>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className={cn(
							'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
							isDark
								? 'text-chat-accent hover:bg-chat-primary hover:text-chat-pink'
								: 'text-chat-light-accent hover:bg-chat-light-hover hover:text-chat-light-button-primary'
						)}
					>
						<LogOut className='w-4 h-4' />
						Logout
					</button>
				</div>
			</motion.div>

			{/* Main Content */}
			<div className='flex-1 flex flex-col min-w-0'>
				{/* Top Bar */}
				<div
					className={cn(
						'h-16 px-4 md:px-6 border-b flex items-center justify-between',
						isDark
							? 'bg-chat-secondary border-chat-accent/30'
							: 'bg-chat-light-primary border-chat-light-border'
					)}
				>
					<div className='flex items-center gap-4'>
						{/* Mobile Menu Button */}
						{isMobile && (
							<button
								onClick={() =>
									setSidebarOpen(
										!sidebarOpen
									)
								}
								className={cn(
									'p-2 rounded-lg transition-colors md:hidden',
									isDark
										? 'hover:bg-chat-primary text-chat-accent'
										: 'hover:bg-chat-light-hover text-chat-light-icon'
								)}
							>
								<Menu className='w-5 h-5' />
							</button>
						)}

						<h2
							className={cn(
								'text-xl font-exo font-semibold',
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							)}
						>
							{
								tabs.find(
									(tab) =>
										tab.id === activeTab
								)?.label
							}
						</h2>
					</div>

					{/* Desktop close button only */}
					{!isMobile && (
						<button
							onClick={onClose}
							className={cn(
								'p-2 rounded-lg transition-colors',
								isDark
									? 'hover:bg-chat-primary text-chat-accent hover:text-chat-pink'
									: 'hover:bg-chat-light-hover text-chat-light-icon hover:text-chat-light-button-primary'
							)}
						>
							<XCircle className='w-5 h-5' />
						</button>
					)}
				</div>

				{/* Content Area */}
				<div
					className={cn(
						'flex-1 overflow-auto',
						isDark
							? 'bg-chat-primary'
							: 'bg-chat-light-surface'
					)}
				>
					<div className='p-4 md:p-6'>
						<AnimatePresence mode='wait'>
							<motion.div
								key={activeTab}
								initial={{
									opacity: 0,
									y: 20,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								exit={{
									opacity: 0,
									y: -20,
								}}
								transition={{
									duration: 0.2,
								}}
							>
								{activeTab ===
									'overview' && (
									<div className='space-y-6'>
										{loading ? (
											<SkeletonStats
												count={4}
											/>
										) : analytics ? (
											<>
												{/* Overview Cards */}
												<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
													<div
														className={cn(
															'p-4 md:p-6 rounded-xl border',
															isDark
																? 'bg-chat-secondary border-chat-accent/30'
																: 'bg-white border-chat-light-border shadow-sm'
														)}
													>
														<div className='flex items-center gap-3 mb-2'>
															<Users className='w-6 md:w-8 h-6 md:h-8 text-chat-pink' />
															<div>
																<p
																	className={cn(
																		'text-xl md:text-2xl font-bold',
																		isDark
																			? 'text-chat-accent'
																			: 'text-chat-light-accent'
																	)}
																>
																	{
																		analytics
																			.overview
																			.totalUsers
																	}
																</p>
																<p
																	className={cn(
																		'text-xs md:text-sm',
																		isDark
																			? 'text-chat-text/70'
																			: 'text-chat-light-muted'
																	)}
																>
																	Total
																	Users
																</p>
															</div>
														</div>
													</div>

													<div
														className={cn(
															'p-4 md:p-6 rounded-xl border',
															isDark
																? 'bg-chat-secondary border-chat-accent/30'
																: 'bg-white border-chat-light-border shadow-sm'
														)}
													>
														<div className='flex items-center gap-3 mb-2'>
															<Activity className='w-6 md:w-8 h-6 md:h-8 text-green-500' />
															<div>
																<p
																	className={cn(
																		'text-xl md:text-2xl font-bold',
																		isDark
																			? 'text-chat-accent'
																			: 'text-chat-light-accent'
																	)}
																>
																	{
																		analytics
																			.overview
																			.activeUsers
																	}
																</p>
																<p
																	className={cn(
																		'text-xs md:text-sm',
																		isDark
																			? 'text-chat-text/70'
																			: 'text-chat-light-muted'
																	)}
																>
																	Active
																	Users
																</p>
															</div>
														</div>
													</div>

													<div
														className={cn(
															'p-4 md:p-6 rounded-xl border',
															isDark
																? 'bg-chat-secondary border-chat-accent/30'
																: 'bg-white border-chat-light-border shadow-sm'
														)}
													>
														<div className='flex items-center gap-3 mb-2'>
															<BarChart3 className='w-6 md:w-8 h-6 md:h-8 text-chat-purple' />
															<div>
																<p
																	className={cn(
																		'text-xl md:text-2xl font-bold',
																		isDark
																			? 'text-chat-accent'
																			: 'text-chat-light-accent'
																	)}
																>
																	{
																		analytics
																			.overview
																			.totalChats
																	}
																</p>
																<p
																	className={cn(
																		'text-xs md:text-sm',
																		isDark
																			? 'text-chat-text/70'
																			: 'text-chat-light-muted'
																	)}
																>
																	Total
																	Chats
																</p>
															</div>
														</div>
													</div>

													<div
														className={cn(
															'p-4 md:p-6 rounded-xl border',
															isDark
																? 'bg-chat-secondary border-chat-accent/30'
																: 'bg-white border-chat-light-border shadow-sm'
														)}
													>
														<div className='flex items-center gap-3 mb-2'>
															<Clock className='w-6 md:w-8 h-6 md:h-8 text-chat-orange' />
															<div>
																<p
																	className={cn(
																		'text-xl md:text-2xl font-bold',
																		isDark
																			? 'text-chat-accent'
																			: 'text-chat-light-accent'
																	)}
																>
																	{analytics
																		.overview
																		.avgSessionDuration
																		? Math.floor(
																				analytics
																					.overview
																					.avgSessionDuration /
																					60
																		  )
																		: 0}

																	m
																</p>
																<p
																	className={cn(
																		'text-xs md:text-sm',
																		isDark
																			? 'text-chat-text/70'
																			: 'text-chat-light-muted'
																	)}
																>
																	Avg
																	Session
																</p>
															</div>
														</div>
													</div>
												</div>

												{/* Quick Stats */}
												<div
													className={cn(
														'p-4 md:p-6 rounded-xl border',
														isDark
															? 'bg-chat-secondary border-chat-accent/30'
															: 'bg-white border-chat-light-border shadow-sm'
													)}
												>
													<h3
														className={cn(
															'text-lg font-exo font-semibold mb-4',
															isDark
																? 'text-chat-accent'
																: 'text-chat-light-accent'
														)}
													>
														Quick
														Overview
													</h3>
													<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
														<div className='text-center'>
															<TrendingUp className='w-8 h-8 text-green-500 mx-auto mb-2' />
															<p
																className={cn(
																	'text-2xl font-bold',
																	isDark
																		? 'text-chat-accent'
																		: 'text-chat-light-accent'
																)}
															>
																+
																{
																	analytics
																		.overview
																		.totalMessages
																}
															</p>
															<p
																className={cn(
																	'text-sm',
																	isDark
																		? 'text-chat-text/70'
																		: 'text-chat-light-muted'
																)}
															>
																Total
																Messages
															</p>
														</div>
														<div className='text-center'>
															<Flag className='w-8 h-8 text-chat-purple mx-auto mb-2' />
															<p
																className={cn(
																	'text-2xl font-bold',
																	isDark
																		? 'text-chat-accent'
																		: 'text-chat-light-accent'
																)}
															>
																{
																	featureFlags.length
																}
															</p>
															<p
																className={cn(
																	'text-sm',
																	isDark
																		? 'text-chat-text/70'
																		: 'text-chat-light-muted'
																)}
															>
																Feature
																Flags
															</p>
														</div>
														<div className='text-center'>
															<CheckCircle className='w-8 h-8 text-green-500 mx-auto mb-2' />
															<p
																className={cn(
																	'text-2xl font-bold',
																	isDark
																		? 'text-chat-accent'
																		: 'text-chat-light-accent'
																)}
															>
																{systemHealth?.status ===
																'healthy'
																	? '100%'
																	: '95%'}
															</p>
															<p
																className={cn(
																	'text-sm',
																	isDark
																		? 'text-chat-text/70'
																		: 'text-chat-light-muted'
																)}
															>
																System
																Health
															</p>
														</div>
													</div>
												</div>
											</>
										) : null}
									</div>
								)}

								{activeTab === 'users' && (
									<div className='space-y-6'>
										{/* Search and Filter Bar */}
										<div className='flex flex-col sm:flex-row gap-4'>
											<div className='relative flex-1'>
												<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-chat-accent/50' />
												<input
													type='text'
													placeholder='Search users...'
													value={
														userSearch.searchTerm
													}
													onChange={(
														e
													) =>
														userSearch.setSearchTerm(
															e
																.target
																.value
														)
													}
													className={cn(
														'w-full pl-10 pr-4 py-2 rounded-lg border',
														isDark
															? 'bg-chat-secondary border-chat-accent/30 text-chat-accent'
															: 'bg-white border-chat-light-border text-chat-light-accent'
													)}
												/>
											</div>
											<div className='flex gap-2'>
												<select
													value={
														userSearch
															.filterBy
															.status ||
														'all'
													}
													onChange={(
														e
													) =>
														userSearch.updateFilter(
															'status',
															e
																.target
																.value
														)
													}
													className={cn(
														'px-3 py-2 rounded-lg border',
														isDark
															? 'bg-chat-secondary border-chat-accent/30 text-chat-accent'
															: 'bg-white border-chat-light-border text-chat-light-accent'
													)}
												>
													<option value='all'>
														All
														Status
													</option>
													<option value='active'>
														Active
													</option>
													<option value='suspended'>
														Suspended
													</option>
												</select>
												<select
													value={
														userSearch.sortBy
													}
													onChange={(
														e
													) =>
														userSearch.setSortBy(
															e
																.target
																.value
														)
													}
													className={cn(
														'px-3 py-2 rounded-lg border',
														isDark
															? 'bg-chat-secondary border-chat-accent/30 text-chat-accent'
															: 'bg-white border-chat-light-border text-chat-light-accent'
													)}
												>
													<option value='createdAt'>
														Newest
														First
													</option>
													<option value='name'>
														Name
													</option>
													<option value='email'>
														Email
													</option>
													<option value='lastActive'>
														Last
														Active
													</option>
												</select>
											</div>
										</div>

										{/* Results Summary */}
										{userSearch.hasActiveFilters && (
											<div className='flex items-center justify-between'>
												<p
													className={cn(
														'text-sm',
														isDark
															? 'text-chat-text/70'
															: 'text-chat-light-muted'
													)}
												>
													Showing{' '}
													{
														userSearch.filteredItems
													}{' '}
													of{' '}
													{
														userSearch.totalItems
													}{' '}
													users
												</p>
												<button
													onClick={
														userSearch.clearFilters
													}
													className={cn(
														'text-sm px-3 py-1 rounded-lg transition-colors',
														isDark
															? 'text-chat-pink hover:bg-chat-secondary'
															: 'text-chat-light-button-primary hover:bg-chat-light-hover'
													)}
												>
													Clear
													Filters
												</button>
											</div>
										)}

										{loading ? (
											<SkeletonList
												items={8}
											/>
										) : (
											<UserManagement
												users={
													userSearch.filteredData as unknown as UserAnalytics[]
												}
												onUserAction={
													handleUserAction
												}
											/>
										)}
									</div>
								)}

								{activeTab === 'health' &&
									systemHealth && (
										<SystemHealthComponent
											healthData={
												systemHealth
											}
											onRefresh={
												handleRefreshHealth
											}
										/>
									)}

								{activeTab === 'flags' && (
									<div className='space-y-6'>
										{/* Search and Filter Bar */}
										<div className='flex flex-col sm:flex-row gap-4'>
											<div className='relative flex-1'>
												<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-chat-accent/50' />
												<input
													type='text'
													placeholder='Search feature flags...'
													value={
														flagSearch.searchTerm
													}
													onChange={(
														e
													) =>
														flagSearch.setSearchTerm(
															e
																.target
																.value
														)
													}
													className={cn(
														'w-full pl-10 pr-4 py-2 rounded-lg border',
														isDark
															? 'bg-chat-secondary border-chat-accent/30 text-chat-accent'
															: 'bg-white border-chat-light-border text-chat-light-accent'
													)}
												/>
											</div>
											<div className='flex gap-2'>
												<select
													value={
														flagSearch
															.filterBy
															.category ||
														'all'
													}
													onChange={(
														e
													) =>
														flagSearch.updateFilter(
															'category',
															e
																.target
																.value
														)
													}
													className={cn(
														'px-3 py-2 rounded-lg border',
														isDark
															? 'bg-chat-secondary border-chat-accent/30 text-chat-accent'
															: 'bg-white border-chat-light-border text-chat-light-accent'
													)}
												>
													<option value='all'>
														All
														Categories
													</option>
													<option value='ui'>
														UI
													</option>
													<option value='api'>
														API
													</option>
													<option value='feature'>
														Feature
													</option>
													<option value='experiment'>
														Experiment
													</option>
												</select>
												<select
													value={
														flagSearch
															.filterBy
															.enabled ||
														'all'
													}
													onChange={(
														e
													) =>
														flagSearch.updateFilter(
															'enabled',
															e
																.target
																.value
														)
													}
													className={cn(
														'px-3 py-2 rounded-lg border',
														isDark
															? 'bg-chat-secondary border-chat-accent/30 text-chat-accent'
															: 'bg-white border-chat-light-border text-chat-light-accent'
													)}
												>
													<option value='all'>
														All
														Flags
													</option>
													<option value='enabled'>
														Enabled
													</option>
													<option value='disabled'>
														Disabled
													</option>
												</select>
											</div>
										</div>

										{/* Results Summary */}
										{flagSearch.hasActiveFilters && (
											<div className='flex items-center justify-between'>
												<p
													className={cn(
														'text-sm',
														isDark
															? 'text-chat-text/70'
															: 'text-chat-light-muted'
													)}
												>
													Showing{' '}
													{
														flagSearch.filteredItems
													}{' '}
													of{' '}
													{
														flagSearch.totalItems
													}{' '}
													flags
												</p>
												<button
													onClick={
														flagSearch.clearFilters
													}
													className={cn(
														'text-sm px-3 py-1 rounded-lg transition-colors',
														isDark
															? 'text-chat-pink hover:bg-chat-secondary'
															: 'text-chat-light-button-primary hover:bg-chat-light-hover'
													)}
												>
													Clear
													Filters
												</button>
											</div>
										)}

										{loading ? (
											<SkeletonTable
												rows={6}
												columns={5}
											/>
										) : (
											<FeatureFlags
												flags={
													flagSearch.filteredData as unknown as FeatureFlag[]
												}
												onToggleFlag={
													handleToggleFlag
												}
												onUpdateRollout={
													handleUpdateRollout
												}
												onCreateFlag={
													handleCreateFlag
												}
												onEditFlag={
													handleEditFlag
												}
												onDeleteFlag={
													handleDeleteFlag
												}
											/>
										)}
									</div>
								)}

								{activeTab ===
									'analytics' &&
									analytics && (
										<div
											className={cn(
												'p-6 rounded-xl border text-center',
												isDark
													? 'bg-chat-secondary border-chat-accent/30'
													: 'bg-white border-chat-light-border shadow-sm'
											)}
										>
											<BarChart3 className='w-16 h-16 text-chat-purple mx-auto mb-4' />
											<h3
												className={cn(
													'text-xl font-bold mb-2',
													isDark
														? 'text-chat-accent'
														: 'text-chat-light-accent'
												)}
											>
												Advanced
												Analytics
											</h3>
											<p
												className={cn(
													'text-sm',
													isDark
														? 'text-chat-text/70'
														: 'text-chat-light-muted'
												)}
											>
												Detailed
												analytics
												and
												reporting
												features
												coming
												soon...
											</p>
										</div>
									)}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
