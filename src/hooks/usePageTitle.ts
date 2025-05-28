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
	dynamic: true,
};

// Creative title mappings for different pages
const pageTitles: Record<string, string | (() => string)> =
	{
		'/': () => {
			const greetings = [
				'Welcome to the Future',
				'Your AI Companion Awaits',
				'Intelligence Meets Conversation',
				'Where Ideas Come to Life',
				'The Next Generation of Chat',
			];
			const time = new Date().getHours();
			if (time < 12)
				return `Good Morning! ${
					greetings[
						Math.floor(
							Math.random() * greetings.length
						)
					]
				}`;
			if (time < 17)
				return `Good Afternoon! ${
					greetings[
						Math.floor(
							Math.random() * greetings.length
						)
					]
				}`;
			return `Good Evening! ${
				greetings[
					Math.floor(
						Math.random() * greetings.length
					)
				]
			}`;
		},
		'/ai-chat': () => {
			const chatTitles = [
				'Active Conversation',
				'AI Assistant Ready',
				'Thinking Together',
				'Your Digital Companion',
				'Intelligent Dialogue',
			];
			return chatTitles[
				Math.floor(
					Math.random() * chatTitles.length
				)
			];
		},
		'/about': 'Our Story & Mission',
		'/contact': 'Get in Touch',
		'/terms': 'Terms of Service',
		'/privacy': 'Privacy Policy',
		'/pricing': () => {
			const pricingTitles = [
				'Choose Your Plan',
				'Unlock Your Potential',
				'Find Your Perfect Fit',
				'Pricing That Works',
				'Start Your Journey',
			];
			return pricingTitles[
				Math.floor(
					Math.random() * pricingTitles.length
				)
			];
		},
		'/api': () => {
			const apiTitles = [
				'Developer API Hub',
				'Build with AI Power',
				'Integration Made Simple',
				'Code Your Dreams',
				'API Documentation',
			];
			return apiTitles[
				Math.floor(Math.random() * apiTitles.length)
			];
		},
		'/documentation': () => {
			const docTitles = [
				'Knowledge Base',
				'Learn & Explore',
				'Complete Guide',
				'Documentation Hub',
				'Master the Platform',
			];
			return docTitles[
				Math.floor(Math.random() * docTitles.length)
			];
		},
		'/blog': () => {
			const blogTitles = [
				'Latest Insights',
				'AI News & Updates',
				'Thought Leadership',
				'Innovation Stories',
				'Tech Blog',
			];
			return blogTitles[
				Math.floor(
					Math.random() * blogTitles.length
				)
			];
		},
		'/careers': () => {
			const careerTitles = [
				'Join Our Team',
				'Build the Future',
				'Career Opportunities',
				'Work with Us',
				'Shape Tomorrow',
			];
			return careerTitles[
				Math.floor(
					Math.random() * careerTitles.length
				)
			];
		},
		'/press': 'Press & Media',
		'/cookies': 'Cookie Policy',
		'/gdpr': 'GDPR Compliance',
		'/help': () => {
			const helpTitles = [
				'Help Center',
				'Support Hub',
				'Get Assistance',
				'Find Answers',
				"We're Here to Help",
			];
			return helpTitles[
				Math.floor(
					Math.random() * helpTitles.length
				)
			];
		},
		'/status': () => {
			const statusTitles = [
				'System Status',
				'Service Health',
				'Platform Status',
				'Uptime Monitor',
				'System Dashboard',
			];
			return statusTitles[
				Math.floor(
					Math.random() * statusTitles.length
				)
			];
		},
		'/community': () => {
			const communityTitles = [
				'Community Hub',
				'Connect & Share',
				'Join the Discussion',
				'Community Forum',
				'Together We Build',
			];
			return communityTitles[
				Math.floor(
					Math.random() * communityTitles.length
				)
			];
		},
		'/analytics': () => {
			const analyticsTitles = [
				'Analytics Dashboard',
				'Insights & Metrics',
				'Data Overview',
				'Performance Analytics',
				'Your Statistics',
			];
			return analyticsTitles[
				Math.floor(
					Math.random() * analyticsTitles.length
				)
			];
		},
	};

// Special dynamic titles based on context
const getContextualTitle = (pathname: string): string => {
	// Chat-specific dynamic titles
	if (pathname.startsWith('/ai-chat')) {
		const chatStates = [
			'Ready to Chat',
			'AI Assistant Active',
			'Conversation in Progress',
			'Your AI Companion',
			'Intelligent Dialogue',
		];
		return chatStates[
			Math.floor(Math.random() * chatStates.length)
		];
	}

	// Analytics with time-based context
	if (pathname === '/analytics') {
		const hour = new Date().getHours();
		if (hour < 12) return 'Morning Analytics Review';
		if (hour < 17) return 'Afternoon Data Insights';
		return 'Evening Performance Report';
	}

	// Default fallback
	return 'AI Chat Platform';
};

// Generate creative title based on user activity
export const getActivityBasedTitle = (): string => {
	const activities = [
		'Exploring AI Possibilities',
		'Discovering New Features',
		'Enhancing Productivity',
		'Learning & Growing',
		'Creating Something Amazing',
	];
	return activities[
		Math.floor(Math.random() * activities.length)
	];
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
			const pageTitle = pageTitles[location.pathname];

			if (typeof pageTitle === 'function') {
				title = pageTitle();
			} else if (pageTitle) {
				title = pageTitle;
			} else {
				// Fallback for unknown routes
				title = getContextualTitle(
					location.pathname
				);
			}
		}

		// Add dynamic elements if enabled
		if (finalConfig.dynamic) {
			const isHomePage = location.pathname === '/';
			const isChatPage =
				location.pathname.startsWith('/ai-chat');

			// Add time-based context for certain pages
			if (isHomePage || isChatPage) {
				const hour = new Date().getHours();
				let timeContext = '';

				if (hour >= 5 && hour < 12)
					timeContext = '🌅 ';
				else if (hour >= 12 && hour < 17)
					timeContext = '☀️ ';
				else if (hour >= 17 && hour < 21)
					timeContext = '🌆 ';
				else timeContext = '🌙 ';

				title = timeContext + title;
			}
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
				'/about':
					'Learn about our mission to revolutionize AI conversations and make intelligent interactions accessible to everyone.',
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

// Utility function to get a random motivational title
export const getMotivationalTitle = (): string => {
	const motivational = [
		'Ready to Innovate?',
		"Let's Create Something Amazing",
		'Your Ideas, Amplified',
		'Unlock Your Potential',
		'Dream. Build. Achieve.',
		'The Future Starts Here',
		'Empowering Your Vision',
		'Where Innovation Meets Intelligence',
	];
	return motivational[
		Math.floor(Math.random() * motivational.length)
	];
};

// Utility function to get time-based greeting title
export const getGreetingTitle = (): string => {
	const hour = new Date().getHours();
	const day = new Date().getDay();
	const isWeekend = day === 0 || day === 6;

	if (hour < 6)
		return isWeekend
			? '🌙 Late Night Inspiration'
			: '🌙 Burning the Midnight Oil';
	if (hour < 12)
		return isWeekend
			? '🌅 Weekend Vibes'
			: '🌅 Fresh Start Today';
	if (hour < 17)
		return isWeekend
			? '☀️ Weekend Productivity'
			: '☀️ Afternoon Focus';
	if (hour < 21)
		return isWeekend
			? '🌆 Weekend Wind Down'
			: '🌆 Evening Innovation';
	return isWeekend
		? '🌙 Peaceful Weekend Night'
		: '🌙 Night Owl Mode';
};

// Export for use in components
export default usePageTitle;
