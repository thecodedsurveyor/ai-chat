import { useState } from 'react';
import {
	Bot,
	Zap,
	Shield,
	Palette,
	Mic,
	BarChart3,
	Search,
	Star,
	Bookmark,
	Settings,
	Smartphone,
	Globe,
	Brain,
	Users,
	Download,
	Share2,
	Eye,
	Keyboard,
	Volume2,
	Clock,
	Filter,
	Tag,
	Check,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import {
	TbMessageCircle,
	TbMessageCircleCheck,
} from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const Features = () => {
	const { isDark } = useTheme();
	const navigate = useNavigate();
	const [activeCategory, setActiveCategory] =
		useState('core');

	const featureCategories = [
		{
			id: 'core',
			name: 'Core Chat Features',
			icon: <TbMessageCircle className='w-5 h-5' />,
			color: 'from-blue-500 to-cyan-500',
		},
		{
			id: 'ai',
			name: 'AI Intelligence',
			icon: <Brain className='w-5 h-5' />,
			color: 'from-purple-500 to-pink-500',
		},
		{
			id: 'interface',
			name: 'User Interface',
			icon: <Palette className='w-5 h-5' />,
			color: 'from-green-500 to-emerald-500',
		},
		{
			id: 'productivity',
			name: 'Productivity',
			icon: <Zap className='w-5 h-5' />,
			color: 'from-orange-500 to-red-500',
		},
		{
			id: 'accessibility',
			name: 'Accessibility',
			icon: <Eye className='w-5 h-5' />,
			color: 'from-indigo-500 to-purple-500',
		},
		{
			id: 'advanced',
			name: 'Advanced Features',
			icon: <Settings className='w-5 h-5' />,
			color: 'from-gray-500 to-slate-600',
		},
	];

	const features = {
		core: [
			{
				icon: (
					<TbMessageCircleCheck className='w-6 h-6' />
				),
				title: 'Real-time AI Conversations',
				description:
					'Engage in natural conversations with advanced AI models including GPT-4, Claude, Gemini, and more.',
				highlights: [
					'Multiple AI models',
					'Real-time responses',
					'Context awareness',
				],
			},
			{
				icon: <Bot className='w-6 h-6' />,
				title: 'Multiple AI Models',
				description:
					'Choose from 5 powerful AI models with different capabilities and specializations.',
				highlights: [
					'OpenAI GPT models',
					'Google Gemini',
					'Claude models',
					'Model switching',
				],
			},
			{
				icon: <Users className='w-6 h-6' />,
				title: 'AI Personas',
				description:
					'Switch between different AI personalities for specialized assistance.',
				highlights: [
					'Creative assistant',
					'Technical expert',
					'Educational tutor',
					'Professional advisor',
				],
			},
			{
				icon: <Clock className='w-6 h-6' />,
				title: 'Message Status Tracking',
				description:
					'Real-time message delivery status with typing indicators.',
				highlights: [
					'Sending status',
					'Delivered confirmation',
					'Error handling',
					'Typing indicators',
				],
			},
		],
		ai: [
			{
				icon: <Brain className='w-6 h-6' />,
				title: 'Context-Aware Conversations',
				description:
					'AI remembers conversation history and maintains context across messages.',
				highlights: [
					'Conversation memory',
					'Token management',
					'Smart truncation',
					'Context relevance',
				],
			},
			{
				icon: <Bookmark className='w-6 h-6' />,
				title: 'Smart Bookmarks',
				description:
					'AI automatically suggests important messages to bookmark with intelligent analysis.',
				highlights: [
					'Auto-detection',
					'Importance scoring',
					'Smart tagging',
					'Content analysis',
				],
			},
			{
				icon: <Star className='w-6 h-6' />,
				title: 'Smart Memory System',
				description:
					'AI learns your preferences and maintains context across sessions.',
				highlights: [
					'User preferences',
					'Fact recording',
					'Context matching',
					'Profile building',
				],
			},
			{
				icon: <Filter className='w-6 h-6' />,
				title: 'Conversation Templates',
				description:
					'Pre-built conversation starters for common use cases.',
				highlights: [
					'Business templates',
					'Creative prompts',
					'Educational guides',
					'Personal assistance',
				],
			},
		],
		interface: [
			{
				icon: <Palette className='w-6 h-6' />,
				title: 'Advanced Theming',
				description:
					'Comprehensive theme customization with 6 color schemes and multiple modes.',
				highlights: [
					'Light/Dark/Auto modes',
					'6 color schemes',
					'Custom typography',
					'Layout options',
				],
			},
			{
				icon: <Smartphone className='w-6 h-6' />,
				title: 'Responsive Design',
				description:
					'Optimized experience across all devices with adaptive layouts.',
				highlights: [
					'Mobile-first design',
					'Tablet optimization',
					'Desktop features',
					'Touch-friendly',
				],
			},
			{
				icon: <Settings className='w-6 h-6' />,
				title: 'Layout Customization',
				description:
					'Choose between compact, comfortable, and spacious layout modes.',
				highlights: [
					'Compact mode',
					'Comfortable spacing',
					'Spacious layout',
					'Custom density',
				],
			},
			{
				icon: <Globe className='w-6 h-6' />,
				title: 'Progressive Web App',
				description:
					'Install as a native app with offline capabilities and automatic updates.',
				highlights: [
					'App installation',
					'Offline reading',
					'Background sync',
					'Auto updates',
				],
			},
		],
		productivity: [
			{
				icon: <Search className='w-6 h-6' />,
				title: 'Advanced Search',
				description:
					'Powerful search across all conversations with filters and smart matching.',
				highlights: [
					'Full-text search',
					'Date filtering',
					'Category filters',
					'Message type filters',
				],
			},
			{
				icon: <BarChart3 className='w-6 h-6' />,
				title: 'Analytics Dashboard',
				description:
					'Comprehensive analytics with usage statistics, trends, and insights.',
				highlights: [
					'Usage statistics',
					'Response time metrics',
					'Topic analysis',
					'Conversation trends',
				],
			},
			{
				icon: <Share2 className='w-6 h-6' />,
				title: 'Chat Sharing & Export',
				description:
					'Share conversations and export chat history in multiple formats.',
				highlights: [
					'Share links',
					'Export to text',
					'Download conversations',
					'Privacy controls',
				],
			},
			{
				icon: <Tag className='w-6 h-6' />,
				title: 'Chat Organization',
				description:
					'Organize conversations with categories, tags, and pinning.',
				highlights: [
					'Category system',
					'Custom tags',
					'Pin important chats',
					'Smart sorting',
				],
			},
		],
		accessibility: [
			{
				icon: <Eye className='w-6 h-6' />,
				title: 'Visual Accessibility',
				description:
					'High contrast modes and visual enhancements for better readability.',
				highlights: [
					'High contrast',
					'Large text options',
					'Focus indicators',
					'Color alternatives',
				],
			},
			{
				icon: <Keyboard className='w-6 h-6' />,
				title: 'Keyboard Navigation',
				description:
					'Full keyboard navigation support with logical tab order.',
				highlights: [
					'Tab navigation',
					'Keyboard shortcuts',
					'Focus management',
					'Screen reader support',
				],
			},
			{
				icon: <Mic className='w-6 h-6' />,
				title: 'Voice Navigation',
				description:
					'Control the app using voice commands with customizable wake words.',
				highlights: [
					'8 voice commands',
					'Custom wake word',
					'Multi-language',
					'Action confirmation',
				],
			},
			{
				icon: <Volume2 className='w-6 h-6' />,
				title: 'Voice Input & Output',
				description:
					'Speak your messages and hear AI responses with text-to-speech.',
				highlights: [
					'Voice input',
					'Text-to-speech',
					'Multiple languages',
					'Voice controls',
				],
			},
		],
		advanced: [
			{
				icon: <Shield className='w-6 h-6' />,
				title: 'Data Privacy & Security',
				description:
					'Local storage with encryption and privacy-first design.',
				highlights: [
					'Local storage',
					'No data tracking',
					'Secure API calls',
					'Privacy controls',
				],
			},
			{
				icon: <Download className='w-6 h-6' />,
				title: 'Offline Capabilities',
				description:
					'Read conversations offline with automatic sync when online.',
				highlights: [
					'Offline reading',
					'Background sync',
					'Local caching',
					'Network detection',
				],
			},
			{
				icon: <Zap className='w-6 h-6' />,
				title: 'Performance Optimization',
				description:
					'Fast loading with efficient state management and lazy loading.',
				highlights: [
					'Zustand state',
					'Lazy loading',
					'Efficient rendering',
					'Memory optimization',
				],
			},
			{
				icon: <Settings className='w-6 h-6' />,
				title: 'Advanced Settings',
				description:
					'Comprehensive settings system with real-time application.',
				highlights: [
					'Instant updates',
					'Setting categories',
					'Import/Export',
					'Reset options',
				],
			},
		],
	};

	const FeatureCard = ({
		feature,
	}: {
		feature: {
			icon: React.ReactNode;
			title: string;
			description: string;
			highlights: string[];
		};
	}) => (
		<div
			className={`p-6 rounded-xl border-2 ${
				isDark
					? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-pink/50'
					: 'bg-white border-gray-200 shadow-lg hover:shadow-xl hover:border-chat-pink/50'
			}`}
		>
			<div className='flex items-start gap-4'>
				<div className='p-3 rounded-lg bg-gradient-to-r from-chat-pink to-chat-purple text-white flex-shrink-0 flex items-center justify-center min-w-[48px] min-h-[48px]'>
					{feature.icon}
				</div>
				<div className='flex-1'>
					<h3
						className={`text-lg font-semibold mb-2 ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
					>
						{feature.title}
					</h3>
					<p
						className={`text-sm mb-4 ${
							isDark
								? 'text-chat-accent'
								: 'text-gray-600'
						}`}
					>
						{feature.description}
					</p>
					<div className='space-y-2'>
						{feature.highlights.map(
							(
								highlight: string,
								idx: number
							) => (
								<div
									key={idx}
									className='flex items-center gap-2'
								>
									<Check className='w-4 h-4 text-green-500 flex-shrink-0' />
									<span
										className={`text-xs ${
											isDark
												? 'text-chat-accent'
												: 'text-gray-600'
										}`}
									>
										{highlight}
									</span>
								</div>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div
			className={`min-h-screen ${
				isDark
					? 'bg-chat-primary'
					: 'bg-chat-light-primary'
			}`}
		>
			{/* Header */}
			<section
				className={`py-20 ${
					isDark
						? 'bg-chat-secondary/30'
						: 'bg-white'
				}`}
			>
				<div className='max-w-7xl mx-auto px-6'>
					<div className='text-center'>
						<div className='flex items-center justify-center gap-3 mb-6'>
							<div className='p-3 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple'>
								<Zap className='w-8 h-8 text-white' />
							</div>
							<h1
								className={`text-4xl md:text-5xl font-exo font-bold ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								Features
							</h1>
						</div>
						<p
							className={`text-xl max-w-3xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Discover the powerful features
							that make our NeuronFlow
							platform the most advanced and
							user-friendly conversational AI
							platform.
						</p>
					</div>
				</div>
			</section>

			{/* Feature Categories */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-6'>
					{/* Category Navigation */}
					<div className='flex flex-wrap justify-center gap-4 mb-12'>
						{featureCategories.map(
							(category) => (
								<button
									key={category.id}
									onClick={() =>
										setActiveCategory(
											category.id
										)
									}
									className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
										activeCategory ===
										category.id
											? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white shadow-lg'
											: isDark
											? 'bg-chat-secondary/30 text-chat-accent hover:bg-chat-secondary/50'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									{category.icon}
									<span>
										{category.name}
									</span>
								</button>
							)
						)}
					</div>

					{/* Features Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{features[
							activeCategory as keyof typeof features
						].map((feature, index) => (
							<FeatureCard
								key={`${activeCategory}-${index}`}
								feature={feature}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section
				className={`py-16 ${
					isDark
						? 'bg-chat-secondary/30'
						: 'bg-gray-50'
				}`}
			>
				<div className='max-w-4xl mx-auto px-6 text-center'>
					<div>
						<h2
							className={`text-3xl font-exo font-bold mb-4 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Powerful AI at Your Fingertips
						</h2>
						<p
							className={`text-lg mb-12 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Experience the next generation
							of AI conversation with features
							designed for productivity,
							accessibility, and intelligence.
						</p>

						<div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
							{[
								{
									number: '5',
									label: 'AI Models',
								},
								{
									number: '8',
									label: 'Voice Commands',
								},
								{
									number: '6',
									label: 'Theme Options',
								},
								{
									number: '100%',
									label: 'Offline Reading',
								},
							].map((stat, index) => (
								<div
									key={index}
									className='text-center'
								>
									<div
										className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent`}
									>
										{stat.number}
									</div>
									<div
										className={`text-sm ${
											isDark
												? 'text-chat-accent'
												: 'text-gray-600'
										}`}
									>
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-16'>
				<div className='max-w-4xl mx-auto px-6 text-center'>
					<div>
						<h2
							className={`text-3xl font-exo font-bold mb-4 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Ready to Experience Advanced AI?
						</h2>
						<p
							className={`text-lg mb-8 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Start your intelligent
							conversation journey today with
							our feature-rich NeuronFlow
							platform.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<button
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-3 rounded-xl font-exo font-semibold text-white shadow-lg'
								onClick={() =>
									navigate('/chat')
								}
							>
								Start Chatting Now
							</button>
							<button
								className={`px-8 py-3 rounded-xl font-exo font-semibold border-2 ${
									isDark
										? 'text-chat-accent border-chat-accent hover:bg-chat-accent hover:text-chat-primary'
										: 'text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
								}`}
								onClick={() =>
									navigate('/about')
								}
							>
								Learn More
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Features;
