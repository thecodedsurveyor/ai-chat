import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
	Activity,
	CheckCircle,
	AlertTriangle,
	XCircle,
	Clock,
	Calendar,
	TrendingUp,
	Server,
	Database,
	Globe,
	Zap,
	Shield,
	RefreshCw,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Status = () => {
	const { isDark } = useTheme();
	const [selectedTimeframe, setSelectedTimeframe] =
		useState('7d');

	const overallStatus = {
		status: 'operational',
		message: 'All systems operational',
		lastUpdated: new Date().toISOString(),
	};

	const services = [
		{
			name: 'AI Chat API',
			status: 'operational',
			uptime: '99.98%',
			responseTime: '145ms',
			description:
				'Core chat functionality and AI responses',
			icon: <Zap className='w-5 h-5' />,
		},
		{
			name: 'Authentication Service',
			status: 'operational',
			uptime: '99.99%',
			responseTime: '89ms',
			description:
				'User login and account management',
			icon: <Shield className='w-5 h-5' />,
		},
		{
			name: 'Web Application',
			status: 'operational',
			uptime: '99.95%',
			responseTime: '234ms',
			description: 'Main web interface and dashboard',
			icon: <Globe className='w-5 h-5' />,
		},
		{
			name: 'Database Cluster',
			status: 'operational',
			uptime: '99.97%',
			responseTime: '12ms',
			description:
				'Data storage and retrieval systems',
			icon: <Database className='w-5 h-5' />,
		},
		{
			name: 'CDN & Static Assets',
			status: 'degraded',
			uptime: '99.89%',
			responseTime: '456ms',
			description:
				'Content delivery and static file serving',
			icon: <Server className='w-5 h-5' />,
		},
		{
			name: 'Email Service',
			status: 'operational',
			uptime: '99.94%',
			responseTime: '1.2s',
			description:
				'Notification and transactional emails',
			icon: <RefreshCw className='w-5 h-5' />,
		},
	];

	const incidents = [
		{
			id: 1,
			title: 'Increased API Response Times',
			status: 'investigating',
			severity: 'minor',
			startTime: '2024-01-15T14:30:00Z',
			description:
				'We are investigating reports of increased response times for the AI Chat API.',
			updates: [
				{
					time: '2024-01-15T14:45:00Z',
					message:
						'We have identified the cause and are implementing a fix.',
					status: 'update',
				},
				{
					time: '2024-01-15T14:30:00Z',
					message:
						'We are investigating reports of increased API response times.',
					status: 'investigating',
				},
			],
		},
		{
			id: 2,
			title: 'Scheduled Maintenance - Database Upgrade',
			status: 'scheduled',
			severity: 'maintenance',
			startTime: '2024-01-20T02:00:00Z',
			endTime: '2024-01-20T04:00:00Z',
			description:
				'Scheduled maintenance to upgrade our database infrastructure for improved performance.',
			updates: [],
		},
	];

	const metrics = {
		'7d': {
			uptime: '99.96%',
			incidents: 2,
			avgResponseTime: '187ms',
			data: [99.8, 99.9, 100, 99.7, 99.9, 100, 99.8],
		},
		'30d': {
			uptime: '99.94%',
			incidents: 5,
			avgResponseTime: '192ms',
			data: [
				99.5, 99.8, 99.9, 99.7, 99.6, 99.9, 100,
				99.8, 99.9, 99.7, 99.8, 99.9, 100, 99.6,
				99.8, 99.9, 99.7, 99.8, 99.9, 100, 99.7,
				99.8, 99.9, 99.6, 99.8, 99.9, 99.7, 99.8,
				99.9, 100,
			],
		},
		'90d': {
			uptime: '99.92%',
			incidents: 12,
			avgResponseTime: '198ms',
			data: Array.from(
				{ length: 90 },
				() => Math.random() * 2 + 98.5
			),
		},
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'operational':
				return 'text-green-500';
			case 'degraded':
				return 'text-yellow-500';
			case 'outage':
				return 'text-red-500';
			case 'maintenance':
				return 'text-blue-500';
			default:
				return 'text-gray-500';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'operational':
				return (
					<CheckCircle className='w-5 h-5 text-green-500' />
				);
			case 'degraded':
				return (
					<AlertTriangle className='w-5 h-5 text-yellow-500' />
				);
			case 'outage':
				return (
					<XCircle className='w-5 h-5 text-red-500' />
				);
			case 'maintenance':
				return (
					<Clock className='w-5 h-5 text-blue-500' />
				);
			default:
				return (
					<CheckCircle className='w-5 h-5 text-gray-500' />
				);
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'critical':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'major':
				return 'bg-orange-100 text-orange-800 border-orange-200';
			case 'minor':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'maintenance':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	return (
		<div
			className={`min-h-screen ${
				isDark
					? 'bg-chat-primary'
					: 'bg-chat-light-primary'
			}`}
		>
			{/* Header */}
			<section
				className={`py-20 ${
					isDark
						? 'bg-chat-secondary/30'
						: 'bg-white'
				}`}
			>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.div
						className='text-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className='flex items-center justify-center gap-3 mb-6'>
							<div className='p-3 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple'>
								<Activity className='w-8 h-8 text-white' />
							</div>
							<h1
								className={`text-4xl md:text-5xl font-exo font-bold ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								System Status
							</h1>
						</div>
						<div className='flex items-center justify-center gap-3 mb-4'>
							{getStatusIcon(
								overallStatus.status
							)}
							<p
								className={`text-xl ${getStatusColor(
									overallStatus.status
								)}`}
							>
								{overallStatus.message}
							</p>
						</div>
						<p
							className={`text-sm ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-500'
							}`}
						>
							Last updated:{' '}
							{new Date(
								overallStatus.lastUpdated
							).toLocaleString()}
						</p>
					</motion.div>
				</div>
			</section>

			{/* Services Status */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.h2
						className={`text-3xl font-exo font-bold mb-8 text-center ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						Service Status
					</motion.h2>
					<div className='space-y-4'>
						{services.map((service, index) => (
							<motion.div
								key={index}
								className={`p-6 rounded-xl border ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20'
										: 'bg-white border-gray-200 shadow-lg'
								}`}
								initial={{
									opacity: 0,
									y: 20,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								transition={{
									duration: 0.6,
									delay: index * 0.1,
								}}
							>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-4'>
										<div
											className={`p-2 rounded-lg ${
												service.status ===
												'operational'
													? 'bg-green-100 text-green-600'
													: service.status ===
													  'degraded'
													? 'bg-yellow-100 text-yellow-600'
													: 'bg-red-100 text-red-600'
											}`}
										>
											{service.icon}
										</div>
										<div>
											<h3
												className={`font-semibold ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{
													service.name
												}
											</h3>
											<p
												className={`text-sm ${
													isDark
														? 'text-chat-accent'
														: 'text-gray-600'
												}`}
											>
												{
													service.description
												}
											</p>
										</div>
									</div>
									<div className='flex items-center gap-6 text-right'>
										<div>
											<p
												className={`text-sm font-medium ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{
													service.uptime
												}
											</p>
											<p
												className={`text-xs ${
													isDark
														? 'text-chat-accent'
														: 'text-gray-500'
												}`}
											>
												Uptime
											</p>
										</div>
										<div>
											<p
												className={`text-sm font-medium ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{
													service.responseTime
												}
											</p>
											<p
												className={`text-xs ${
													isDark
														? 'text-chat-accent'
														: 'text-gray-500'
												}`}
											>
												Response
											</p>
										</div>
										<div className='flex items-center gap-2'>
											{getStatusIcon(
												service.status
											)}
											<span
												className={`text-sm font-medium capitalize ${getStatusColor(
													service.status
												)}`}
											>
												{
													service.status
												}
											</span>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Metrics */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.div
						className='text-center mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2
							className={`text-3xl font-exo font-bold mb-4 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Performance Metrics
						</h2>
						<div className='flex justify-center gap-2'>
							{['7d', '30d', '90d'].map(
								(timeframe) => (
									<button
										key={timeframe}
										onClick={() =>
											setSelectedTimeframe(
												timeframe
											)
										}
										className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
											selectedTimeframe ===
											timeframe
												? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
												: isDark
												? 'bg-chat-secondary/50 text-chat-accent hover:bg-chat-secondary'
												: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
										}`}
									>
										{timeframe === '7d'
											? '7 Days'
											: timeframe ===
											  '30d'
											? '30 Days'
											: '90 Days'}
									</button>
								)
							)}
						</div>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
						<motion.div
							className={`p-6 rounded-xl border text-center ${
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/20'
									: 'bg-white border-gray-200 shadow-lg'
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: 0.1,
							}}
						>
							<div className='flex items-center justify-center gap-2 mb-2'>
								<TrendingUp className='w-5 h-5 text-green-500' />
								<h3
									className={`font-semibold ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Uptime
								</h3>
							</div>
							<p
								className={`text-3xl font-bold text-green-500 mb-1`}
							>
								{
									metrics[
										selectedTimeframe as keyof typeof metrics
									].uptime
								}
							</p>
							<p
								className={`text-sm ${
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
							>
								Last{' '}
								{selectedTimeframe === '7d'
									? '7 days'
									: selectedTimeframe ===
									  '30d'
									? '30 days'
									: '90 days'}
							</p>
						</motion.div>

						<motion.div
							className={`p-6 rounded-xl border text-center ${
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/20'
									: 'bg-white border-gray-200 shadow-lg'
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: 0.2,
							}}
						>
							<div className='flex items-center justify-center gap-2 mb-2'>
								<Clock className='w-5 h-5 text-blue-500' />
								<h3
									className={`font-semibold ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Response Time
								</h3>
							</div>
							<p
								className={`text-3xl font-bold text-blue-500 mb-1`}
							>
								{
									metrics[
										selectedTimeframe as keyof typeof metrics
									].avgResponseTime
								}
							</p>
							<p
								className={`text-sm ${
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
							>
								Average
							</p>
						</motion.div>

						<motion.div
							className={`p-6 rounded-xl border text-center ${
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/20'
									: 'bg-white border-gray-200 shadow-lg'
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: 0.3,
							}}
						>
							<div className='flex items-center justify-center gap-2 mb-2'>
								<AlertTriangle className='w-5 h-5 text-orange-500' />
								<h3
									className={`font-semibold ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Incidents
								</h3>
							</div>
							<p
								className={`text-3xl font-bold text-orange-500 mb-1`}
							>
								{
									metrics[
										selectedTimeframe as keyof typeof metrics
									].incidents
								}
							</p>
							<p
								className={`text-sm ${
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
							>
								Total
							</p>
						</motion.div>
					</div>

					{/* Uptime Chart Placeholder */}
					<motion.div
						className={`p-8 rounded-xl border ${
							isDark
								? 'bg-chat-secondary/30 border-chat-accent/20'
								: 'bg-white border-gray-200 shadow-lg'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.4,
						}}
					>
						<h3
							className={`font-semibold mb-4 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Uptime History
						</h3>
						<div className='h-32 flex items-end gap-1'>
							{metrics[
								selectedTimeframe as keyof typeof metrics
							].data
								.slice(0, 30)
								.map((value, index) => (
									<div
										key={index}
										className={`flex-1 rounded-t ${
											value >= 99.5
												? 'bg-green-500'
												: value >=
												  98
												? 'bg-yellow-500'
												: 'bg-red-500'
										}`}
										style={{
											height: `${
												(value -
													97) *
												8
											}%`,
										}}
										title={`${value.toFixed(
											1
										)}% uptime`}
									/>
								))}
						</div>
						<div
							className={`flex justify-between mt-2 text-xs ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-500'
							}`}
						>
							<span>
								{selectedTimeframe === '7d'
									? '7 days ago'
									: selectedTimeframe ===
									  '30d'
									? '30 days ago'
									: '90 days ago'}
							</span>
							<span>Today</span>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Incidents */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.h2
						className={`text-3xl font-exo font-bold mb-8 text-center ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						Recent Incidents
					</motion.h2>
					<div className='space-y-6'>
						{incidents.map(
							(incident, index) => (
								<motion.div
									key={incident.id}
									className={`p-6 rounded-xl border ${
										isDark
											? 'bg-chat-secondary/30 border-chat-accent/20'
											: 'bg-white border-gray-200 shadow-lg'
									}`}
									initial={{
										opacity: 0,
										y: 20,
									}}
									animate={{
										opacity: 1,
										y: 0,
									}}
									transition={{
										duration: 0.6,
										delay: index * 0.1,
									}}
								>
									<div className='flex items-start justify-between mb-4'>
										<div className='flex-1'>
											<div className='flex items-center gap-3 mb-2'>
												<h3
													className={`font-semibold ${
														isDark
															? 'text-white'
															: 'text-gray-800'
													}`}
												>
													{
														incident.title
													}
												</h3>
												<span
													className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(
														incident.severity
													)}`}
												>
													{
														incident.severity
													}
												</span>
											</div>
											<p
												className={`text-sm mb-3 ${
													isDark
														? 'text-chat-accent'
														: 'text-gray-600'
												}`}
											>
												{
													incident.description
												}
											</p>
											<div
												className={`flex items-center gap-2 text-xs ${
													isDark
														? 'text-chat-accent'
														: 'text-gray-500'
												}`}
											>
												<Calendar className='w-3 h-3' />
												<span>
													Started:{' '}
													{new Date(
														incident.startTime
													).toLocaleString()}
												</span>
												{incident.endTime && (
													<>
														<span>
															•
														</span>
														<span>
															Ended:{' '}
															{new Date(
																incident.endTime
															).toLocaleString()}
														</span>
													</>
												)}
											</div>
										</div>
										<div className='flex items-center gap-2'>
											{getStatusIcon(
												incident.status
											)}
											<span
												className={`text-sm font-medium capitalize ${getStatusColor(
													incident.status
												)}`}
											>
												{
													incident.status
												}
											</span>
										</div>
									</div>
									{incident.updates
										.length > 0 && (
										<div className='border-t pt-4 mt-4'>
											<h4
												className={`font-medium mb-3 ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												Updates
											</h4>
											<div className='space-y-3'>
												{incident.updates.map(
													(
														update,
														updateIndex
													) => (
														<div
															key={
																updateIndex
															}
															className='flex gap-3'
														>
															<div
																className={`w-2 h-2 rounded-full mt-2 ${
																	update.status ===
																	'resolved'
																		? 'bg-green-500'
																		: update.status ===
																		  'update'
																		? 'bg-blue-500'
																		: 'bg-yellow-500'
																}`}
															/>
															<div className='flex-1'>
																<p
																	className={`text-sm ${
																		isDark
																			? 'text-chat-accent'
																			: 'text-gray-600'
																	}`}
																>
																	{
																		update.message
																	}
																</p>
																<p
																	className={`text-xs mt-1 ${
																		isDark
																			? 'text-chat-accent/70'
																			: 'text-gray-500'
																	}`}
																>
																	{new Date(
																		update.time
																	).toLocaleString()}
																</p>
															</div>
														</div>
													)
												)}
											</div>
										</div>
									)}
								</motion.div>
							)
						)}
					</div>
				</div>
			</section>

			{/* Subscribe to Updates */}
			<section
				className={`py-16 ${
					isDark
						? 'bg-chat-secondary/30'
						: 'bg-gray-50'
				}`}
			>
				<div className='max-w-4xl mx-auto px-6 text-center'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2
							className={`text-3xl font-exo font-bold mb-4 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Stay Updated
						</h2>
						<p
							className={`text-lg mb-8 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Subscribe to status updates and
							get notified about incidents and
							maintenance.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
							<input
								type='email'
								placeholder='Enter your email'
								className={`flex-1 px-6 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-chat-pink ${
									isDark
										? 'bg-chat-primary border-chat-accent/30 text-white placeholder:text-chat-accent/60'
										: 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
								}`}
							/>
							<motion.button
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-3 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Subscribe
							</motion.button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default Status;
