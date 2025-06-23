import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
	Flag,
	Settings,
	Users,
	Plus,
	Edit,
	Trash2,
	Globe,
	TestTube,
	Palette,
	Code,
	CheckCircle,
	XCircle,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type {
	FeatureFlag,
	FeatureFlagProps,
} from '../../types/admin';
import { cn } from '../../utils/classNames';

const FeatureFlags: React.FC<FeatureFlagProps> = ({
	flags,
	onToggleFlag,
	onUpdateRollout,
	onCreateFlag,
	onEditFlag,
	onDeleteFlag,
}) => {
	const { isDark } = useTheme();
	const [showCreateModal, setShowCreateModal] =
		useState(false);
	const [selectedFlag, setSelectedFlag] =
		useState<FeatureFlag | null>(null);
	const [filterCategory, setFilterCategory] = useState<
		'all' | 'ui' | 'api' | 'feature' | 'experiment'
	>('all');

	const [newFlag, setNewFlag] = useState({
		name: '',
		description: '',
		category: 'feature' as FeatureFlag['category'],
		environment:
			'development' as FeatureFlag['environment'],
		enabled: false,
		rolloutPercentage: 0,
		targetUsers: [] as string[],
		createdBy: 'admin-001',
	});

	const filteredFlags = flags.filter(
		(flag) =>
			filterCategory === 'all' ||
			flag.category === filterCategory
	);

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'ui':
				return (
					<Palette className='w-4 h-4 text-purple-500' />
				);
			case 'api':
				return (
					<Code className='w-4 h-4 text-blue-500' />
				);
			case 'feature':
				return (
					<Settings className='w-4 h-4 text-green-500' />
				);
			case 'experiment':
				return (
					<TestTube className='w-4 h-4 text-orange-500' />
				);
			default:
				return (
					<Flag className='w-4 h-4 text-gray-500' />
				);
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'ui':
				return isDark
					? 'text-purple-400 bg-purple-900/20'
					: 'text-purple-600 bg-purple-50';
			case 'api':
				return isDark
					? 'text-blue-400 bg-blue-900/20'
					: 'text-blue-600 bg-blue-50';
			case 'feature':
				return isDark
					? 'text-green-400 bg-green-900/20'
					: 'text-green-600 bg-green-50';
			case 'experiment':
				return isDark
					? 'text-orange-400 bg-orange-900/20'
					: 'text-orange-600 bg-orange-50';
			default:
				return isDark
					? 'text-gray-400 bg-gray-900/20'
					: 'text-gray-600 bg-gray-50';
		}
	};

	const getEnvironmentColor = (environment: string) => {
		switch (environment) {
			case 'production':
				return 'text-red-500';
			case 'staging':
				return 'text-yellow-500';
			case 'development':
				return 'text-green-500';
			default:
				return 'text-gray-500';
		}
	};

	const handleToggleFlag = (
		flagId: string,
		enabled: boolean
	) => {
		onToggleFlag(flagId, enabled);
	};

	const handleRolloutChange = (
		flagId: string,
		percentage: number
	) => {
		onUpdateRollout(flagId, percentage);
	};

	const handleCreateFlag = () => {
		if (newFlag.name && newFlag.description) {
			onCreateFlag(newFlag);
			setNewFlag({
				name: '',
				description: '',
				category: 'feature',
				environment: 'development',
				enabled: false,
				rolloutPercentage: 0,
				targetUsers: [],
				createdBy: 'admin-001',
			});
			setShowCreateModal(false);
		}
	};

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

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h2
						className={cn(
							'text-2xl font-bold',
							isDark
								? 'text-white'
								: 'text-gray-900'
						)}
					>
						Feature Flags
					</h2>
					<p
						className={cn(
							'text-sm mt-1',
							isDark
								? 'text-gray-400'
								: 'text-gray-600'
						)}
					>
						Manage feature rollouts and
						experimental functionality
					</p>
				</div>

				<div className='flex items-center gap-3'>
					{/* Category Filter */}
					<select
						value={filterCategory}
						onChange={(e) =>
							setFilterCategory(
								e.target.value as
									| 'all'
									| 'ui'
									| 'api'
									| 'feature'
									| 'experiment'
							)
						}
						className={cn(
							'px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 appearance-none',
							isDark
								? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
								: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
						)}
					>
						<option value='all'>
							All Categories
						</option>
						<option value='ui'>UI</option>
						<option value='api'>API</option>
						<option value='feature'>
							Feature
						</option>
						<option value='experiment'>
							Experiment
						</option>
					</select>

					{/* Create Flag Button */}
					<button
						onClick={() =>
							setShowCreateModal(true)
						}
						className={cn(
							'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
							'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
						)}
					>
						<Plus className='w-4 h-4' />
						Create Flag
					</button>
				</div>
			</div>

			{/* Flags Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{filteredFlags.map((flag) => (
					<motion.div
						key={flag.id}
						layout
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={cn(
							'rounded-xl border p-6 hover:shadow-lg transition-all duration-200',
							isDark
								? 'bg-gray-800 border-gray-700 hover:border-gray-600'
								: 'bg-white border-gray-200 hover:border-gray-300'
						)}
					>
						{/* Flag Header */}
						<div className='flex items-start justify-between mb-4'>
							<div className='flex-1'>
								<div className='flex items-center gap-3 mb-2'>
									<div
										className={cn(
											'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
											getCategoryColor(
												flag.category
											)
										)}
									>
										{getCategoryIcon(
											flag.category
										)}
										{flag.category.toUpperCase()}
									</div>
									<div
										className={cn(
											'flex items-center gap-1 text-xs',
											getEnvironmentColor(
												flag.environment
											)
										)}
									>
										<Globe className='w-3 h-3' />
										{flag.environment}
									</div>
								</div>
								<h3
									className={cn(
										'text-lg font-semibold mb-1',
										isDark
											? 'text-white'
											: 'text-gray-900'
									)}
								>
									{flag.name
										.replace(/_/g, ' ')
										.replace(
											/\b\w/g,
											(l) =>
												l.toUpperCase()
										)}
								</h3>
								<p
									className={cn(
										'text-sm',
										isDark
											? 'text-gray-400'
											: 'text-gray-600'
									)}
								>
									{flag.description}
								</p>
							</div>

							{/* Enable/Disable Toggle */}
							<div className='flex items-center gap-2'>
								<button
									onClick={() =>
										handleToggleFlag(
											flag.id,
											!flag.enabled
										)
									}
									className={cn(
										'relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
										flag.enabled
											? 'bg-green-500'
											: isDark
											? 'bg-gray-600'
											: 'bg-gray-300'
									)}
								>
									<span
										className={cn(
											'inline-block w-4 h-4 transform transition-transform bg-white rounded-full',
											flag.enabled
												? 'translate-x-6'
												: 'translate-x-1'
										)}
									/>
								</button>
								{flag.enabled ? (
									<CheckCircle className='w-5 h-5 text-green-500' />
								) : (
									<XCircle className='w-5 h-5 text-gray-400' />
								)}
							</div>
						</div>

						{/* Rollout Percentage */}
						<div className='mb-4'>
							<div className='flex items-center justify-between mb-2'>
								<span
									className={cn(
										'text-sm font-medium',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Rollout Percentage
								</span>
								<span
									className={cn(
										'text-sm font-bold',
										isDark
											? 'text-white'
											: 'text-gray-900'
									)}
								>
									{flag.rolloutPercentage}
									%
								</span>
							</div>
							<div
								className={cn(
									'w-full h-2 rounded-full',
									isDark
										? 'bg-gray-700'
										: 'bg-gray-200'
								)}
							>
								<div
									className='h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300'
									style={{
										width: `${flag.rolloutPercentage}%`,
									}}
								/>
							</div>
							{flag.enabled && (
								<div className='mt-2'>
									<input
										type='range'
										min='0'
										max='100'
										value={
											flag.rolloutPercentage
										}
										onChange={(e) =>
											handleRolloutChange(
												flag.id,
												parseInt(
													e.target
														.value
												)
											)
										}
										className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
									/>
								</div>
							)}
						</div>

						{/* Target Users */}
						{flag.targetUsers &&
							flag.targetUsers.length > 0 && (
								<div className='mb-4'>
									<div className='flex items-center gap-2 mb-2'>
										<Users className='w-4 h-4 text-blue-500' />
										<span
											className={cn(
												'text-sm font-medium',
												isDark
													? 'text-gray-300'
													: 'text-gray-700'
											)}
										>
											Target Users
										</span>
									</div>
									<div className='flex flex-wrap gap-1'>
										{flag.targetUsers
											.slice(0, 3)
											.map(
												(
													userId
												) => (
													<span
														key={
															userId
														}
														className={cn(
															'text-xs px-2 py-1 rounded-full',
															isDark
																? 'bg-gray-700 text-gray-300'
																: 'bg-gray-100 text-gray-600'
														)}
													>
														{
															userId
														}
													</span>
												)
											)}
										{flag.targetUsers
											.length > 3 && (
											<span
												className={cn(
													'text-xs px-2 py-1 rounded-full',
													isDark
														? 'bg-gray-700 text-gray-300'
														: 'bg-gray-100 text-gray-600'
												)}
											>
												+
												{flag
													.targetUsers
													.length -
													3}{' '}
												more
											</span>
										)}
									</div>
								</div>
							)}

						{/* Status Indicators */}
						<div className='flex items-center justify-between text-xs'>
							<div className='flex items-center gap-4'>
								<span
									className={cn(
										isDark
											? 'text-gray-400'
											: 'text-gray-600'
									)}
								>
									Created:{' '}
									{formatDate(
										flag.createdAt
									)}
								</span>
								<span
									className={cn(
										isDark
											? 'text-gray-400'
											: 'text-gray-600'
									)}
								>
									Modified:{' '}
									{formatDate(
										flag.lastModified
									)}
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<button
									onClick={() =>
										setSelectedFlag(
											flag
										)
									}
									className={cn(
										'p-1 rounded transition-colors',
										isDark
											? 'hover:bg-gray-700 text-gray-400'
											: 'hover:bg-gray-100 text-gray-500'
									)}
									title='Edit feature flag'
								>
									<Edit className='w-4 h-4' />
								</button>
								<button
									onClick={() =>
										onDeleteFlag(
											flag.id
										)
									}
									className={cn(
										'p-1 rounded transition-colors',
										isDark
											? 'hover:bg-gray-700 text-red-400'
											: 'hover:bg-gray-100 text-red-500'
									)}
									title='Delete feature flag'
								>
									<Trash2 className='w-4 h-4' />
								</button>
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* No Flags */}
			{filteredFlags.length === 0 && (
				<div
					className={cn(
						'text-center py-12',
						isDark
							? 'text-gray-400'
							: 'text-gray-500'
					)}
				>
					<Flag className='w-12 h-12 mx-auto mb-4 opacity-50' />
					<p className='text-lg font-medium mb-2'>
						No feature flags found
					</p>
					<p className='text-sm'>
						Create your first feature flag to
						get started
					</p>
				</div>
			)}

			{/* Edit Flag Modal */}
			{selectedFlag && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
					<motion.div
						initial={{
							opacity: 0,
							scale: 0.95,
						}}
						animate={{ opacity: 1, scale: 1 }}
						className={cn(
							'w-full max-w-md rounded-xl border p-6',
							isDark
								? 'bg-gray-800 border-gray-700'
								: 'bg-white border-gray-200'
						)}
					>
						<h3
							className={cn(
								'text-xl font-bold mb-4',
								isDark
									? 'text-white'
									: 'text-gray-900'
							)}
						>
							Edit Feature Flag
						</h3>

						<div className='space-y-4'>
							{/* Name */}
							<div>
								<label
									className={cn(
										'block text-sm font-medium mb-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Flag Name
								</label>
								<input
									type='text'
									value={
										selectedFlag.name
									}
									onChange={(e) =>
										setSelectedFlag({
											...selectedFlag,
											name: e.target
												.value,
										})
									}
									className={cn(
										'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2',
										isDark
											? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
											: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
									)}
								/>
							</div>

							{/* Description */}
							<div>
								<label
									className={cn(
										'block text-sm font-medium mb-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Description
								</label>
								<textarea
									value={
										selectedFlag.description
									}
									onChange={(e) =>
										setSelectedFlag({
											...selectedFlag,
											description:
												e.target
													.value,
										})
									}
									rows={3}
									className={cn(
										'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2',
										isDark
											? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
											: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
									)}
								/>
							</div>

							{/* Category */}
							<div>
								<label
									className={cn(
										'block text-sm font-medium mb-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Category
								</label>
								<select
									value={
										selectedFlag.category
									}
									onChange={(e) =>
										setSelectedFlag({
											...selectedFlag,
											category: e
												.target
												.value as FeatureFlag['category'],
										})
									}
									className={cn(
										'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2',
										isDark
											? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
											: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
									)}
								>
									<option value='feature'>
										Feature
									</option>
									<option value='ui'>
										UI
									</option>
									<option value='api'>
										API
									</option>
									<option value='experiment'>
										Experiment
									</option>
								</select>
							</div>

							{/* Environment */}
							<div>
								<label
									className={cn(
										'block text-sm font-medium mb-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Environment
								</label>
								<select
									value={
										selectedFlag.environment
									}
									onChange={(e) =>
										setSelectedFlag({
											...selectedFlag,
											environment: e
												.target
												.value as FeatureFlag['environment'],
										})
									}
									className={cn(
										'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2',
										isDark
											? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
											: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
									)}
								>
									<option value='development'>
										Development
									</option>
									<option value='staging'>
										Staging
									</option>
									<option value='production'>
										Production
									</option>
								</select>
							</div>

							{/* Enabled Toggle */}
							<div className='flex items-center justify-between'>
								<label
									className={cn(
										'text-sm font-medium',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Enabled
								</label>
								<button
									onClick={() =>
										setSelectedFlag({
											...selectedFlag,
											enabled:
												!selectedFlag.enabled,
										})
									}
									className={cn(
										'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
										selectedFlag.enabled
											? 'bg-blue-600'
											: isDark
											? 'bg-gray-600'
											: 'bg-gray-200'
									)}
								>
									<span
										className={cn(
											'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
											selectedFlag.enabled
												? 'translate-x-6'
												: 'translate-x-1'
										)}
									/>
								</button>
							</div>

							{/* Rollout Percentage */}
							<div>
								<label
									className={cn(
										'block text-sm font-medium mb-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Rollout Percentage:{' '}
									{
										selectedFlag.rolloutPercentage
									}
									%
								</label>
								<input
									type='range'
									min='0'
									max='100'
									value={
										selectedFlag.rolloutPercentage
									}
									onChange={(e) =>
										setSelectedFlag({
											...selectedFlag,
											rolloutPercentage:
												parseInt(
													e.target
														.value
												),
										})
									}
									className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
								/>
							</div>
						</div>

						{/* Modal Actions */}
						<div className='flex gap-3 mt-6'>
							<button
								onClick={() =>
									setSelectedFlag(null)
								}
								className={cn(
									'flex-1 px-4 py-2 rounded-lg border transition-colors',
									isDark
										? 'border-gray-600 text-gray-300 hover:bg-gray-700'
										: 'border-gray-300 text-gray-700 hover:bg-gray-50'
								)}
							>
								Cancel
							</button>
							<button
								onClick={() => {
									const editData = {
										name: selectedFlag.name,
										description:
											selectedFlag.description,
										category:
											selectedFlag.category,
										environment:
											selectedFlag.environment,
										enabled:
											selectedFlag.enabled,
										rolloutPercentage:
											selectedFlag.rolloutPercentage,
									};

									onEditFlag(
										selectedFlag.id,
										editData
									);
									setSelectedFlag(null);
								}}
								className={cn(
									'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
									'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
									'hover:from-blue-600 hover:to-purple-700'
								)}
							>
								Save Changes
							</button>
						</div>
					</motion.div>
				</div>
			)}

			{/* Create Flag Modal */}
			{showCreateModal && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
					<motion.div
						initial={{
							opacity: 0,
							scale: 0.95,
						}}
						animate={{ opacity: 1, scale: 1 }}
						className={cn(
							'w-full max-w-md rounded-xl border p-6',
							isDark
								? 'bg-gray-800 border-gray-700'
								: 'bg-white border-gray-200'
						)}
					>
						<h3
							className={cn(
								'text-xl font-bold mb-4',
								isDark
									? 'text-white'
									: 'text-gray-900'
							)}
						>
							Create Feature Flag
						</h3>

						<div className='space-y-4'>
							{/* Name */}
							<div>
								<label
									className={cn(
										'block text-sm font-medium mb-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Flag Name
								</label>
								<input
									type='text'
									value={newFlag.name}
									onChange={(e) =>
										setNewFlag(
											(prev) => ({
												...prev,
												name: e
													.target
													.value,
											})
										)
									}
									placeholder='e.g., new_dashboard_ui'
									className={cn(
										'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2',
										isDark
											? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
											: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
									)}
								/>
							</div>

							{/* Description */}
							<div>
								<label
									className={cn(
										'block text-sm font-medium mb-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Description
								</label>
								<textarea
									value={
										newFlag.description
									}
									onChange={(e) =>
										setNewFlag(
											(prev) => ({
												...prev,
												description:
													e.target
														.value,
											})
										)
									}
									placeholder='Describe what this flag controls...'
									rows={3}
									className={cn(
										'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2',
										isDark
											? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
											: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
									)}
								/>
							</div>

							{/* Category */}
							<div>
								<label
									className={cn(
										'block text-sm font-medium mb-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Category
								</label>
								<select
									value={newFlag.category}
									onChange={(e) =>
										setNewFlag(
											(prev) => ({
												...prev,
												category: e
													.target
													.value as FeatureFlag['category'],
											})
										)
									}
									className={cn(
										'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2',
										isDark
											? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
											: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
									)}
								>
									<option value='feature'>
										Feature
									</option>
									<option value='ui'>
										UI
									</option>
									<option value='api'>
										API
									</option>
									<option value='experiment'>
										Experiment
									</option>
								</select>
							</div>

							{/* Environment */}
							<div>
								<label
									className={cn(
										'block text-sm font-medium mb-2',
										isDark
											? 'text-gray-300'
											: 'text-gray-700'
									)}
								>
									Environment
								</label>
								<select
									value={
										newFlag.environment
									}
									onChange={(e) =>
										setNewFlag(
											(prev) => ({
												...prev,
												environment:
													e.target
														.value as FeatureFlag['environment'],
											})
										)
									}
									className={cn(
										'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2',
										isDark
											? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
											: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
									)}
								>
									<option value='development'>
										Development
									</option>
									<option value='staging'>
										Staging
									</option>
									<option value='production'>
										Production
									</option>
								</select>
							</div>
						</div>

						{/* Modal Actions */}
						<div className='flex gap-3 mt-6'>
							<button
								onClick={() =>
									setShowCreateModal(
										false
									)
								}
								className={cn(
									'flex-1 px-4 py-2 rounded-lg border transition-colors',
									isDark
										? 'border-gray-600 text-gray-300 hover:bg-gray-700'
										: 'border-gray-300 text-gray-700 hover:bg-gray-50'
								)}
							>
								Cancel
							</button>
							<button
								onClick={handleCreateFlag}
								disabled={
									!newFlag.name ||
									!newFlag.description
								}
								className={cn(
									'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
									'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
									'hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
								)}
							>
								Create Flag
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default FeatureFlags;
