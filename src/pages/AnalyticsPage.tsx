import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { AnalyticsEngine } from '../utils/analyticsUtils';
import type {
	Chat,
	AnalyticsData,
	AnalyticsTimeRange,
	ChartDataPoint,
} from '../types';
import { cn } from '../utils/classNames';
// React Icons imports
import {
	MdChat,
	MdMessage,
	MdAccessTime,
	MdStar,
} from 'react-icons/md';

interface AnalyticsPageProps {
	chats: Chat[];
	onViewFavorites?: () => void;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
	chats,
	onViewFavorites,
}) => {
	const navigate = useNavigate();
	const { isDark } = useTheme();
	const [timeRange, setTimeRange] =
		useState<AnalyticsTimeRange>('all');
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	// Handle refresh functionality
	const handleRefresh = () => {
		setIsRefreshing(true);
		setRefreshKey((prev) => prev + 1);

		// Simulate refresh delay for better UX
		setTimeout(() => {
			setIsRefreshing(false);
		}, 1000);
	};

	// Generate analytics data
	const analyticsData: AnalyticsData = useMemo(() => {
		return AnalyticsEngine.generateAnalytics(
			chats,
			timeRange
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chats, timeRange, refreshKey]); // refreshKey intentionally included to force refresh

	// Simple bar chart component
	const BarChart: React.FC<{
		data: ChartDataPoint[];
		title: string;
		height?: number;
	}> = ({ data, title, height = 200 }) => {
		const maxValue = Math.max(
			...data.map((d) => d.value)
		);

		return (
			<div
				className={cn(
					'p-4 rounded-xl border-2',
					isDark
						? 'bg-chat-secondary border-chat-accent/20'
						: 'bg-white border-chat-purple/20'
				)}
			>
				<h4
					className={cn(
						'text-lg font-semibold mb-4',
						isDark
							? 'text-white'
							: 'text-chat-light-text'
					)}
				>
					{title}
				</h4>
				<div
					className='flex items-end justify-between gap-2'
					style={{ height }}
				>
					{data.map((item, index) => (
						<div
							key={index}
							className='flex flex-col items-center flex-1'
						>
							<div
								className={cn(
									'w-full rounded-t-lg transition-all duration-300 hover:opacity-80',
									item.color ||
										'bg-gradient-to-t from-chat-pink to-chat-purple'
								)}
								style={{
									height: `${
										maxValue > 0
											? (item.value /
													maxValue) *
											  (height - 40)
											: 0
									}px`,
									minHeight:
										item.value > 0
											? '4px'
											: '0px',
								}}
								title={`${item.label}: ${item.value}`}
							/>
							<span
								className={cn(
									'text-xs mt-2 text-center',
									isDark
										? 'text-chat-accent'
										: 'text-chat-light-accent'
								)}
							>
								{item.label}
							</span>
							<span
								className={cn(
									'text-xs font-semibold',
									isDark
										? 'text-white'
										: 'text-chat-light-text'
								)}
							>
								{item.value}
							</span>
						</div>
					))}
				</div>
			</div>
		);
	};

	// Line chart component for trends
	const LineChart: React.FC<{
		data: { date: string; value: number }[];
		title: string;
		height?: number;
	}> = ({ data, title, height = 200 }) => {
		const maxValue = Math.max(
			...data.map((d) => d.value)
		);
		const minValue = Math.min(
			...data.map((d) => d.value)
		);
		const range = maxValue - minValue || 1;

		return (
			<div
				className={cn(
					'p-4 rounded-xl border-2',
					isDark
						? 'bg-chat-secondary border-chat-accent/20'
						: 'bg-white border-chat-purple/20'
				)}
			>
				<h4
					className={cn(
						'text-lg font-semibold mb-4',
						isDark
							? 'text-white'
							: 'text-chat-light-text'
					)}
				>
					{title}
				</h4>
				<div
					className='relative'
					style={{ height }}
				>
					<svg
						width='100%'
						height='100%'
						className='overflow-visible'
					>
						<polyline
							fill='none'
							stroke='url(#gradient)'
							strokeWidth='3'
							points={data
								.map((point, index) => {
									const x =
										(index /
											(data.length -
												1)) *
										100;
									const y =
										100 -
										((point.value -
											minValue) /
											range) *
											80;
									return `${x},${y}`;
								})
								.join(' ')}
						/>
						<defs>
							<linearGradient
								id='gradient'
								x1='0%'
								y1='0%'
								x2='100%'
								y2='0%'
							>
								<stop
									offset='0%'
									stopColor='#EC4899'
								/>
								<stop
									offset='100%'
									stopColor='#8B5CF6'
								/>
							</linearGradient>
						</defs>
						{data.map((point, index) => {
							const x =
								(index /
									(data.length - 1)) *
								100;
							const y =
								100 -
								((point.value - minValue) /
									range) *
									80;
							return (
								<circle
									key={index}
									cx={`${x}%`}
									cy={`${y}%`}
									r='4'
									fill='#EC4899'
									className='hover:r-6 transition-all'
								>
									<title>{`${point.date}: ${point.value}`}</title>
								</circle>
							);
						})}
					</svg>
				</div>
			</div>
		);
	};

	// Stat card component
	const getIconComponent = (iconName: string) => {
		switch (iconName) {
			case 'chat':
				return MdChat;
			case 'message':
				return MdMessage;
			case 'time':
				return MdAccessTime;
			case 'star':
				return MdStar;
			default:
				return MdChat;
		}
	};

	const StatCard: React.FC<{
		title: string;
		value: string | number;
		subtitle?: string;
		icon: string;
		color?: string;
		action?: { label: string; onClick: () => void };
	}> = ({
		title,
		value,
		subtitle,
		icon,
		color = 'from-chat-pink to-chat-purple',
		action,
	}) => {
		const IconComponent = getIconComponent(icon);

		return (
			<div
				className={cn(
					'p-6 rounded-xl border-2 relative overflow-hidden',
					isDark
						? 'bg-chat-secondary border-chat-accent/20'
						: 'bg-white border-chat-purple/20'
				)}
			>
				<div
					className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-10 -mt-10`}
				/>
				<div className='relative'>
					<div className='flex items-center justify-between mb-2'>
						<h4
							className={cn(
								'text-sm font-medium',
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							)}
						>
							{title}
						</h4>
						<IconComponent
							className={cn(
								'text-2xl',
								isDark
									? 'text-chat-orange'
									: 'text-chat-purple'
							)}
						/>
					</div>
					<div
						className={cn(
							'text-3xl font-bold mb-1',
							isDark
								? 'text-white'
								: 'text-chat-light-text'
						)}
					>
						{typeof value === 'number'
							? AnalyticsEngine.formatNumber(
									value
							  )
							: value}
					</div>
					{subtitle && (
						<p
							className={cn(
								'text-xs',
								isDark
									? 'text-chat-accent/80'
									: 'text-chat-light-accent/80'
							)}
						>
							{subtitle}
						</p>
					)}
				</div>
				{action && (
					<button
						onClick={action.onClick}
						className={cn(
							'px-2 py-1 rounded-full text-sm font-medium mt-2',
							'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
						)}
					>
						{action.label}
					</button>
				)}
			</div>
		);
	};

	const {
		usageStatistics,
		categoryStatistics,
		tagStatistics,
		conversationTrends,
		responseTimeMetrics,
		topicAnalysis,
		favoriteTopics,
	} = analyticsData;

	// Check if there are any chats
	const hasChats = chats.length > 0;

	// Empty state component
	const EmptyState = () => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='flex flex-col items-center justify-center min-h-[60vh] text-center'
		>
			<div className='text-8xl mb-6'>📊</div>
			<h2
				className={cn(
					'text-3xl font-bold mb-4',
					isDark
						? 'text-white'
						: 'text-chat-light-text'
				)}
			>
				No Analytics Data Yet
			</h2>
			<p
				className={cn(
					'text-lg mb-8 max-w-md',
					isDark
						? 'text-chat-accent'
						: 'text-chat-light-accent'
				)}
			>
				Start chatting with the AI to see your
				conversation analytics, usage patterns, and
				insights here.
			</p>
			<motion.button
				onClick={() => navigate(-1)}
				className='bg-gradient-to-r from-chat-pink to-chat-purple text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-chat-pink/30 transition-all duration-300'
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				Start Your First Chat
			</motion.button>
		</motion.div>
	);

	// If no chats, show empty state
	if (!hasChats) {
		return (
			<div
				className={cn(
					'min-h-screen',
					isDark
						? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
						: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'sticky top-0 z-10 border-b-2 backdrop-blur-sm',
						isDark
							? 'bg-chat-primary/90 border-chat-accent/30'
							: 'bg-white/90 border-chat-purple/30'
					)}
				>
					<div className='max-w-7xl mx-auto px-6 py-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-4'>
								<button
									onClick={() =>
										navigate(-1)
									}
									className={cn(
										'p-2 rounded-lg transition-colors',
										isDark
											? 'text-chat-accent hover:text-white hover:bg-chat-secondary'
											: 'text-chat-light-accent hover:text-chat-light-text hover:bg-gray-100'
									)}
								>
									<ArrowLeft className='w-5 h-5' />
								</button>
								<div>
									<h1
										className={cn(
											'text-3xl font-bold',
											isDark
												? 'text-white'
												: 'text-chat-light-text'
										)}
									>
										📊 Analytics
										Dashboard
									</h1>
									<p
										className={cn(
											'text-sm mt-1',
											isDark
												? 'text-chat-accent'
												: 'text-chat-light-accent'
										)}
									>
										Insights from your
										AI conversations
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Empty State Content */}
				<div className='max-w-7xl mx-auto px-6 py-8'>
					<EmptyState />
				</div>
			</div>
		);
	}

	// Prepare chart data
	const categoryChartData: ChartDataPoint[] =
		categoryStatistics.map((cat) => ({
			label: cat.category,
			value: cat.count,
			color: `bg-gradient-to-t from-blue-400 to-blue-600`,
		}));

	const tagChartData: ChartDataPoint[] = tagStatistics
		.slice(0, 8)
		.map((tag) => ({
			label: tag.tag,
			value: tag.count,
			color: `bg-gradient-to-t from-purple-400 to-purple-600`,
		}));

	const trendData = conversationTrends
		.slice(-14)
		.map((trend) => ({
			date: new Date(trend.date).toLocaleDateString(
				'en-US',
				{ month: 'short', day: 'numeric' }
			),
			value: trend.chatsCreated,
		}));

	const responseTimeData =
		responseTimeMetrics.responseTimeTrend.map(
			(trend) => ({
				date: new Date(
					trend.date
				).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
				}),
				value: Math.round(trend.time),
			})
		);

	return (
		<div
			className={cn(
				'min-h-screen',
				isDark
					? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
					: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
			)}
		>
			{/* Header */}
			<div
				className={cn(
					'sticky top-0 z-10 border-b-2 backdrop-blur-sm',
					isDark
						? 'bg-chat-primary/90 border-chat-accent/30'
						: 'bg-white/90 border-chat-purple/30'
				)}
			>
				<div className='max-w-7xl mx-auto px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-4'>
							<button
								onClick={() => navigate(-1)}
								className={cn(
									'p-2 rounded-lg transition-colors',
									isDark
										? 'text-chat-accent hover:text-white hover:bg-chat-secondary'
										: 'text-chat-light-accent hover:text-chat-light-text hover:bg-gray-100'
								)}
							>
								<ArrowLeft className='w-5 h-5' />
							</button>
							<div>
								<h1
									className={cn(
										'text-3xl font-bold',
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									)}
								>
									📊 Analytics Dashboard
								</h1>
								<p
									className={cn(
										'text-sm mt-1',
										isDark
											? 'text-chat-accent'
											: 'text-chat-light-accent'
									)}
								>
									Insights from your AI
									conversations
								</p>
							</div>
						</div>

						<div className='flex items-center gap-4'>
							{/* Time Range Selector */}
							<select
								value={timeRange}
								onChange={(e) =>
									setTimeRange(
										e.target
											.value as AnalyticsTimeRange
									)
								}
								className={cn(
									'px-4 py-2 rounded-lg border-2 text-sm font-medium',
									isDark
										? 'bg-chat-secondary text-white border-chat-accent/30'
										: 'bg-gray-50 text-chat-light-text border-chat-purple/30'
								)}
							>
								<option value='today'>
									Today
								</option>
								<option value='week'>
									This Week
								</option>
								<option value='month'>
									This Month
								</option>
								<option value='all'>
									All Time
								</option>
							</select>

							{/* Action Buttons */}
							<motion.button
								onClick={handleRefresh}
								disabled={isRefreshing}
								className={cn(
									'flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors',
									isDark
										? 'border-chat-accent/30 text-chat-accent hover:bg-chat-secondary/50 disabled:opacity-50'
										: 'border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50'
								)}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<motion.div
									animate={{
										rotate: isRefreshing
											? 360
											: 0,
									}}
									transition={{
										duration: 1,
										repeat: isRefreshing
											? Infinity
											: 0,
										ease: 'linear',
									}}
								>
									<RefreshCw className='w-4 h-4' />
								</motion.div>
								{isRefreshing
									? 'Refreshing...'
									: 'Refresh'}
							</motion.button>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-7xl mx-auto px-6 py-8 space-y-8'>
				{/* Overview Stats */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
				>
					<StatCard
						title='Total Chats'
						value={usageStatistics.totalChats}
						subtitle={`${usageStatistics.chatsCreatedThisWeek} this week`}
						icon='chat'
						color='from-blue-400 to-blue-600'
					/>
					<StatCard
						title='Total Messages'
						value={
							usageStatistics.totalMessages
						}
						subtitle={`${usageStatistics.messagesSentThisWeek} this week`}
						icon='message'
						color='from-green-400 to-green-600'
					/>
					<StatCard
						title='Average Response Time'
						value={AnalyticsEngine.formatDuration(
							responseTimeMetrics.averageResponseTime
						)}
						subtitle={`Fastest: ${AnalyticsEngine.formatDuration(
							responseTimeMetrics.fastestResponse
						)}`}
						icon='time'
						color='from-purple-400 to-purple-600'
					/>
					<StatCard
						title='Favorite Messages'
						value={
							favoriteTopics.favoriteMessages
						}
						subtitle={`${Math.round(
							(favoriteTopics.favoriteMessages /
								usageStatistics.totalMessages) *
								100
						)}% of total`}
						icon='star'
						color='from-yellow-400 to-yellow-600'
						action={
							onViewFavorites &&
							favoriteTopics.favoriteMessages >
								0
								? {
										label: 'View All',
										onClick:
											onViewFavorites,
								  }
								: undefined
						}
					/>
				</motion.div>

				{/* Charts Row 1 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className='grid grid-cols-1 lg:grid-cols-2 gap-6'
				>
					<BarChart
						data={categoryChartData}
						title='Chats by Category'
						height={250}
					/>
					<BarChart
						data={tagChartData}
						title='Most Used Tags'
						height={250}
					/>
				</motion.div>

				{/* Charts Row 2 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='grid grid-cols-1 lg:grid-cols-2 gap-6'
				>
					<LineChart
						data={trendData}
						title='Chat Creation Trend (Last 14 Days)'
						height={250}
					/>
					<LineChart
						data={responseTimeData}
						title='Response Time Trend (Last 7 Days)'
						height={250}
					/>
				</motion.div>

				{/* Detailed Stats */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className='grid grid-cols-1 lg:grid-cols-2 gap-6'
				>
					{/* Top Topics */}
					<div
						className={cn(
							'p-6 rounded-xl border-2',
							isDark
								? 'bg-chat-secondary border-chat-accent/20'
								: 'bg-white border-chat-purple/20'
						)}
					>
						<h4
							className={cn(
								'text-lg font-semibold mb-4',
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							)}
						>
							🔥 Top Discussion Topics
						</h4>
						<div className='space-y-3'>
							{topicAnalysis
								.slice(0, 8)
								.map((topic, index) => (
									<div
										key={index}
										className='flex items-center justify-between'
									>
										<span
											className={cn(
												'text-sm',
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											)}
										>
											{
												topic.topicKeyword
											}
										</span>
										<div className='flex items-center gap-2'>
											<div
												className={cn(
													'w-16 h-2 rounded-full bg-gradient-to-r from-chat-pink to-chat-purple opacity-60'
												)}
												style={{
													width: `${Math.max(
														20,
														(topic.frequency /
															topicAnalysis[0]
																?.frequency ||
															1) *
															60
													)}px`,
												}}
											/>
											<span
												className={cn(
													'text-xs font-semibold',
													isDark
														? 'text-white'
														: 'text-chat-light-text'
												)}
											>
												{
													topic.frequency
												}
											</span>
										</div>
									</div>
								))}
						</div>
					</div>

					{/* Usage Insights */}
					<div
						className={cn(
							'p-6 rounded-xl border-2',
							isDark
								? 'bg-chat-secondary border-chat-accent/20'
								: 'bg-white border-chat-purple/20'
						)}
					>
						<h4
							className={cn(
								'text-lg font-semibold mb-4',
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							)}
						>
							📈 Usage Insights
						</h4>
						<div className='space-y-4'>
							<div className='flex justify-between'>
								<span
									className={cn(
										'text-sm',
										isDark
											? 'text-chat-accent'
											: 'text-chat-light-accent'
									)}
								>
									Avg. Messages per Chat
								</span>
								<span
									className={cn(
										'font-semibold',
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									)}
								>
									{usageStatistics.averageMessagesPerChat.toFixed(
										1
									)}
								</span>
							</div>
							<div className='flex justify-between'>
								<span
									className={cn(
										'text-sm',
										isDark
											? 'text-chat-accent'
											: 'text-chat-light-accent'
									)}
								>
									Avg. Words per Message
								</span>
								<span
									className={cn(
										'font-semibold',
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									)}
								>
									{usageStatistics.averageWordsPerMessage.toFixed(
										1
									)}
								</span>
							</div>
							<div className='flex justify-between'>
								<span
									className={cn(
										'text-sm',
										isDark
											? 'text-chat-accent'
											: 'text-chat-light-accent'
									)}
								>
									Total Words
								</span>
								<span
									className={cn(
										'font-semibold',
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									)}
								>
									{AnalyticsEngine.formatNumber(
										usageStatistics.totalWords
									)}
								</span>
							</div>
							<div className='flex justify-between'>
								<span
									className={cn(
										'text-sm',
										isDark
											? 'text-chat-accent'
											: 'text-chat-light-accent'
									)}
								>
									User vs AI Messages
								</span>
								<span
									className={cn(
										'font-semibold',
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									)}
								>
									{
										usageStatistics.totalUserMessages
									}{' '}
									/{' '}
									{
										usageStatistics.totalAIMessages
									}
								</span>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Favorite Topics */}
				{favoriteTopics.topFavoriteKeywords.length >
					0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className={cn(
							'p-6 rounded-xl border-2',
							isDark
								? 'bg-chat-secondary border-chat-accent/20'
								: 'bg-white border-chat-purple/20'
						)}
					>
						<h4
							className={cn(
								'text-lg font-semibold mb-4',
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							)}
						>
							⭐ Your Favorite Topics
						</h4>
						<div className='flex flex-wrap gap-2'>
							{favoriteTopics.topFavoriteKeywords.map(
								(keyword, index) => (
									<span
										key={index}
										className={cn(
											'px-3 py-1 rounded-full text-sm font-medium',
											'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
										)}
									>
										{keyword}
									</span>
								)
							)}
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default AnalyticsPage;
