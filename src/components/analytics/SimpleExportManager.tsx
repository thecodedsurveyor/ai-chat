import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/classNames';
import { ExportManager as ExportUtil } from '../../utils/exportUtils';
import type {
	ExportManagerProps,
	ExportFormat,
} from '../../types';
// React Icons imports
import { MdDownload, MdClose } from 'react-icons/md';

const SimpleExportManager: React.FC<ExportManagerProps> = ({
	chats,
	isVisible,
	onClose,
}) => {
	const { isDark } = useTheme();
	const [isExporting, setIsExporting] = useState(false);
	const [selectedFormat, setSelectedFormat] =
		useState<ExportFormat>('json');

	const handleExport = async () => {
		try {
			setIsExporting(true);

			const options = {
				format: selectedFormat,
				includeTimestamps: true,
				includeMetadata: true,
			};

			await ExportUtil.exportChats(chats, options);
			onClose();
		} catch (error) {
			console.error('Export failed:', error);
			alert('Export failed. Please try again.');
		} finally {
			setIsExporting(false);
		}
	};

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div
				className={cn(
					'w-full max-w-md rounded-2xl shadow-2xl',
					isDark ? 'bg-chat-primary' : 'bg-white'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'flex items-center justify-between p-6 border-b-2',
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-pink/30'
					)}
				>
					<div className='flex items-center gap-3'>
						<div className='p-2 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple'>
							<MdDownload className='text-white text-xl' />
						</div>
						<h2
							className={cn(
								'text-xl font-bold',
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							)}
						>
							Export Chats
						</h2>
					</div>
					<button
						onClick={onClose}
						className={cn(
							'text-2xl transition-colors',
							isDark
								? 'text-chat-accent hover:text-white'
								: 'text-gray-500 hover:text-gray-700'
						)}
					>
						<MdClose />
					</button>
				</div>

				{/* Content */}
				<div className='p-6'>
					<div className='space-y-4'>
						<div>
							<h3
								className={cn(
									'text-lg font-semibold mb-3',
									isDark
										? 'text-white'
										: 'text-gray-800'
								)}
							>
								Choose Export Format
							</h3>
							<div className='grid grid-cols-2 gap-3'>
								{(
									[
										'json',
										'txt',
										'csv',
										'markdown',
									] as ExportFormat[]
								).map((format) => (
									<button
										key={format}
										onClick={() =>
											setSelectedFormat(
												format
											)
										}
										className={cn(
											'p-3 rounded-lg border-2 transition-all',
											selectedFormat ===
												format
												? 'border-chat-pink bg-chat-pink/10'
												: isDark
												? 'border-chat-accent/30 hover:border-chat-orange/40'
												: 'border-gray-300 hover:border-chat-pink/40',
											isDark
												? 'text-white'
												: 'text-gray-800'
										)}
									>
										<div className='font-semibold text-sm uppercase'>
											{format}
										</div>
										<div className='text-xs opacity-75 mt-1'>
											{format ===
												'json' &&
												'Structured data'}
											{format ===
												'txt' &&
												'Plain text'}
											{format ===
												'csv' &&
												'Spreadsheet'}
											{format ===
												'markdown' &&
												'Formatted'}
										</div>
									</button>
								))}
							</div>
						</div>

						<div
							className={cn(
								'p-3 rounded-lg border',
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/30'
									: 'bg-gray-50 border-gray-300'
							)}
						>
							<div className='text-sm space-y-1'>
								<div className='flex justify-between'>
									<span>
										Total Chats:
									</span>
									<span className='font-medium'>
										{chats.length}
									</span>
								</div>
								<div className='flex justify-between'>
									<span>
										Total Messages:
									</span>
									<span className='font-medium'>
										{chats.reduce(
											(sum, chat) =>
												sum +
												chat
													.messages
													.length,
											0
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div
					className={cn(
						'flex gap-3 p-6 border-t-2',
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-pink/30'
					)}
				>
					<button
						onClick={onClose}
						className={cn(
							'flex-1 px-4 py-2 rounded-lg border-2 transition-colors',
							isDark
								? 'border-chat-accent/30 text-chat-accent hover:bg-chat-secondary/50'
								: 'border-gray-300 text-gray-700 hover:bg-gray-100'
						)}
					>
						Cancel
					</button>
					<button
						onClick={handleExport}
						disabled={isExporting}
						className={cn(
							'flex-1 px-4 py-2 rounded-lg transition-colors font-medium',
							'bg-gradient-to-r from-chat-pink to-chat-purple text-white',
							'hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
							isExporting && 'animate-pulse'
						)}
					>
						{isExporting
							? 'Exporting...'
							: 'Export'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default SimpleExportManager;
