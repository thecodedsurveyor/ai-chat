import React from 'react';
import { motion } from 'framer-motion';
import {
	Server,
	Database,
	AlertTriangle,
	CheckCircle,
	Clock,
	RefreshCw,
	Activity,
	Cpu,
	HardDrive,
	Zap,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { SystemHealthProps } from '../../types/admin';
import { cn } from '../../utils/classNames';

const SystemHealth: React.FC<SystemHealthProps> = ({
	healthData,
	onRefresh,
}) => {
	const { isDark } = useTheme();

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'online':
				return (
					<CheckCircle className='w-4 h-4 text-green-500' />
				);
			case 'degraded':
				return (
					<AlertTriangle className='w-4 h-4 text-yellow-500' />
				);
			case 'offline':
				return (
					<AlertTriangle className='w-4 h-4 text-red-500' />
				);
			default:
				return (
					<Clock className='w-4 h-4 text-gray-500' />
				);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'online':
				return isDark
					? 'text-green-400 bg-green-900/20'
					: 'text-green-600 bg-green-50';
			case 'degraded':
				return isDark
					? 'text-yellow-400 bg-yellow-900/20'
					: 'text-yellow-600 bg-yellow-50';
			case 'offline':
				return isDark
					? 'text-red-400 bg-red-900/20'
					: 'text-red-600 bg-red-50';
			default:
				return isDark
					? 'text-gray-400 bg-gray-900/20'
					: 'text-gray-600 bg-gray-50';
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'critical':
				return 'text-red-500';
			case 'high':
				return 'text-orange-500';
			case 'medium':
				return 'text-yellow-500';
			case 'low':
				return 'text-blue-500';
			default:
				return 'text-gray-500';
		}
	};

	const formatTimestamp = (timestamp: string) => {
		return new Date(timestamp).toLocaleString();
	};

	const getMetricIcon = (metric: string) => {
		switch (metric) {
			case 'apiResponseTime':
				return (
					<Zap className='w-5 h-5 text-blue-500' />
				);
			case 'databaseConnections':
				return (
					<Database className='w-5 h-5 text-green-500' />
				);
			case 'activeUsers':
				return (
					<Activity className='w-5 h-5 text-purple-500' />
				);
			case 'errorRate':
				return (
					<AlertTriangle className='w-5 h-5 text-red-500' />
				);
			case 'memoryUsage':
				return (
					<Server className='w-5 h-5 text-orange-500' />
				);
			case 'cpuUsage':
				return (
					<Cpu className='w-5 h-5 text-yellow-500' />
				);
			case 'diskUsage':
				return (
					<HardDrive className='w-5 h-5 text-indigo-500' />
				);
			default:
				return (
					<Activity className='w-5 h-5 text-gray-500' />
				);
		}
	};

	const getMetricLabel = (metric: string) => {
		switch (metric) {
			case 'apiResponseTime':
				return 'API Response Time';
			case 'databaseConnections':
				return 'DB Connections';
			case 'activeUsers':
				return 'Active Users';
			case 'errorRate':
				return 'Error Rate';
			case 'memoryUsage':
				return 'Memory Usage';
			case 'cpuUsage':
				return 'CPU Usage';
			case 'diskUsage':
				return 'Disk Usage';
			default:
				return metric;
		}
	};

	const formatMetricValue = (
		metric: string,
		value: number
	) => {
		switch (metric) {
			case 'apiResponseTime':
				return `${value}ms`;
			case 'errorRate':
				return `${(value * 100).toFixed(2)}%`;
			case 'memoryUsage':
			case 'cpuUsage':
			case 'diskUsage':
				return `${value.toFixed(1)}%`;
			default:
				return value.toString();
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
						System Health
					</h2>
					<p
						className={cn(
							'text-sm mt-1',
							isDark
								? 'text-gray-400'
								: 'text-gray-600'
						)}
					>
						Real-time system monitoring and
						service status
					</p>
				</div>

				<div className='flex items-center gap-3'>
					{/* Overall Status */}
					<div
						className={cn(
							'flex items-center gap-2 px-3 py-2 rounded-lg',
							healthData.status === 'healthy'
								? isDark
									? 'bg-green-900/20 text-green-400'
									: 'bg-green-50 text-green-600'
								: healthData.status ===
								  'warning'
								? isDark
									? 'bg-yellow-900/20 text-yellow-400'
									: 'bg-yellow-50 text-yellow-600'
								: isDark
								? 'bg-red-900/20 text-red-400'
								: 'bg-red-50 text-red-600'
						)}
					>
						{healthData.status === 'healthy' ? (
							<CheckCircle className='w-4 h-4' />
						) : (
							<AlertTriangle className='w-4 h-4' />
						)}
						<span className='font-medium capitalize'>
							{healthData.status}
						</span>
					</div>

					{/* Refresh Button */}
					<button
						onClick={onRefresh}
						className={cn(
							'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
							isDark
								? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
								: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
						)}
					>
						<RefreshCw className='w-4 h-4' />
						Refresh
					</button>
				</div>
			</div>

			{/* Metrics Grid */}
			<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
				{Object.entries(healthData.metrics).map(
					([key, value]) => (
						<motion.div
							key={key}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className={cn(
								'p-4 rounded-xl border',
								isDark
									? 'bg-gray-800 border-gray-700'
									: 'bg-white border-gray-200'
							)}
						>
							<div className='flex items-center gap-2 mb-2'>
								{getMetricIcon(key)}
								<span
									className={cn(
										'text-xs font-medium',
										isDark
											? 'text-gray-400'
											: 'text-gray-600'
									)}
								>
									{getMetricLabel(key)}
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
								{formatMetricValue(
									key,
									value
								)}
							</div>
							{/* Progress bar for percentage metrics */}
							{[
								'memoryUsage',
								'cpuUsage',
								'diskUsage',
							].includes(key) && (
								<div
									className={cn(
										'w-full h-1.5 rounded-full mt-2',
										isDark
											? 'bg-gray-700'
											: 'bg-gray-200'
									)}
								>
									<div
										className={cn(
											'h-full rounded-full transition-all duration-300',
											value > 80
												? 'bg-red-500'
												: value > 60
												? 'bg-yellow-500'
												: 'bg-green-500'
										)}
										style={{
											width: `${Math.min(
												value,
												100
											)}%`,
										}}
									/>
								</div>
							)}
						</motion.div>
					)
				)}
			</div>

			{/* Services Status */}
			<div
				className={cn(
					'rounded-xl border p-6',
					isDark
						? 'bg-gray-800 border-gray-700'
						: 'bg-white border-gray-200'
				)}
			>
				<h3
					className={cn(
						'text-lg font-semibold mb-4',
						isDark
							? 'text-white'
							: 'text-gray-900'
					)}
				>
					Service Status
				</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					{healthData.services.map((service) => (
						<div
							key={service.name}
							className={cn(
								'p-4 rounded-lg border',
								isDark
									? 'bg-gray-700/50 border-gray-600'
									: 'bg-gray-50 border-gray-200'
							)}
						>
							<div className='flex items-center justify-between mb-2'>
								<span
									className={cn(
										'font-medium',
										isDark
											? 'text-white'
											: 'text-gray-900'
									)}
								>
									{service.name}
								</span>
								{getStatusIcon(
									service.status
								)}
							</div>

							<div
								className={cn(
									'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
									getStatusColor(
										service.status
									)
								)}
							>
								{service.status
									.charAt(0)
									.toUpperCase() +
									service.status.slice(1)}
							</div>

							<div
								className={cn(
									'mt-2 text-xs',
									isDark
										? 'text-gray-400'
										: 'text-gray-600'
								)}
							>
								Response:{' '}
								{service.responseTime}ms
							</div>
							<div
								className={cn(
									'text-xs',
									isDark
										? 'text-gray-400'
										: 'text-gray-600'
								)}
							>
								Last check:{' '}
								{formatTimestamp(
									service.lastCheck
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Recent Errors */}
			<div
				className={cn(
					'rounded-xl border p-6',
					isDark
						? 'bg-gray-800 border-gray-700'
						: 'bg-white border-gray-200'
				)}
			>
				<h3
					className={cn(
						'text-lg font-semibold mb-4',
						isDark
							? 'text-white'
							: 'text-gray-900'
					)}
				>
					Recent Errors
				</h3>

				{healthData.recentErrors.length > 0 ? (
					<div className='space-y-3'>
						{healthData.recentErrors.map(
							(error) => (
								<div
									key={error.id}
									className={cn(
										'p-4 rounded-lg border-l-4',
										error.severity ===
											'critical'
											? 'border-red-500 bg-red-50 dark:bg-red-900/10'
											: error.severity ===
											  'high'
											? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
											: error.severity ===
											  'medium'
											? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
											: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
									)}
								>
									<div className='flex items-start justify-between'>
										<div className='flex-1'>
											<div className='flex items-center gap-2 mb-1'>
												<AlertTriangle
													className={cn(
														'w-4 h-4',
														getSeverityColor(
															error.severity
														)
													)}
												/>
												<span
													className={cn(
														'text-xs font-medium uppercase tracking-wide',
														getSeverityColor(
															error.severity
														)
													)}
												>
													{
														error.severity
													}
												</span>
												<span
													className={cn(
														'text-xs',
														isDark
															? 'text-gray-400'
															: 'text-gray-600'
													)}
												>
													{
														error.service
													}
												</span>
											</div>
											<p
												className={cn(
													'text-sm font-medium mb-1',
													isDark
														? 'text-white'
														: 'text-gray-900'
												)}
											>
												{
													error.message
												}
											</p>
											<p
												className={cn(
													'text-xs',
													isDark
														? 'text-gray-400'
														: 'text-gray-600'
												)}
											>
												{formatTimestamp(
													error.timestamp
												)}
											</p>
										</div>
									</div>
								</div>
							)
						)}
					</div>
				) : (
					<div
						className={cn(
							'text-center py-8',
							isDark
								? 'text-gray-400'
								: 'text-gray-500'
						)}
					>
						<CheckCircle className='w-12 h-12 mx-auto mb-4 opacity-50' />
						<p className='text-lg font-medium mb-2'>
							No recent errors
						</p>
						<p className='text-sm'>
							System is running smoothly
						</p>
					</div>
				)}
			</div>

			{/* Last Updated */}
			<div
				className={cn(
					'text-center text-xs',
					isDark
						? 'text-gray-400'
						: 'text-gray-500'
				)}
			>
				Last updated:{' '}
				{formatTimestamp(healthData.timestamp)}
			</div>
		</div>
	);
};

export default SystemHealth;
