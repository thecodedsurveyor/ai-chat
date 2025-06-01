import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	callOpenRouter,
	DEFAULT_CONFIG,
} from '../../../utils/openRouter';

interface SmartAutoCompleteProps {
	inputValue: string;
	onSelectSuggestion: (suggestion: string) => void;
	isVisible: boolean;
	position: { x: number; y: number };
	onClose: () => void;
}

interface Suggestion {
	id: string;
	text: string;
	confidence: number;
}

const SmartAutoComplete: React.FC<
	SmartAutoCompleteProps
> = ({
	inputValue,
	onSelectSuggestion,
	isVisible,
	position,
	onClose,
}) => {
	const [suggestions, setSuggestions] = useState<
		Suggestion[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const debounceRef = useRef<NodeJS.Timeout | undefined>(
		undefined
	);

	// Generate suggestions using OpenRouter API
	const generateSuggestions = useCallback(
		async (input: string) => {
			if (input.length < 10) {
				setSuggestions([]);
				return;
			}

			setIsLoading(true);
			try {
				const prompt = `Complete this message naturally and contextually. Provide 3 different completion options as a JSON array of strings. Input: "${input}"

Format: ["completion1", "completion2", "completion3"]`;

				const conversation = [
					{
						role: 'system' as const,
						content:
							'You are a helpful assistant that provides smart text completions.',
					},
					{
						role: 'user' as const,
						content: prompt,
					},
				];

				const response = await callOpenRouter(
					conversation,
					{
						...DEFAULT_CONFIG,
						max_tokens: 100,
					}
				);

				// Try to parse JSON response
				let parsedSuggestions: string[] = [];
				try {
					parsedSuggestions =
						JSON.parse(response);
				} catch {
					// Fallback to simple suggestions if JSON parsing fails
					parsedSuggestions = [
						input +
							' and I would like to know more about this.',
						input +
							' Can you help me understand this better?',
						input +
							' What are your thoughts on this?',
					];
				}

				const formattedSuggestions: Suggestion[] =
					parsedSuggestions
						.slice(0, 3)
						.map((text, index) => ({
							id: `suggestion-${index}`,
							text: text.trim(),
							confidence: 1 - index * 0.1,
						}));

				setSuggestions(formattedSuggestions);
				setSelectedIndex(0);
			} catch (error) {
				console.error(
					'Error generating suggestions:',
					error
				);
				// Provide fallback suggestions
				setSuggestions([
					{
						id: 'fallback-1',
						text:
							input +
							' and I would like to know more.',
						confidence: 0.9,
					},
					{
						id: 'fallback-2',
						text:
							input +
							' Can you explain this further?',
						confidence: 0.8,
					},
					{
						id: 'fallback-3',
						text:
							input +
							' What do you think about this?',
						confidence: 0.7,
					},
				]);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	// Debounced suggestion generation
	useEffect(() => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			if (inputValue && isVisible) {
				generateSuggestions(inputValue);
			}
		}, 500);

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [inputValue, isVisible, generateSuggestions]);

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isVisible || suggestions.length === 0)
				return;

			switch (event.key) {
				case 'ArrowDown':
					event.preventDefault();
					setSelectedIndex((prev) =>
						prev < suggestions.length - 1
							? prev + 1
							: 0
					);
					break;
				case 'ArrowUp':
					event.preventDefault();
					setSelectedIndex((prev) =>
						prev > 0
							? prev - 1
							: suggestions.length - 1
					);
					break;
				case 'Tab':
				case 'Enter':
					event.preventDefault();
					if (suggestions[selectedIndex]) {
						onSelectSuggestion(
							suggestions[selectedIndex].text
						);
					}
					break;
				case 'Escape':
					event.preventDefault();
					onClose();
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () =>
			document.removeEventListener(
				'keydown',
				handleKeyDown
			);
	}, [
		isVisible,
		suggestions,
		selectedIndex,
		onSelectSuggestion,
		onClose,
	]);

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

	if (!isVisible) return null;

	return (
		<AnimatePresence>
			<motion.div
				ref={dropdownRef}
				initial={{
					opacity: 0,
					y: -10,
					scale: 0.95,
				}}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: -10, scale: 0.95 }}
				transition={{ duration: 0.2 }}
				className='fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-md min-w-[300px]'
				style={{
					left: Math.max(
						10,
						Math.min(
							position.x,
							window.innerWidth - 320
						)
					),
					top: position.y - 120,
				}}
			>
				{/* Header */}
				<div className='px-3 py-2 border-b border-gray-200 dark:border-gray-700'>
					<div className='flex items-center justify-between'>
						<span className='text-xs font-medium text-gray-600 dark:text-gray-400'>
							Smart Suggestions
						</span>
						{isLoading && (
							<div className='w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin'></div>
						)}
					</div>
				</div>

				{/* Suggestions List */}
				<div className='max-h-40 overflow-y-auto'>
					{suggestions.length > 0
						? suggestions.map(
								(suggestion, index) => (
									<motion.button
										key={suggestion.id}
										initial={{
											opacity: 0,
											x: -10,
										}}
										animate={{
											opacity: 1,
											x: 0,
										}}
										transition={{
											delay:
												index *
												0.05,
										}}
										onClick={() =>
											onSelectSuggestion(
												suggestion.text
											)
										}
										className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
											index ===
											selectedIndex
												? 'bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-500'
												: ''
										}`}
									>
										<div className='text-gray-900 dark:text-gray-100'>
											{
												suggestion.text
											}
										</div>
										<div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
											Confidence:{' '}
											{Math.round(
												suggestion.confidence *
													100
											)}
											%
										</div>
									</motion.button>
								)
						  )
						: !isLoading && (
								<div className='px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center'>
									Type more to see
									suggestions...
								</div>
						  )}
				</div>

				{/* Footer */}
				<div className='px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg'>
					<div className='text-xs text-gray-500 dark:text-gray-400'>
						Use ↑↓ to navigate, Tab/Enter to
						select, Esc to close
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default SmartAutoComplete;
