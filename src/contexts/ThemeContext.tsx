import React, {
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
	isDark: boolean;
	isLight: boolean;
};

const ThemeContext = createContext<
	ThemeContextType | undefined
>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error(
			'useTheme must be used within a ThemeProvider'
		);
	}
	return context;
};

type ThemeProviderProps = { children: React.ReactNode };
export const ThemeProvider = ({
	children,
}: ThemeProviderProps) => {
	const [theme, setTheme] = useState<Theme>(() => {
		// Check localStorage first, then system preference, fallback to dark
		const stored = localStorage.getItem(
			'theme'
		) as Theme | null;
		if (
			stored &&
			(stored === 'light' || stored === 'dark')
		) {
			return stored;
		}

		// Check system preference
		if (
			typeof window !== 'undefined' &&
			window.matchMedia
		) {
			return window.matchMedia(
				'(prefers-color-scheme: light)'
			).matches
				? 'light'
				: 'dark';
		}

		return 'dark';
	});

	useEffect(() => {
		// Update localStorage
		localStorage.setItem('theme', theme);

		// Update document class
		const root = document.documentElement;
		if (theme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}, [theme]);

	// Listen for system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia(
			'(prefers-color-scheme: light)'
		);
		const handleChange = (e: MediaQueryListEvent) => {
			// Only update if user hasn't manually set a preference
			const stored = localStorage.getItem('theme');
			if (!stored) {
				setTheme(e.matches ? 'light' : 'dark');
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () =>
			mediaQuery.removeEventListener(
				'change',
				handleChange
			);
	}, []);

	// Listen for theme changes from settings
	useEffect(() => {
		const handleThemeChange = (event: CustomEvent) => {
			const newTheme = event.detail.theme;
			if (
				newTheme === 'light' ||
				newTheme === 'dark'
			) {
				setTheme(newTheme);
			}
		};

		document.addEventListener(
			'themeChange',
			handleThemeChange as EventListener
		);
		return () => {
			document.removeEventListener(
				'themeChange',
				handleThemeChange as EventListener
			);
		};
	}, []);

	const toggleTheme = () => {
		setTheme((prev) =>
			prev === 'light' ? 'dark' : 'light'
		);
	};

	const value: ThemeContextType = {
		theme,
		toggleTheme,
		isDark: theme === 'dark',
		isLight: theme === 'light',
	};

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
};
