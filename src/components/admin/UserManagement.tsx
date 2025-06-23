import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
	User,
	Calendar,
	Activity,
	MessageCircle,
	Brain,
	Palette,
	AlertTriangle,
	CheckCircle,
	Clock,
	Search,
	Filter,
	MoreVertical,
	Eye,
	UserX,
	UserCheck,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type {
	UserAnalytics,
	UserManagementProps,
} from '../../types/admin';
import { cn } from '../../utils/classNames';

const UserManagement: React.FC<UserManagementProps> = ({
	users,
	onUserAction,
}) => {
	const { isDark } = useTheme();
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState<
		'all' | 'active' | 'pending' | 'suspended'
	>('all');
	const [selectedUser, setSelectedUser] =
		useState<UserAnalytics | null>(null);
	const [actionMenuOpen, setActionMenuOpen] = useState<
		string | null
	>(null);

	// Filter users based on search and status
	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.firstName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			user.lastName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			user.email
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesStatus =
			filterStatus === 'all' ||
			user.accountStatus === filterStatus;

		return matchesSearch && matchesStatus;
	});

	const formatDate = (dateString: string) => {
		if (!dateString) return 'N/A';
		try {
			const date = new Date(dateString);
			if (Number.isNaN(date.getTime()))
				return 'Invalid Date';
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		} catch {
			return 'Invalid Date';
		}
	};

	const formatDuration = (seconds: number) => {
		if (
			!seconds ||
			Number.isNaN(seconds) ||
			seconds < 0
		)
			return '0m';
		const minutes = Math.floor(seconds / 60);
		return `${minutes}m`;
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'active':
				return (
					<CheckCircle className='w-4 h-4 text-green-500' />
				);
			case 'pending':
				return (
					<Clock className='w-4 h-4 text-yellow-500' />
				);
			case 'suspended':
				return (
					<AlertTriangle className='w-4 h-4 text-red-500' />
				);
			default:
				return (
					<User className='w-4 h-4 text-gray-500' />
				);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'text-green-600 bg-green-50 border-green-200';
			case 'pending':
				return 'text-yellow-600 bg-yellow-50 border-yellow-200';
			case 'suspended':
				return 'text-red-600 bg-red-50 border-red-200';
			default:
				return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	};

	const handleUserAction = (
		userId: string,
		action: 'suspend' | 'activate' | 'delete'
	) => {
		onUserAction(userId, action);
		setActionMenuOpen(null);
	};

	return (
		<div className='space-y-6'>
			{/* Header with Search and Filters */}
			<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
				<div>
					<h2
						className={cn(
							'text-2xl font-bold',
							isDark
								? 'text-white'
								: 'text-gray-900'
						)}
					>
						User Management
					</h2>
					<p
						className={cn(
							'text-sm mt-1',
							isDark
								? 'text-gray-400'
								: 'text-gray-600'
						)}
					>
						Manage users, view analytics, and
						monitor activity
					</p>
				</div>

				<div className='flex gap-3 w-full sm:w-auto'>
					{/* Search */}
					<div className='relative flex-1 sm:w-64'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
						<input
							type='text'
							placeholder='Search users...'
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(
									e.target.value
								)
							}
							className={cn(
								'w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2',
								isDark
									? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
									: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
							)}
						/>
					</div>

					{/* Status Filter */}
					<div className='relative'>
						<Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
						<select
							value={filterStatus}
							onChange={(e) =>
								setFilterStatus(
									e.target.value as
										| 'all'
										| 'active'
										| 'pending'
										| 'suspended'
								)
							}
							className={cn(
								'pl-10 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-2 appearance-none',
								isDark
									? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
									: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
							)}
						>
							<option value='all'>
								All Status
							</option>
							<option value='active'>
								Active
							</option>
							<option value='pending'>
								Pending
							</option>
							<option value='suspended'>
								Suspended
							</option>
						</select>
					</div>
				</div>
			</div>

			{/* Users Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
				{filteredUsers.map((user) => (
					<motion.div
						key={user.id}
						layout
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={cn(
							'rounded-xl border p-6 relative hover:shadow-lg transition-all duration-200',
							isDark
								? 'bg-gray-800 border-gray-700 hover:border-gray-600'
								: 'bg-white border-gray-200 hover:border-gray-300'
						)}
					>
						{/* User Header */}
						<div className='flex items-start justify-between mb-4'>
							<div className='flex items-center gap-3'>
								<div
									className={cn(
										'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white',
										'bg-gradient-to-r from-blue-500 to-purple-600'
									)}
								>
									{user.firstName.charAt(
										0
									)}
									{user.lastName.charAt(
										0
									)}
								</div>
								<div>
									<h3
										className={cn(
											'font-semibold',
											isDark
												? 'text-white'
												: 'text-gray-900'
										)}
									>
										{user.firstName}{' '}
										{user.lastName}
									</h3>
									<p
										className={cn(
											'text-sm',
											isDark
												? 'text-gray-400'
												: 'text-gray-600'
										)}
									>
										{user.email}
									</p>
								</div>
							</div>

							{/* Actions Menu */}
							<div className='relative'>
								<button
									onClick={() =>
										setActionMenuOpen(
											actionMenuOpen ===
												user.id
												? null
												: user.id
										)
									}
									className={cn(
										'p-1 rounded-lg transition-colors',
										isDark
											? 'hover:bg-gray-700 text-gray-400'
											: 'hover:bg-gray-100 text-gray-500'
									)}
								>
									<MoreVertical className='w-4 h-4' />
								</button>

								{actionMenuOpen ===
									user.id && (
									<motion.div
										initial={{
											opacity: 0,
											scale: 0.95,
										}}
										animate={{
											opacity: 1,
											scale: 1,
										}}
										className={cn(
											'absolute right-0 top-8 w-48 rounded-lg border shadow-lg z-10',
											isDark
												? 'bg-gray-800 border-gray-700'
												: 'bg-white border-gray-200'
										)}
									>
										<button
											onClick={() =>
												setSelectedUser(
													user
												)
											}
											className={cn(
												'w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
												isDark
													? 'text-gray-300'
													: 'text-gray-700'
											)}
										>
											<Eye className='w-4 h-4' />
											View Details
										</button>
										{user.accountStatus ===
										'active' ? (
											<button
												onClick={() =>
													handleUserAction(
														user.id,
														'suspend'
													)
												}
												className='w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors'
											>
												<UserX className='w-4 h-4' />
												Suspend User
											</button>
										) : (
											<button
												onClick={() =>
													handleUserAction(
														user.id,
														'activate'
													)
												}
												className='w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors'
											>
												<UserCheck className='w-4 h-4' />
												Activate
												User
											</button>
										)}
										<button
											onClick={() =>
												handleUserAction(
													user.id,
													'delete'
												)
											}
											className='w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-200 dark:border-gray-700'
										>
											<UserX className='w-4 h-4' />
											Delete User
										</button>
									</motion.div>
								)}
							</div>
						</div>

						{/* Status Badge */}
						<div
							className={cn(
								'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mb-4',
								isDark
									? getStatusColor(
											user.accountStatus
									  )
											.replace(
												'bg-',
												'bg-opacity-20 '
											)
											.replace(
												'text-',
												'text-'
											)
											.replace(
												'border-',
												'border-opacity-30 border-'
											)
									: getStatusColor(
											user.accountStatus
									  )
							)}
						>
							{getStatusIcon(
								user.accountStatus
							)}
							{user.accountStatus
								.charAt(0)
								.toUpperCase() +
								user.accountStatus.slice(1)}
						</div>

						{/* Stats Grid */}
						<div className='grid grid-cols-2 gap-4 mb-4'>
							<div
								className={cn(
									'p-3 rounded-lg',
									isDark
										? 'bg-gray-700/50'
										: 'bg-gray-50'
								)}
							>
								<div className='flex items-center gap-2 mb-1'>
									<MessageCircle className='w-4 h-4 text-blue-500' />
									<span
										className={cn(
											'text-xs font-medium',
											isDark
												? 'text-gray-400'
												: 'text-gray-600'
										)}
									>
										Messages
									</span>
								</div>
								<div
									className={cn(
										'text-xl font-bold',
										isDark
											? 'text-white'
											: 'text-gray-900'
									)}
								>
									{user.totalMessages}
								</div>
							</div>

							<div
								className={cn(
									'p-3 rounded-lg',
									isDark
										? 'bg-gray-700/50'
										: 'bg-gray-50'
								)}
							>
								<div className='flex items-center gap-2 mb-1'>
									<Activity className='w-4 h-4 text-green-500' />
									<span
										className={cn(
											'text-xs font-medium',
											isDark
												? 'text-gray-400'
												: 'text-gray-600'
										)}
									>
										Avg Session
									</span>
								</div>
								<div
									className={cn(
										'text-xl font-bold',
										isDark
											? 'text-white'
											: 'text-gray-900'
									)}
								>
									{formatDuration(
										user.averageSessionDuration
									)}
								</div>
							</div>
						</div>

						{/* Favorite Models */}
						<div className='mb-4'>
							<div className='flex items-center gap-2 mb-2'>
								<Brain className='w-4 h-4 text-purple-500' />
								<span
									className={cn(
										'text-sm font-medium',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Favorite Models
								</span>
							</div>
							<div className='space-y-1'>
								{user.favoriteModels
									.slice(0, 2)
									.map((model) => (
										<div
											key={
												model.modelId
											}
											className='flex items-center justify-between'
										>
											<span
												className={cn(
													'text-sm',
													isDark
														? 'text-gray-400'
														: 'text-gray-600'
												)}
											>
												{
													model.modelName
												}
											</span>
											<span
												className={cn(
													'text-xs px-2 py-0.5 rounded-full',
													isDark
														? 'bg-gray-700 text-gray-300'
														: 'bg-gray-100 text-gray-600'
												)}
											>
												{
													model.usageCount
												}{' '}
												uses
											</span>
										</div>
									))}
							</div>
						</div>

						{/* Settings Preview */}
						<div className='flex items-center gap-4 text-xs'>
							<div className='flex items-center gap-1'>
								<Palette className='w-3 h-3' />
								<span
									className={cn(
										'capitalize',
										isDark
											? 'text-gray-400'
											: 'text-gray-600'
									)}
								>
									{user.settings?.theme ||
										'default'}
								</span>
							</div>
							<div className='flex items-center gap-1'>
								<Activity className='w-3 h-3' />
								<span
									className={cn(
										isDark
											? 'text-gray-400'
											: 'text-gray-600'
									)}
								>
									{user.settings
										?.voiceEnabled
										? 'Voice On'
										: 'Voice Off'}
								</span>
							</div>
						</div>

						{/* Join Date */}
						<div
							className={cn(
								'mt-3 pt-3 border-t text-xs flex items-center gap-1',
								isDark
									? 'border-gray-700 text-gray-400'
									: 'border-gray-200 text-gray-500'
							)}
						>
							<Calendar className='w-3 h-3' />
							Joined{' '}
							{formatDate(user.createdAt)}
						</div>
					</motion.div>
				))}
			</div>

			{/* No Results */}
			{filteredUsers.length === 0 && (
				<div
					className={cn(
						'text-center py-12',
						isDark
							? 'text-gray-400'
							: 'text-gray-500'
					)}
				>
					<User className='w-12 h-12 mx-auto mb-4 opacity-50' />
					<p className='text-lg font-medium mb-2'>
						No users found
					</p>
					<p className='text-sm'>
						Try adjusting your search or filter
						criteria
					</p>
				</div>
			)}

			{/* User Detail Modal */}
			{selectedUser && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
					<motion.div
						initial={{
							opacity: 0,
							scale: 0.95,
						}}
						animate={{ opacity: 1, scale: 1 }}
						className={cn(
							'w-full max-w-2xl rounded-xl border p-6 max-h-[80vh] overflow-y-auto',
							isDark
								? 'bg-gray-800 border-gray-700'
								: 'bg-white border-gray-200'
						)}
					>
						{/* Modal Header */}
						<div className='flex items-center justify-between mb-6'>
							<h3
								className={cn(
									'text-xl font-bold',
									isDark
										? 'text-white'
										: 'text-gray-900'
								)}
							>
								User Details
							</h3>
							<button
								onClick={() =>
									setSelectedUser(null)
								}
								className={cn(
									'p-2 rounded-lg transition-colors',
									isDark
										? 'hover:bg-gray-700 text-gray-400'
										: 'hover:bg-gray-100 text-gray-500'
								)}
							>
								×
							</button>
						</div>

						{/* Detailed User Information */}
						<div className='space-y-6'>
							{/* Basic Info */}
							<div
								className={cn(
									'p-4 rounded-lg',
									isDark
										? 'bg-gray-700/50'
										: 'bg-gray-50'
								)}
							>
								<h4
									className={cn(
										'font-semibold mb-3',
										isDark
											? 'text-white'
											: 'text-gray-900'
									)}
								>
									Basic Information
								</h4>
								<div className='grid grid-cols-2 gap-4 text-sm'>
									<div>
										<span
											className={cn(
												'block font-medium',
												isDark
													? 'text-gray-400'
													: 'text-gray-600'
											)}
										>
											Name
										</span>
										<span
											className={cn(
												isDark
													? 'text-white'
													: 'text-gray-900'
											)}
										>
											{
												selectedUser.firstName
											}{' '}
											{
												selectedUser.lastName
											}
										</span>
									</div>
									<div>
										<span
											className={cn(
												'block font-medium',
												isDark
													? 'text-gray-400'
													: 'text-gray-600'
											)}
										>
											Email
										</span>
										<span
											className={cn(
												isDark
													? 'text-white'
													: 'text-gray-900'
											)}
										>
											{
												selectedUser.email
											}
										</span>
									</div>
									<div>
										<span
											className={cn(
												'block font-medium',
												isDark
													? 'text-gray-400'
													: 'text-gray-600'
											)}
										>
											Status
										</span>
										<span
											className={cn(
												'capitalize',
												isDark
													? 'text-white'
													: 'text-gray-900'
											)}
										>
											{
												selectedUser.accountStatus
											}
										</span>
									</div>
									<div>
										<span
											className={cn(
												'block font-medium',
												isDark
													? 'text-gray-400'
													: 'text-gray-600'
											)}
										>
											Verified
										</span>
										<span
											className={cn(
												isDark
													? 'text-white'
													: 'text-gray-900'
											)}
										>
											{selectedUser.isVerified
												? 'Yes'
												: 'No'}
										</span>
									</div>
								</div>
							</div>

							{/* Usage Statistics */}
							<div
								className={cn(
									'p-4 rounded-lg',
									isDark
										? 'bg-gray-700/50'
										: 'bg-gray-50'
								)}
							>
								<h4
									className={cn(
										'font-semibold mb-3',
										isDark
											? 'text-white'
											: 'text-gray-900'
									)}
								>
									Usage Statistics
								</h4>
								<div className='grid grid-cols-3 gap-4 text-sm'>
									<div className='text-center'>
										<div
											className={cn(
												'text-2xl font-bold mb-1',
												isDark
													? 'text-blue-400'
													: 'text-blue-600'
											)}
										>
											{
												selectedUser.totalChats
											}
										</div>
										<div
											className={cn(
												'text-xs',
												isDark
													? 'text-gray-400'
													: 'text-gray-600'
											)}
										>
											Total Chats
										</div>
									</div>
									<div className='text-center'>
										<div
											className={cn(
												'text-2xl font-bold mb-1',
												isDark
													? 'text-green-400'
													: 'text-green-600'
											)}
										>
											{
												selectedUser.totalMessages
											}
										</div>
										<div
											className={cn(
												'text-xs',
												isDark
													? 'text-gray-400'
													: 'text-gray-600'
											)}
										>
											Total Messages
										</div>
									</div>
									<div className='text-center'>
										<div
											className={cn(
												'text-2xl font-bold mb-1',
												isDark
													? 'text-purple-400'
													: 'text-purple-600'
											)}
										>
											{formatDuration(
												selectedUser.averageSessionDuration
											)}
										</div>
										<div
											className={cn(
												'text-xs',
												isDark
													? 'text-gray-400'
													: 'text-gray-600'
											)}
										>
											Avg Session
										</div>
									</div>
								</div>
							</div>

							{/* Model Usage */}
							<div
								className={cn(
									'p-4 rounded-lg',
									isDark
										? 'bg-gray-700/50'
										: 'bg-gray-50'
								)}
							>
								<h4
									className={cn(
										'font-semibold mb-3',
										isDark
											? 'text-white'
											: 'text-gray-900'
									)}
								>
									Model Preferences
								</h4>
								<div className='space-y-2'>
									{selectedUser.favoriteModels.map(
										(model) => (
											<div
												key={
													model.modelId
												}
												className='flex items-center justify-between'
											>
												<span
													className={cn(
														'text-sm font-medium',
														isDark
															? 'text-white'
															: 'text-gray-900'
													)}
												>
													{
														model.modelName
													}
												</span>
												<div className='flex items-center gap-2 text-xs'>
													<span
														className={cn(
															'px-2 py-1 rounded-full',
															isDark
																? 'bg-gray-600 text-gray-300'
																: 'bg-gray-200 text-gray-600'
														)}
													>
														{
															model.usageCount
														}{' '}
														uses
													</span>
													<span
														className={cn(
															isDark
																? 'text-gray-400'
																: 'text-gray-500'
														)}
													>
														Last:{' '}
														{formatDate(
															model.lastUsed
														)}
													</span>
												</div>
											</div>
										)
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default UserManagement;
