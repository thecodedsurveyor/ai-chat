import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Suggestion {
	id: string;
	text: string;
	confidence: number;
}

interface InputState {
	// Input state
	inputValue: string;
	autoSuggestions: Suggestion[];
	selectedSuggestionIndex: number;

	// Actions
	setInputValue: (value: string) => void;
	appendToInput: (text: string) => void;
	clearInput: () => void;
	updateInputValue: (
		e: React.ChangeEvent<HTMLInputElement>
	) => void;
	setSuggestions: (suggestions: Suggestion[]) => void;
	clearSuggestions: () => void;
	selectNextSuggestion: () => void;
	selectPrevSuggestion: () => void;
	getSelectedSuggestion: () => Suggestion | null;
}

export const useInputStore = create<InputState>()(
	devtools(
		(set, get) => ({
			// Initial state
			inputValue: '',
			autoSuggestions: [],
			selectedSuggestionIndex: 0,

			// Actions
			setInputValue: (value) =>
				set({ inputValue: value }),
			appendToInput: (text) =>
				set((state) => ({
					inputValue: state.inputValue + text,
				})),
			clearInput: () => set({ inputValue: '' }),
			updateInputValue: (e) =>
				set({ inputValue: e.target.value }),
			setSuggestions: (suggestions) =>
				set({
					autoSuggestions: suggestions,
					selectedSuggestionIndex: 0,
				}),
			clearSuggestions: () =>
				set({
					autoSuggestions: [],
					selectedSuggestionIndex: 0,
				}),
			selectNextSuggestion: () =>
				set((state) => {
					const {
						autoSuggestions,
						selectedSuggestionIndex,
					} = state;
					if (autoSuggestions.length === 0)
						return state;
					return {
						selectedSuggestionIndex:
							(selectedSuggestionIndex + 1) %
							autoSuggestions.length,
					};
				}),
			selectPrevSuggestion: () =>
				set((state) => {
					const {
						autoSuggestions,
						selectedSuggestionIndex,
					} = state;
					if (autoSuggestions.length === 0)
						return state;
					return {
						selectedSuggestionIndex:
							selectedSuggestionIndex === 0
								? autoSuggestions.length - 1
								: selectedSuggestionIndex -
								  1,
					};
				}),
			getSelectedSuggestion: () => {
				const {
					autoSuggestions,
					selectedSuggestionIndex,
				} = get();
				if (autoSuggestions.length === 0)
					return null;
				return autoSuggestions[
					selectedSuggestionIndex
				];
			},
		}),
		{
			name: 'input-store', // DevTools name
		}
	)
);

// Selectors for performance optimization
export const useInputValue = () =>
	useInputStore((state) => state.inputValue);
export const useAutoSuggestions = () =>
	useInputStore((state) => state.autoSuggestions);
export const useSelectedSuggestionIndex = () =>
	useInputStore((state) => state.selectedSuggestionIndex);
