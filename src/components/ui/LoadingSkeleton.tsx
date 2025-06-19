import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/classNames';

interface SkeletonProps {
	className?: string;
	variant?: 'text' | 'rectangular' | 'circular';
	width?: string | number;
	height?: string | number;
	animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
	className,
	variant = 'text',
	width,
	height,
	animation = 'pulse',
}) => {
	const { isDark } = useTheme();

	const baseClasses = cn(
		'inline-block',
		animation === 'pulse' && 'animate-pulse',
		animation === 'wave' && 'animate-bounce',
		isDark
			? 'bg-chat-accent/20'
			: 'bg-chat-light-border',
		variant === 'text' && 'rounded-md',
		variant === 'rectangular' && 'rounded-lg',
		variant === 'circular' && 'rounded-full',
		className
	);

	const style: React.CSSProperties = {
		width:
			width ||
			(variant === 'text' ? '100%' : undefined),
		height:
			height ||
			(variant === 'text' ? '1em' : undefined),
	};

	return <div className={baseClasses} style={style} />;
};

// Pre-built skeleton components for common use cases
export const SkeletonCard: React.FC<{
	className?: string;
}> = ({ className }) => {
	const { isDark } = useTheme();

	return (
		<div
			className={cn(
				'p-4 md:p-6 rounded-xl border',
				isDark
					? 'bg-chat-secondary border-chat-accent/30'
					: 'bg-white border-chat-light-border shadow-sm',
				className
			)}
		>
			<div className='flex items-center gap-3 mb-4'>
				<Skeleton
					variant='circular'
					width={32}
					height={32}
				/>
				<div className='flex-1'>
					<Skeleton
						className='mb-2'
						width='60%'
						height={20}
					/>
					<Skeleton width='40%' height={16} />
				</div>
			</div>
			<div className='space-y-2'>
				<Skeleton height={16} />
				<Skeleton width='80%' height={16} />
				<Skeleton width='90%' height={16} />
			</div>
		</div>
	);
};

export const SkeletonTable: React.FC<{
	rows?: number;
	columns?: number;
	className?: string;
}> = ({ rows = 5, columns = 4, className }) => {
	const { isDark } = useTheme();

	return (
		<div
			className={cn(
				'rounded-xl border',
				isDark
					? 'bg-chat-secondary border-chat-accent/30'
					: 'bg-white border-chat-light-border shadow-sm',
				className
			)}
		>
			{/* Header */}
			<div className='p-4 border-b border-chat-accent/20'>
				<div
					className='grid gap-4'
					style={{
						gridTemplateColumns: `repeat(${columns}, 1fr)`,
					}}
				>
					{Array.from({ length: columns }).map(
						(_, i) => (
							<Skeleton
								key={i}
								height={20}
								width='70%'
							/>
						)
					)}
				</div>
			</div>

			{/* Rows */}
			<div className='divide-y divide-chat-accent/10'>
				{Array.from({ length: rows }).map(
					(_, rowIndex) => (
						<div key={rowIndex} className='p-4'>
							<div
								className='grid gap-4'
								style={{
									gridTemplateColumns: `repeat(${columns}, 1fr)`,
								}}
							>
								{Array.from({
									length: columns,
								}).map((_, colIndex) => (
									<Skeleton
										key={colIndex}
										height={16}
										width={
											colIndex === 0
												? '90%'
												: '60%'
										}
									/>
								))}
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export const SkeletonStats: React.FC<{
	count?: number;
	className?: string;
}> = ({ count = 4, className }) => {
	return (
		<div
			className={cn(
				'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6',
				className
			)}
		>
			{Array.from({ length: count }).map((_, i) => (
				<SkeletonCard key={i} />
			))}
		</div>
	);
};

export const SkeletonList: React.FC<{
	items?: number;
	showAvatar?: boolean;
	className?: string;
}> = ({ items = 6, showAvatar = true, className }) => {
	const { isDark } = useTheme();

	return (
		<div
			className={cn(
				'rounded-xl border',
				isDark
					? 'bg-chat-secondary border-chat-accent/30'
					: 'bg-white border-chat-light-border shadow-sm',
				className
			)}
		>
			<div className='divide-y divide-chat-accent/10'>
				{Array.from({ length: items }).map(
					(_, i) => (
						<div key={i} className='p-4'>
							<div className='flex items-center gap-3'>
								{showAvatar && (
									<Skeleton
										variant='circular'
										width={40}
										height={40}
									/>
								)}
								<div className='flex-1'>
									<Skeleton
										className='mb-2'
										width='70%'
										height={18}
									/>
									<Skeleton
										width='50%'
										height={14}
									/>
								</div>
								<div className='text-right'>
									<Skeleton
										width={60}
										height={16}
										className='mb-1'
									/>
									<Skeleton
										width={40}
										height={12}
									/>
								</div>
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default Skeleton;
