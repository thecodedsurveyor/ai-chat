import React, { useEffect, useRef } from 'react';
import { useInputStore } from '../../../stores/inputStore';
import { useTheme } from '../../../contexts/ThemeContext';
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdAutoAwesome,
} from 'react-icons/md';

interface SmartAutoCompleteProps {
	inputValue: string;
	onSelectSuggestion: (suggestion: string) => void;
	isVisible: boolean;
	onClose: () => void;
}

const SmartAutoComplete: React.FC<
	SmartAutoCompleteProps
> = ({
	inputValue,
	onSelectSuggestion,
	isVisible,
	onClose,
}) => {
	const { isDark } = useTheme();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const {
		autoSuggestions: suggestions,
		selectedSuggestionIndex: selectedIndex,
		setSuggestions,
	} = useInputStore();

	// Immediately set mock suggestions when input changes and length is sufficient
	useEffect(() => {
		// Only show suggestions if input is between 10 and 60 characters
		if (
			isVisible &&
			inputValue &&
			inputValue.length >= 10 &&
			inputValue.length <= 60
		) {
			// Create mock suggestions based on current input
			const mockSuggestions = [
				{
					id: 'mock-1',
					text: `${inputValue} and I would like to know more about this topic.`,
					confidence: 0.9,
				},
				{
					id: 'mock-2',
					text: `${inputValue} Could you explain this concept in more detail?`,
					confidence: 0.8,
				},
				{
					id: 'mock-3',
					text: `${inputValue} What are the practical applications of this?`,
					confidence: 0.7,
				},
			];

			// Check if suggestions are different from current ones to prevent unnecessary updates
			const currentSuggestions =
				useInputStore.getState().autoSuggestions;
			const hasChanged =
				mockSuggestions.length !==
					currentSuggestions.length ||
				mockSuggestions.some(
					(suggestion, index) =>
						suggestion.text !==
						(currentSuggestions[index]?.text ||
							'')
				);

			if (hasChanged) {
				setSuggestions(mockSuggestions);
			}
		} else if (inputValue.length > 60) {
			// Close suggestions if input is too long
			onClose();
		}
	}, [inputValue, isVisible, onClose]); // Remove setSuggestions from dependencies

	// Ensure cleanup when component unmounts or becomes invisible
	useEffect(() => {
		if (!isVisible) {
			// Clear suggestions from the store when component becomes invisible
			useInputStore.getState().clearSuggestions();
		}
	}, [isVisible]);

	// Close when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(
					event.target as Node
				)
			) {
				onClose();
			}
		};

		if (isVisible) {
			document.addEventListener(
				'mousedown',
				handleClickOutside
			);
		}

		return () =>
			document.removeEventListener(
				'mousedown',
				handleClickOutside
			);
	}, [isVisible, onClose]);

	if (!isVisible) {
		return null;
	}

	// Determine the bubble color based on theme
	const bubbleColor = isDark
		? 'bg-chat-secondary'
		: 'bg-white';
	const bubbleBorder = isDark
		? 'border-chat-pink/50'
		: 'border-chat-purple/50';

	return (
		<div
			ref={dropdownRef}
			style={{
				position: 'absolute',
				bottom: '100%', // Position directly above the input element
				left: '50%',
				transform: 'translateX(-50%)',
				marginBottom: '15px', // Add margin to create space between input and suggestions
				zIndex: 9999,
				width: '90%',
				maxWidth: '600px',
			}}
			className={`relative rounded-2xl shadow-xl ${bubbleColor} border-2 ${bubbleBorder}`}
		>
			{/* Header */}
			<div
				className={`p-3 flex justify-between items-center rounded-t-2xl ${
					isDark
						? 'bg-chat-accent/20 border-b border-chat-accent/30'
						: 'bg-chat-purple/10 border-b border-chat-purple/30'
				}`}
			>
				<div className='flex items-center'>
					<MdAutoAwesome
						className={`mr-2 ${
							isDark
								? 'text-chat-pink'
								: 'text-chat-purple'
						}`}
					/>
					<span
						className={`text-base font-medium ${
							isDark
								? 'text-white'
								: 'text-gray-700'
						}`}
					>
						Auto-Suggestions (
						{suggestions.length})
					</span>
				</div>
				<div className='flex text-xs text-gray-500'>
					<span className='mr-1'>Use</span>
					<MdKeyboardArrowUp className='mx-1' />
					<MdKeyboardArrowDown className='mx-1' />
					<span className='mx-1'>or</span>
					<kbd
						className={`px-1.5 py-0.5 rounded ${
							isDark
								? 'bg-chat-accent/30 text-white'
								: 'bg-gray-200 text-gray-700'
						}`}
					>
						Tab
					</kbd>
				</div>
			</div>

			{/* Suggestions */}
			<div className='p-2 max-h-60 overflow-y-auto'>
				{suggestions.length === 0 ? (
					<div className='p-4 text-center'>
						<span
							className={
								isDark
									? 'text-gray-400'
									: 'text-gray-500'
							}
						>
							Type more to see suggestions...
						</span>
					</div>
				) : (
					suggestions.map((suggestion, index) => (
						<div
							key={suggestion.id}
							onClick={() =>
								onSelectSuggestion(
									suggestion.text
								)
							}
							className={`p-3 my-1 rounded-lg cursor-pointer text-sm transition-colors ${
								index === selectedIndex
									? isDark
										? 'bg-chat-accent/30 text-white border-l-4 border-chat-pink'
										: 'bg-chat-purple/20 text-chat-purple border-l-4 border-chat-purple'
									: isDark
									? 'text-white hover:bg-chat-accent/10'
									: 'text-gray-700 hover:bg-gray-100'
							}`}
						>
							{suggestion.text}
						</div>
					))
				)}
			</div>

			{/* Footer */}
			<div
				className={`p-2 flex justify-end border-t rounded-b-2xl ${
					isDark
						? 'border-chat-accent/30'
						: 'border-gray-200'
				}`}
			>
				<button
					onClick={onClose}
					className={`px-4 py-2 rounded-lg text-sm ${
						isDark
							? 'bg-chat-accent/20 text-white hover:bg-chat-accent/30'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
					}`}
				>
					Close
				</button>
			</div>

			{/* Chat bubble pointer */}
			<div
				className={`absolute w-5 h-5 rotate-45 bottom-[-10px] left-1/2 transform -translate-x-1/2 ${bubbleColor} border-r-2 border-b-2 ${bubbleBorder}`}
			></div>
		</div>
	);
};

export default SmartAutoComplete;
