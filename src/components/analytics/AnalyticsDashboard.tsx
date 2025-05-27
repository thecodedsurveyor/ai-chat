import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { AnalyticsEngine } from '../../utils/analyticsUtils';
import type {
	Chat,
	AnalyticsData,
	AnalyticsTimeRange,
	ChartDataPoint,
} from '../../types';
import { cn } from '../../utils/classNames';
// React Icons imports
import {
	MdClose,
	MdChat,
	MdMessage,
	MdAccessTime,
	MdStar,
} from 'react-icons/md';

interface AnalyticsDashboardProps {
	chats: Chat[];
	isVisible: boolean;
	onClose: () => void;
	onViewFavorites?: () => void;
}

const AnalyticsDashboard: React.FC<
	AnalyticsDashboardProps
> = ({ chats, isVisible, onClose, onViewFavorites }) => {
	const { isDark } = useTheme();
	const [timeRange, setTimeRange] =
		useState<AnalyticsTimeRange>('all');

	// Generate analytics data
	const analyticsData: AnalyticsData = useMemo(() => {
		return AnalyticsEngine.generateAnalytics(
			chats,
			timeRange
		);
	}, [chats, timeRange]);

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
					'p-3 sm:p-4 rounded-xl border-2',
					isDark
						? 'bg-chat-secondary border-chat-accent/20'
						: 'bg-white border-chat-purple/20'
				)}
			>
				<h4
					className={cn(
						'text-base sm:text-lg font-semibold mb-3 sm:mb-4',
						isDark
							? 'text-white'
							: 'text-chat-light-text'
					)}
				>
					{title}
				</h4>
				<div
					className='flex items-end justify-between gap-1 sm:gap-2'
					style={{
						height: `${Math.max(
							150,
							height
						)}px`,
					}}
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
									'text-xs mt-1 sm:mt-2 text-center truncate w-full',
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
					'p-3 sm:p-4 rounded-xl border-2',
					isDark
						? 'bg-chat-secondary border-chat-accent/20'
						: 'bg-white border-chat-purple/20'
				)}
			>
				<h4
					className={cn(
						'text-base sm:text-lg font-semibold mb-3 sm:mb-4',
						isDark
							? 'text-white'
							: 'text-chat-light-text'
					)}
				>
					{title}
				</h4>
				<div
					className='relative'
					style={{
						height: `${Math.max(
							150,
							height
						)}px`,
					}}
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
					'p-4 sm:p-6 rounded-xl border-2 relative overflow-hidden',
					isDark
						? 'bg-chat-secondary border-chat-accent/20'
						: 'bg-white border-chat-purple/20'
				)}
			>
				<div
					className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10`}
				/>
				<div className='relative'>
					<div className='flex items-center justify-between mb-2'>
						<h4
							className={cn(
								'text-xs sm:text-sm font-medium',
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							)}
						>
							{title}
						</h4>
						<IconComponent
							className={cn(
								'text-xl sm:text-2xl',
								isDark
									? 'text-chat-orange'
									: 'text-chat-purple'
							)}
						/>
					</div>
					<div
						className={cn(
							'text-2xl sm:text-3xl font-bold mb-1',
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
							'px-2 py-1 rounded-full text-xs sm:text-sm font-medium mt-2',
							'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
						)}
					>
						{action.label}
					</button>
				)}
			</div>
		);
	};

	if (!isVisible) return null;

	const {
		usageStatistics,
		categoryStatistics,
		tagStatistics,
		conversationTrends,
		responseTimeMetrics,
		topicAnalysis,
		favoriteTopics,
	} = analyticsData;

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
		<div className='fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm'>
			<div
				className={cn(
					'w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl border-2 shadow-2xl',
					isDark
						? 'bg-chat-primary border-chat-accent/30'
						: 'bg-white border-chat-purple/30'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'sticky top-0 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b-2 gap-4',
						isDark
							? 'bg-chat-primary border-chat-accent/30'
							: 'bg-white border-chat-purple/30'
					)}
				>
					<div className='flex-1 min-w-0'>
						<h2
							className={cn(
								'text-2xl sm:text-3xl font-bold',
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							)}
						>
							📊 Analytics Dashboard
						</h2>
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

					<div className='flex items-center gap-2 sm:gap-4 w-full sm:w-auto'>
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
								'flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border-2 text-sm font-medium',
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

						<button
							onClick={onClose}
							className={cn(
								'p-2 rounded-lg transition-colors flex-shrink-0',
								isDark
									? 'text-chat-accent hover:text-white hover:bg-chat-secondary'
									: 'text-chat-light-close-button hover:text-chat-light-close-button-hover hover:bg-gray-100'
							)}
						>
							<MdClose className='text-xl sm:text-2xl' />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className='p-3 sm:p-6 space-y-6 sm:space-y-8'>
					{/* Overview Stats */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6'>
						<StatCard
							title='Total Chats'
							value={
								usageStatistics.totalChats
							}
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
					</div>

					{/* Charts Row 1 */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
						<BarChart
							data={categoryChartData}
							title='Chats by Category'
							height={200}
						/>
						<BarChart
							data={tagChartData}
							title='Most Used Tags'
							height={200}
						/>
					</div>

					{/* Charts Row 2 */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
						<LineChart
							data={trendData}
							title='Chat Creation Trend (Last 14 Days)'
							height={200}
						/>
						<LineChart
							data={responseTimeData}
							title='Response Time Trend (Last 7 Days)'
							height={200}
						/>
					</div>

					{/* Detailed Stats */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
						{/* Top Topics */}
						<div
							className={cn(
								'p-4 sm:p-6 rounded-xl border-2',
								isDark
									? 'bg-chat-secondary border-chat-accent/20'
									: 'bg-white border-chat-purple/20'
							)}
						>
							<h4
								className={cn(
									'text-base sm:text-lg font-semibold mb-3 sm:mb-4',
									isDark
										? 'text-white'
										: 'text-chat-light-text'
								)}
							>
								🔥 Top Discussion Topics
							</h4>
							<div className='space-y-2 sm:space-y-3'>
								{topicAnalysis
									.slice(0, 8)
									.map((topic, index) => (
										<div
											key={index}
											className='flex items-center justify-between gap-2'
										>
											<span
												className={cn(
													'text-sm truncate flex-1',
													isDark
														? 'text-chat-accent'
														: 'text-chat-light-accent'
												)}
											>
												{
													topic.topicKeyword
												}
											</span>
											<div className='flex items-center gap-2 flex-shrink-0'>
												<div
													className={cn(
														'w-12 sm:w-16 h-2 rounded-full bg-gradient-to-r from-chat-pink to-chat-purple opacity-60'
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
														'text-xs font-semibold min-w-[2rem] text-right',
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
								'p-4 sm:p-6 rounded-xl border-2',
								isDark
									? 'bg-chat-secondary border-chat-accent/20'
									: 'bg-white border-chat-purple/20'
							)}
						>
							<h4
								className={cn(
									'text-base sm:text-lg font-semibold mb-3 sm:mb-4',
									isDark
										? 'text-white'
										: 'text-chat-light-text'
								)}
							>
								📈 Usage Insights
							</h4>
							<div className='space-y-3 sm:space-y-4'>
								<div className='flex justify-between items-center'>
									<span
										className={cn(
											'text-sm',
											isDark
												? 'text-chat-accent'
												: 'text-chat-light-accent'
										)}
									>
										Avg. Messages per
										Chat
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
								<div className='flex justify-between items-center'>
									<span
										className={cn(
											'text-sm',
											isDark
												? 'text-chat-accent'
												: 'text-chat-light-accent'
										)}
									>
										Avg. Words per
										Message
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
								<div className='flex justify-between items-center'>
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
								<div className='flex justify-between items-center'>
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
					</div>

					{/* Favorite Topics */}
					{favoriteTopics.topFavoriteKeywords
						.length > 0 && (
						<div
							className={cn(
								'p-4 sm:p-6 rounded-xl border-2',
								isDark
									? 'bg-chat-secondary border-chat-accent/20'
									: 'bg-white border-chat-purple/20'
							)}
						>
							<h4
								className={cn(
									'text-base sm:text-lg font-semibold mb-3 sm:mb-4',
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
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AnalyticsDashboard;
