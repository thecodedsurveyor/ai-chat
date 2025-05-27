import { useState, useCallback } from 'react';

// Simple toggle hook - pretty common pattern
export const useToggle = (initialValue = false) => {
	const [value, setValue] = useState(initialValue);

	const toggle = useCallback(() => {
		setValue((prev) => !prev);
	}, []);

	const setTrue = useCallback(() => {
		setValue(true);
	}, []);

	const setFalse = useCallback(() => {
		setValue(false);
	}, []);

	return { value, toggle, setTrue, setFalse, setValue };
};
