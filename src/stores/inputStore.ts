import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface InputState {
	// Input state
	inputValue: string;

	// Actions
	setInputValue: (value: string) => void;
	appendToInput: (text: string) => void;
	clearInput: () => void;
	updateInputValue: (
		e: React.ChangeEvent<HTMLInputElement>
	) => void;
}

export const useInputStore = create<InputState>()(
	devtools(
		(set) => ({
			// Initial state
			inputValue: '',

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
		}),
		{
			name: 'input-store', // DevTools name
		}
	)
);

// Selectors for performance optimization
export const useInputValue = () =>
	useInputStore((state) => state.inputValue);
