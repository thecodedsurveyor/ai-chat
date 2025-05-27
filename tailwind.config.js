/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			screens: {
				xs: '475px',
			},
			colors: {
				chat: {
					// Dark mode (default)
					primary: '#0d111a',
					secondary: '#131927',
					accent: '#7b8ebc',
					purple: '#8e25bf',
					pink: '#f42f5f',
					orange: '#fe8d5c',
					text: '#ddc',
					// Light mode variants - IMPROVED CONTRAST & VISIBILITY
					'light-primary': '#ffffff',
					'light-secondary': '#f8fafc', // Slightly off-white
					'light-accent': '#1e293b', // Much darker for better contrast - was #334155
					'light-text': '#0f172a', // Very dark for body text
					'light-border': '#d1d5db', // More visible borders - was #e2e8f0
					'light-hover': '#f1f5f9', // Subtle hover state
					'light-muted': '#475569', // Better contrast for muted text - was #64748b
					'light-card': '#ffffff',
					'light-surface': '#f9fafb',
					// Enhanced light mode colors for better UX
					'light-button-primary': '#2563eb', // Stronger blue
					'light-button-secondary': '#4b5563', // Darker gray - was #6b7280
					'light-button-danger': '#dc2626', // Red for danger buttons
					'light-button-success': '#059669', // Green for success buttons
					'light-icon': '#1f2937', // Much darker icons - was #374151
					'light-icon-hover': '#111827', // Even darker on hover
					'light-close-button': '#4b5563', // Darker close buttons - was #6b7280
					'light-close-button-hover': '#1f2937', // Much darker on hover - was #374151
					// New light mode specific colors for better definition
					'light-input-bg': '#ffffff',
					'light-input-border': '#d1d5db',
					'light-input-focus': '#2563eb',
					'light-shadow': 'rgba(0, 0, 0, 0.1)',
					'light-shadow-lg':
						'rgba(0, 0, 0, 0.15)',
				},
			},
			fontFamily: {
				exo: ['Exo 2', 'sans-serif'],
			},
			gradients: {
				primary:
					'linear-gradient(135deg, #f42f5f, #8e25bf)',
				secondary:
					'linear-gradient(135deg, #fe8d5c, #f42f5f)',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
