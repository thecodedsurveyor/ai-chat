import type {
	AppSettings,
	VoiceNavigationCommand,
	ThemeMode,
	FontFamily,
	FontSize,
	LayoutMode,
} from '../types';

// Default Voice Navigation Commands
export const defaultVoiceCommands: VoiceNavigationCommand[] =
	[
		{
			id: 'new-chat',
			phrase: 'new chat',
			action: 'CREATE_CHAT',
			description: 'Create a new chat conversation',
			enabled: true,
		},
		{
			id: 'open-settings',
			phrase: 'open settings',
			action: 'OPEN_SETTINGS',
			description: 'Open the settings page',
			enabled: true,
		},
		{
			id: 'search-chats',
			phrase: 'search chats',
			action: 'OPEN_SEARCH',
			description: 'Open chat search',
			enabled: true,
		},
		{
			id: 'show-analytics',
			phrase: 'show analytics',
			action: 'OPEN_ANALYTICS',
			description: 'Open analytics dashboard',
			enabled: true,
		},
		{
			id: 'toggle-sidebar',
			phrase: 'toggle sidebar',
			action: 'TOGGLE_SIDEBAR',
			description: 'Show or hide the chat list',
			enabled: true,
		},
		{
			id: 'clear-chat',
			phrase: 'clear chat',
			action: 'CLEAR_CHAT',
			description: 'Clear current conversation',
			enabled: true,
		},
		{
			id: 'go-home',
			phrase: 'go home',
			action: 'GO_HOME',
			description: 'Navigate to home page',
			enabled: true,
		},
	];

// Default Settings
export const defaultSettings: AppSettings = {
	theme: {
		mode: 'dark' as ThemeMode, // Default to dark mode
		colorScheme: 'default-dark', // Keep for compatibility but not used
		customSchemes: [],
	},
	typography: {
		fontFamily: 'inter' as FontFamily,
		fontSize: 'md' as FontSize,
		lineHeight: 1.6,
	},
	layout: {
		mode: 'comfortable' as LayoutMode,
		sidebarWidth: 320,
		messageSpacing: 16,
		borderRadius: 12,
	},
	accessibility: {
		highContrast: false,
		reducedMotion: false,
		screenReaderSupport: false,
		keyboardNavigation: true,
		focusIndicators: true,
		largeClickTargets: false,
	},
	voiceNavigation: {
		enabled: false,
		language: 'en-US',
		sensitivity: 0.7,
		commands: defaultVoiceCommands,
		wakeWord: 'hey assistant',
		confirmActions: true,
	},
	voiceSynthesis: {
		rate: 1,
		pitch: 1,
		volume: 0.8,
		language: 'en-US',
		autoPlay: false,
		noiseSuppressionEnabled: true,
	},
	animations: {
		enabled: true,
		duration: 300,
		easing: 'ease-in-out',
	},
	privacy: {
		analytics: true,
		crashReporting: true,
		dataCollection: false,
	},
	autoSuggestions: true, // Enable auto-suggestions by default
};

// Settings Storage Key
const SETTINGS_STORAGE_KEY = 'ai-chatbot-settings';

// Settings Manager Class
export class SettingsManager {
	private static instance: SettingsManager;
	private settings: AppSettings;
	private listeners: ((settings: AppSettings) => void)[] =
		[];

	private constructor() {
		this.settings = this.loadSettings();
		this.applySettings();
	}

	static getInstance(): SettingsManager {
		if (!SettingsManager.instance) {
			SettingsManager.instance =
				new SettingsManager();
		}
		return SettingsManager.instance;
	}

	// Load settings from localStorage
	private loadSettings(): AppSettings {
		try {
			const stored = localStorage.getItem(
				SETTINGS_STORAGE_KEY
			);
			if (!stored) {
				return defaultSettings;
			}

			const parsed = JSON.parse(
				stored
			) as Partial<AppSettings>;
			return { ...defaultSettings, ...parsed };
		} catch {
			// Failed to load settings, use defaults
			return defaultSettings;
		}
	}

	// Save settings to localStorage
	private saveSettings(): void {
		try {
			localStorage.setItem(
				SETTINGS_STORAGE_KEY,
				JSON.stringify(this.settings)
			);
		} catch {
			// Failed to save settings
		}
	}

