// PWA Offline Data Manager
// Handles IndexedDB for offline storage and syncs with database when online

import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface TitleConfig {
	base: string;
	separator: string;
	suffix: string;
	dynamic: boolean;
}

const defaultConfig: TitleConfig = {
	base: 'AI Chat',
	separator: ' | ',
	suffix: 'Intelligent Conversations Redefined',
	dynamic: false, // Disabled dynamic features for simple titles
};

// Simple title mappings for different pages
const pageTitles: Record<string, string> = {
	'/': 'Home',
	'/ai-chat': 'Chat',
	'/auth': 'Login | Signup',
	'/login': 'Login',
	'/signup': 'Signup',
	'/about': 'About',
	'/contact': 'Contact',
	'/terms': 'Terms of Service',
	'/privacy': 'Privacy Policy',
	'/cookies': 'Cookie Policy',
	'/gdpr': 'GDPR Compliance',
	'/pricing': 'Pricing',
	'/api': 'API Documentation',
	'/documentation': 'Documentation',
	'/docs': 'Documentation',
	'/blog': 'Blog',
	'/careers': 'Careers',
	'/press': 'Press & Media',
	'/help': 'Help Center',
	'/support': 'Support',
	'/status': 'System Status',
	'/community': 'Community',
	'/analytics': 'Analytics',
	'/dashboard': 'Dashboard',
	'/profile': 'Profile',
	'/settings': 'Settings',
	'/features': 'Features',
	'/forgot-password': 'Reset Password',
	'/reset-password': 'Reset Password',
	'/verify-email': 'Verify Email',
	'/change-password': 'Change Password',
	'/deactivate-account': 'Deactivate Account',
};

// Get simple title based on pathname
const getSimpleTitle = (pathname: string): string => {
	// Check exact match first
	if (pageTitles[pathname]) {
		return pageTitles[pathname];
	}

	// Check for dynamic routes
	if (pathname.startsWith('/ai-chat')) {
		return 'Chat';
	}

	if (pathname.startsWith('/settings')) {
		return 'Settings';
	}

	if (pathname.startsWith('/profile')) {
		return 'Profile';
	}

	if (pathname.startsWith('/analytics')) {
		return 'Analytics';
	}

	if (pathname.startsWith('/conversation/')) {
		return 'Conversation';
	}

	// Default fallback
	return 'AI Chat';
};

export const usePageTitle = (
	customTitle?: string,
	config: Partial<TitleConfig> = {}
) => {
	const location = useLocation();
	const finalConfig = useMemo(
		() => ({ ...defaultConfig, ...config }),
		[config]
	);

	useEffect(() => {
		let title: string;

		if (customTitle) {
			title = customTitle;
		} else {
			title = getSimpleTitle(location.pathname);
		}

		// Construct final title
		const finalTitle = `${title}${finalConfig.separator}${finalConfig.base}`;

		// Set the document title
		document.title = finalTitle;

		// Update meta description dynamically
		const metaDescription = document.querySelector(
			'meta[name="description"]'
		);
		if (metaDescription) {
			const descriptions: Record<string, string> = {
				'/': 'Experience the future of AI conversations with intelligent responses, smart memory, and personalized interactions.',
				'/ai-chat':
					'Engage in intelligent conversations with our advanced AI assistant. Get help, answers, and creative solutions.',
				'/auth':
					'Login to your account or create a new one to start using AI Chat.',
				'/login': 'Login to your AI Chat account.',
				'/signup': 'Create a new AI Chat account.',
				'/about':
					'Learn about our mission to revolutionize AI conversations and make intelligent interactions accessible to everyone.',
				'/contact':
					'Get in touch with our team for support or inquiries.',
				'/pricing':
					'Choose the perfect plan for your AI conversation needs. From free to enterprise solutions.',
				'/api': 'Integrate powerful AI conversations into your applications with our robust, developer-friendly API.',
				'/documentation':
					'Complete guides, tutorials, and API references to help you master our AI chat platform.',
				'/blog':
					'Stay updated with the latest AI insights, tutorials, and platform updates from our expert team.',
				'/careers':
					'Join our mission to build the future of AI conversations. Explore exciting career opportunities.',
				'/analytics':
					'Gain insights into your AI conversations with detailed analytics and performance metrics.',
				'/settings':
					'Manage your account settings and preferences.',
				'/profile':
					'View and edit your profile information.',
				'/features':
					'Explore all the powerful features available in AI Chat.',
				'/help':
					'Find answers to common questions and get help with AI Chat.',
				'/privacy':
					'Read our privacy policy to understand how we protect your data.',
				'/terms':
					'Review our terms of service and usage policies.',
			};

			const description =
				descriptions[location.pathname] ||
				'AI Chat - Intelligent conversations redefined with advanced AI technology and personalized experiences.';

			metaDescription.setAttribute(
				'content',
				description
			);
		}

		// Add structured data for better SEO
		const structuredData = {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: title,
			description: document
				.querySelector('meta[name="description"]')
				?.getAttribute('content'),
			url: window.location.href,
			isPartOf: {
				'@type': 'WebSite',
				name: finalConfig.base,
				url: window.location.origin,
			},
		};

		// Update or create structured data script
		let structuredDataScript = document.querySelector(
			'#structured-data'
		) as HTMLScriptElement;
		if (!structuredDataScript) {
			structuredDataScript =
				document.createElement('script');
			structuredDataScript.id = 'structured-data';
			structuredDataScript.type =
				'application/ld+json';
			document.head.appendChild(structuredDataScript);
		}
		structuredDataScript.textContent =
			JSON.stringify(structuredData);
	}, [location.pathname, customTitle, finalConfig]);

	// Return current title for components that might need it
	return document.title;
};

// Utility function for getting current simple title (removed complex functions)
export const getCurrentPageTitle = (): string => {
	return getSimpleTitle(window.location.pathname);
};

// Export for use in components
export default usePageTitle;
