import React from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
	title: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
	title,
	description,
	children,
	className = '',
}) => {
	return (
		<div
			className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}
		>
			{/* Header Section */}
			<div className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='text-center'
					>
						<h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
							{title}
						</h1>
						{description && (
							<p className='text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
								{description}
							</p>
						)}
					</motion.div>
				</div>
			</div>

			{/* Main Content */}
			<main className='py-8'>{children}</main>
		</div>
	);
};

export default PageLayout;
