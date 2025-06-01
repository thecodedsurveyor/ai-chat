import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	callOpenRouter,
	DEFAULT_CONFIG,
} from '../../../utils/openRouter';
import {
	useInputStore,
	type Suggestion,
} from '../../../stores/inputStore';
import { useTheme } from '../../../contexts/ThemeContext';

interface SmartAutoCompleteProps {
	inputValue: string;
	onSelectSuggestion: (suggestion: string) => void;
	isVisible: boolean;
	position: { x: number; y: number };
	onClose: () => void;
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
	const { isDark } = useTheme();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const {
		autoSuggestions: suggestions,
		selectedSuggestionIndex: selectedIndex,
		setSuggestions,
	} = useInputStore();

	// Generate suggestions using OpenRouter API
	useEffect(() => {
		const generateSuggestions = async (
			input: string
		) => {
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
		};

		// Debounced suggestion generation
		const debounceTimer = setTimeout(() => {
			if (inputValue && isVisible) {
				generateSuggestions(inputValue);
			}
		}, 500);

		return () => clearTimeout(debounceTimer);
	}, [inputValue, isVisible, setSuggestions]);

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
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				className={`absolute z-50 w-full mt-1 overflow-hidden rounded-lg shadow-lg ${
					isDark
						? 'bg-chat-secondary border border-chat-accent/30'
						: 'bg-white border border-chat-purple/30'
				}`}
				style={{
					top: position.y,
					left: Math.max(
						10,
						Math.min(
							position.x,
							window.innerWidth - 320
						)
					),
					minWidth: '300px',
					maxWidth: '90vw',
				}}
			>
				<div className='py-1'>
					{isLoading ? (
						<div className='px-4 py-2 text-sm text-center'>
							<span
								className={
									isDark
										? 'text-chat-accent'
										: 'text-gray-500'
								}
							>
								Generating suggestions...
							</span>
						</div>
					) : suggestions.length === 0 ? (
						<div className='px-4 py-2 text-sm text-center'>
							<span
								className={
									isDark
										? 'text-chat-accent'
										: 'text-gray-500'
								}
							>
								No suggestions available
							</span>
						</div>
					) : (
						suggestions.map(
							(suggestion, index) => (
								<div
									key={suggestion.id}
									onClick={() =>
										onSelectSuggestion(
											suggestion.text
										)
									}
									className={`px-4 py-2 text-sm cursor-pointer ${
										index ===
										selectedIndex
											? isDark
												? 'bg-chat-accent/20 text-white'
												: 'bg-chat-purple/10 text-chat-purple'
											: isDark
											? 'text-white hover:bg-chat-accent/10'
											: 'text-gray-700 hover:bg-gray-100'
									}`}
								>
									{suggestion.text}
								</div>
							)
						)
					)}
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default SmartAutoComplete;