	// Apply all settings to the DOM
	private applySettings(): void {
		const root = document.documentElement;
		const body = document.body;

		// Add settings-applied class to enable CSS variable overrides
		body.classList.add('settings-applied');

		// Apply theme mode (light/dark)
		this.applyTheme();

		// Load and apply typography
		this.loadGoogleFont(
			this.settings.typography.fontFamily
		);
		root.style.setProperty(
			'--font-size-base',
			this.getFontSize()
		);
		root.style.setProperty(
			'--line-height',
			this.settings.typography.lineHeight.toString()
		);

		// Apply layout
		root.style.setProperty(
			'--sidebar-width',
			`${this.settings.layout.sidebarWidth}px`
		);
		root.style.setProperty(
			'--message-spacing',
			`${this.settings.layout.messageSpacing}px`
		);
		root.style.setProperty(
			'--border-radius',
			`${this.settings.layout.borderRadius}px`
		);

		// Apply accessibility
		if (this.settings.accessibility.reducedMotion) {
			root.style.setProperty(
				'--animation-duration',
				'0ms'
			);
			body.classList.add('reduced-motion');
		} else {
			root.style.setProperty(
				'--animation-duration',
				`${this.settings.animations.duration}ms`
			);
			body.classList.remove('reduced-motion');
		}

		// Apply layout mode classes
		document.body.className = document.body.className
			.replace(
				/layout-(compact|comfortable|spacious)/g,
				''
			)
			.trim();
		document.body.classList.add(
			`layout-${this.settings.layout.mode}`
		);

		// Re-add settings-applied class in case it was removed
		body.classList.add('settings-applied');

		// Apply accessibility classes
		if (this.settings.accessibility.highContrast) {
			document.body.classList.add('high-contrast');
		} else {
			document.body.classList.remove('high-contrast');
		}

		if (this.settings.accessibility.largeClickTargets) {
			document.body.classList.add(
				'large-click-targets'
			);
		} else {
			document.body.classList.remove(
				'large-click-targets'
			);
		}

		// Apply focus indicators if enabled
		if (this.settings.accessibility.focusIndicators) {
			document.body.classList.add('focus-indicators');
		} else {
			document.body.classList.remove(
				'focus-indicators'
			);
		}

		console.log('Settings applied:', {
			theme: this.settings.theme,
			typography: this.settings.typography,
			layout: this.settings.layout,
			accessibility: this.settings.accessibility,
			bodyClasses: body.className,
		});
	}

	// Apply theme (light/dark mode only)
	private applyTheme(): void {
		// Don't apply theme here - let ThemeContext handle it
		// Just store the preference for settings UI
		console.log(
			'Theme preference saved:',
			this.settings.theme.mode
		);

		// Dispatch a custom event to notify ThemeContext of the change
		if (this.settings.theme.mode !== 'auto') {
			const event = new CustomEvent('themeChange', {
				detail: { theme: this.settings.theme.mode },
			});
			document.dispatchEvent(event);
		}
	}

	// Get font family CSS value
	private getFontFamily(): string {
		const fontMap: Record<FontFamily, string> = {
			inter: '"Inter", sans-serif',
			roboto: '"Roboto", sans-serif',
			poppins: '"Poppins", sans-serif',
			opensans: '"Open Sans", sans-serif',
			system: 'system-ui, -apple-system, sans-serif',
		};
		return fontMap[this.settings.typography.fontFamily];
	}

	// Get font size CSS value
	private getFontSize(): string {
		const sizeMap: Record<FontSize, string> = {
			xs: '0.75rem',
			sm: '0.875rem',
			md: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
		};
		return sizeMap[this.settings.typography.fontSize];
	}

	// Load Google Font dynamically
	private loadGoogleFont(fontFamily: FontFamily): void {
		if (fontFamily === 'system') return;

		const fontMap: Record<FontFamily, string> = {
			inter: 'Inter:wght@300;400;500;600;700',
			roboto: 'Roboto:wght@300;400;500;700',
			poppins: 'Poppins:wght@300;400;500;600;700',
			opensans: 'Open+Sans:wght@300;400;500;600;700',
			system: '',
		};

		const fontQuery = fontMap[fontFamily];
		if (!fontQuery) return;

		// Check if font is already loaded
		const existingLink = document.querySelector(
			`link[href*="${fontQuery}"]`
		);
		if (existingLink) return;

		// Create and append Google Fonts link
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
		document.head.appendChild(link);

		// Wait for font to load before applying
		link.onload = () => {
			this.applyFontFamily();
		};
	}

	// Apply font family after loading
	private applyFontFamily(): void {
		const root = document.documentElement;
		root.style.setProperty(
			'--font-family',
			this.getFontFamily()
		);

		// Force re-render by toggling a class
		document.body.classList.remove('font-loading');
		document.body.classList.add('font-loaded');
	}

	// Public API
	getSettings(): AppSettings {
		return { ...this.settings };
	}

	updateSettings(updates: Partial<AppSettings>): void {
		this.settings = { ...this.settings, ...updates };
		this.saveSettings();
		this.applySettings();
		this.notifyListeners();
	}

	resetSettings(): void {
		this.settings = { ...defaultSettings };
		this.saveSettings();
		this.applySettings();
		this.notifyListeners();
	}

	// Subscribe to settings changes
	subscribe(
		listener: (settings: AppSettings) => void
	): () => void {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter(
				(l) => l !== listener
			);
		};
	}

	private notifyListeners(): void {
		this.listeners.forEach((listener) =>
			listener(this.settings)
		);
	}

	// Utility methods
	isLightMode(): boolean {
		if (this.settings.theme.mode === 'auto') {
			return !window.matchMedia(
				'(prefers-color-scheme: dark)'
			).matches;
		}
		return this.settings.theme.mode === 'light';
	}

	isDarkMode(): boolean {
		return this.settings.theme.mode === 'dark';
	}
}

// Export singleton instance
export const settingsManager =
	SettingsManager.getInstance();
