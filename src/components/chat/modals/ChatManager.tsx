import React, { useState, useCallback } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { Chat, ChatCategory } from '../../../types';
import { cn } from '../../../utils/classNames';
// React Icons imports
import {
	MdSettings,
	MdClose,
	MdInfo,
	MdPushPin,
	MdBusiness,
	MdPerson,
	MdSearch,
	MdChat,
} from 'react-icons/md';

interface ChatManagerProps {
	chat: Chat;
	onUpdate: (
		chatId: string,
		updates: Partial<Chat>
	) => void;
	onClose: () => void;
	isVisible: boolean;
}

const CATEGORIES: {
	value: ChatCategory;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
}[] = [
	{
		value: 'work',
		label: 'Work',
		icon: MdBusiness,
		color: 'bg-blue-500',
	},
	{
		value: 'personal',
		label: 'Personal',
		icon: MdPerson,
		color: 'bg-green-500',
	},
	{
		value: 'research',
		label: 'Research',
		icon: MdSearch,
		color: 'bg-purple-500',
	},
	{
		value: 'general',
		label: 'General',
		icon: MdChat,
		color: 'bg-gray-500',
	},
];

const ChatManager: React.FC<ChatManagerProps> = ({
	chat,
	onUpdate,
	onClose,
	isVisible,
}) => {
	const { isDark } = useTheme();
	const [displayId, setDisplayId] = useState(
		chat.displayId
	);
	const [selectedCategory, setSelectedCategory] =
		useState<ChatCategory | ''>(chat.category || '');
	const [tags, setTags] = useState<string[]>(
		chat.tags || []
	);
	const [newTag, setNewTag] = useState('');
	const [isPinned, setIsPinned] = useState(
		chat.isPinned || false
	);

	const handleSave = useCallback(() => {
		onUpdate(chat.id, {
			displayId: displayId.trim() || chat.displayId,
			category: selectedCategory || undefined,
			tags: tags.length > 0 ? tags : undefined,
			isPinned,
			createdAt: chat.createdAt,
		});
		onClose();
	}, [
		chat.id,
		chat.displayId,
		chat.createdAt,
		displayId,
		selectedCategory,
		tags,
		isPinned,
		onUpdate,
		onClose,
	]);

	const addTag = useCallback(() => {
		const trimmedTag = newTag.trim().toLowerCase();
		if (trimmedTag && !tags.includes(trimmedTag)) {
			setTags((prev) => [...prev, trimmedTag]);
			setNewTag('');
		}
	}, [newTag, tags]);

	const removeTag = useCallback((tagToRemove: string) => {
		setTags((prev) =>
			prev.filter((tag) => tag !== tagToRemove)
		);
	}, []);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				addTag();
			}
		},
		[addTag]
	);

	if (!isVisible) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4'>
			<div
				className={cn(
					'w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl',
					isDark
						? 'bg-chat-primary border-2 border-chat-accent/30'
						: 'bg-white border-2 border-chat-pink/30'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'flex items-center justify-between p-4 sm:p-6 border-b-2',
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-pink/30'
					)}
				>
					<div className='flex items-center gap-2 sm:gap-3'>
						<div className='p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple'>
							<MdSettings className='text-white text-lg sm:text-xl' />
						</div>
						<h2
							className={cn(
								'text-lg sm:text-xl font-bold',
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							)}
						>
							Manage Chat
						</h2>
					</div>
					<button
						onClick={onClose}
						className={cn(
							'text-xl sm:text-2xl transition-colors p-2 rounded-lg',
							isDark
								? 'text-chat-accent hover:text-white hover:bg-chat-secondary'
								: 'text-chat-light-close-button hover:text-chat-light-close-button-hover hover:bg-gray-100'
						)}
					>
						<MdClose />
					</button>
				</div>

				{/* Content */}
				<div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
					{/* Chat Information - Show timestamps */}
					<div
						className={cn(
							'p-4 rounded-xl border-2',
							isDark
								? 'bg-chat-secondary/30 border-chat-accent/20'
								: 'bg-gray-50 border-gray-200'
						)}
					>
						<h3
							className={cn(
								'text-sm font-medium mb-3 flex items-center gap-2',
								isDark
									? 'text-chat-accent'
									: 'text-gray-700'
							)}
						>
							<MdInfo />
							Chat Information
						</h3>
						<div className='space-y-2 text-sm'>
							<div className='flex justify-between items-center'>
								<span
									className={cn(
										'text-xs',
										isDark
											? 'text-gray-400'
											: 'text-gray-600'
									)}
								>
									Created:
								</span>
								<span
									className={cn(
										'font-medium',
										isDark
											? 'text-chat-accent'
											: 'text-gray-800'
									)}
								>
									{new Date(
										chat.createdAt
									).toLocaleString()}
								</span>
							</div>
							{chat.lastActivity && (
								<div className='flex justify-between items-center'>
									<span
										className={cn(
											'text-xs',
											isDark
												? 'text-gray-400'
												: 'text-gray-600'
										)}
									>
										Last Activity:
									</span>
									<span
										className={cn(
											'font-medium',
											isDark
												? 'text-chat-accent'
												: 'text-gray-800'
										)}
									>
										{new Date(
											chat.lastActivity
										).toLocaleString()}
									</span>
								</div>
							)}
							<div className='flex justify-between items-center'>
								<span
									className={cn(
										'text-xs',
										isDark
											? 'text-gray-400'
											: 'text-gray-600'
									)}
								>
									Messages:
								</span>
								<span
									className={cn(
										'font-medium',
										isDark
											? 'text-chat-accent'
											: 'text-gray-800'
									)}
								>
									{chat.messages.length}
								</span>
							</div>
						</div>
					</div>

					{/* Chat Title */}
					<div>
						<label
							className={cn(
								'block text-sm font-medium mb-2',
								isDark
									? 'text-chat-accent'
									: 'text-gray-700'
							)}
						>
							Chat Title
						</label>
						<input
							type='text'
							value={displayId}
							onChange={(e) =>
								setDisplayId(e.target.value)
							}
							placeholder='Enter chat title...'
							className={cn(
								'w-full px-4 py-3 rounded-xl border-2 transition-colors',
								isDark
									? 'bg-chat-secondary border-chat-accent/30 text-white placeholder:text-gray-500 focus:border-chat-pink'
									: 'bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-chat-pink'
							)}
						/>
					</div>

					{/* Pin Toggle */}
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<MdPushPin
								className={cn(
									'text-xl',
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								)}
							/>
							<div>
								<label
									className={cn(
										'text-sm font-medium',
										isDark
											? 'text-chat-accent'
											: 'text-gray-700'
									)}
								>
									Pin Chat
								</label>
								<p className='text-xs text-gray-500'>
									Pinned chats appear at
									the top
								</p>
							</div>
						</div>
						<button
							onClick={() =>
								setIsPinned(!isPinned)
							}
							className={cn(
								'relative w-12 h-6 rounded-full transition-colors',
								isPinned
									? 'bg-gradient-to-r from-chat-pink to-chat-purple'
									: 'bg-gray-300'
							)}
						>
							<div
								className={cn(
									'absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform',
									isPinned
										? 'translate-x-6'
										: 'translate-x-0.5'
								)}
							></div>
						</button>
					</div>

					{/* Category Selection */}
					<div>
						<label
							className={cn(
								'block text-sm font-medium mb-3',
								isDark
									? 'text-chat-accent'
									: 'text-gray-700'
							)}
						>
							Category
						</label>
						<div className='grid grid-cols-2 gap-2'>
							{CATEGORIES.map((category) => (
								<button
									key={category.value}
									onClick={() =>
										setSelectedCategory(
											selectedCategory ===
												category.value
												? ''
												: category.value
										)
									}
									className={cn(
										'p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
										selectedCategory ===
											category.value
											? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white shadow-lg'
											: isDark
											? 'bg-chat-secondary text-chat-accent hover:bg-opacity-80 border border-chat-accent/20'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
									)}
								>
									<div
										className={cn(
											'w-3 h-3 rounded-full',
											selectedCategory ===
												category.value
												? 'bg-white'
												: category.color
										)}
									></div>
									<category.icon className='text-lg' />
									<span>
										{category.label}
									</span>
								</button>
							))}
						</div>
					</div>

					{/* Tags */}
					<div>
						<label
							className={cn(
								'block text-sm font-medium mb-3',
								isDark
									? 'text-chat-accent'
									: 'text-gray-700'
							)}
						>
							Tags
						</label>

						{/* Add new tag */}
						<div className='flex gap-2 mb-3'>
							<input
								type='text'
								value={newTag}
								onChange={(e) =>
									setNewTag(
										e.target.value
									)
								}
								onKeyPress={handleKeyPress}
								placeholder='Add tag...'
								className={cn(
									'flex-1 px-3 py-2 rounded-lg text-sm border-2',
									isDark
										? 'bg-chat-secondary border-chat-accent/30 text-white placeholder:text-gray-500'
										: 'bg-white border-gray-300 text-gray-800 placeholder:text-gray-500'
								)}
							/>
							<button
								onClick={addTag}
								disabled={!newTag.trim()}
								className='px-4 py-2 bg-gradient-to-r from-chat-pink to-chat-purple text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
							>
								Add
							</button>
						</div>

						{/* Current tags */}
						{tags.length > 0 && (
							<div className='flex flex-wrap gap-2'>
								{tags.map((tag) => (
									<span
										key={tag}
										className='px-3 py-1 bg-gradient-to-r from-chat-pink to-chat-purple text-white rounded-full text-xs font-medium flex items-center gap-1'
									>
										#{tag}
										<button
											onClick={() =>
												removeTag(
													tag
												)
											}
											className='hover:bg-white hover:bg-opacity-20 rounded-full p-0.5'
										>
											<MdClose className='text-xs' />
										</button>
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div
					className={cn(
						'flex justify-end gap-3 p-6 border-t-2',
						isDark
							? 'border-chat-accent/30'
							: 'border-chat-pink/30'
					)}
				>
					<button
						onClick={onClose}
						className={cn(
							'px-6 py-2 rounded-lg text-sm font-medium transition-colors',
							isDark
								? 'bg-chat-secondary text-chat-accent hover:bg-opacity-80'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						)}
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className='px-6 py-2 bg-gradient-to-r from-chat-pink to-chat-purple text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow'
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatManager;
