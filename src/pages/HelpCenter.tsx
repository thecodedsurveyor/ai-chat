import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
	Search,
	HelpCircle,
	MessageCircle,
	Book,
	Video,
	Mail,
	Phone,
	ChevronDown,
	ChevronRight,
	ExternalLink,
	Clock,
	CheckCircle,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const HelpCenter = () => {
	const { isDark } = useTheme();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] =
		useState('all');
	const [expandedFAQ, setExpandedFAQ] = useState<
		number | null
	>(null);

	const categories = [
		{ id: 'all', name: 'All Topics', count: 45 },
		{
			id: 'getting-started',
			name: 'Getting Started',
			count: 12,
		},
		{
			id: 'account',
			name: 'Account & Billing',
			count: 8,
		},
		{ id: 'features', name: 'Features', count: 15 },
		{
			id: 'troubleshooting',
			name: 'Troubleshooting',
			count: 7,
		},
		{ id: 'api', name: 'API & Integration', count: 3 },
	];

	const faqs = [
		{
			id: 1,
			category: 'getting-started',
			question:
				'How do I get started with NeuronFlow?',
			answer: 'Getting started is easy! Simply sign up for a free account, verify your email, and you can start chatting with AI immediately. No setup required.',
			tags: ['signup', 'account', 'beginner'],
		},
		{
			id: 2,
			category: 'features',
			question: 'What AI models are available?',
			answer: 'We offer access to multiple AI models including GPT-4, Claude, and other leading models. Pro and Enterprise users get access to all models.',
			tags: ['models', 'ai', 'features'],
		},
		{
			id: 3,
			category: 'account',
			question: 'How do I upgrade my plan?',
			answer: 'You can upgrade your plan anytime from your account settings. Go to Settings > Billing and select your desired plan. Changes take effect immediately.',
			tags: ['billing', 'upgrade', 'plans'],
		},
		{
			id: 4,
			category: 'features',
			question: 'Can I create custom AI personas?',
			answer: 'Yes! Pro and Enterprise users can create unlimited custom personas. Go to Settings > Personas to create and manage your AI personalities.',
			tags: ['personas', 'customization', 'pro'],
		},
		{
			id: 5,
			category: 'troubleshooting',
			question: 'Why are my messages not sending?',
			answer: "This could be due to network issues, rate limits, or account restrictions. Check your internet connection and ensure you haven't exceeded your plan limits.",
			tags: ['messages', 'sending', 'issues'],
		},
		{
			id: 6,
			category: 'api',
			question: 'How do I get an API key?',
			answer: 'API keys are available for Pro and Enterprise users. Go to Settings > API to generate your key. Keep it secure and never share it publicly.',
			tags: ['api', 'key', 'integration'],
		},
		{
			id: 7,
			category: 'account',
			question: 'How do I delete my account?',
			answer: 'To delete your account, go to Settings > Account > Delete Account. This action is permanent and cannot be undone.',
			tags: ['delete', 'account', 'permanent'],
		},
		{
			id: 8,
			category: 'features',
			question:
				'Can I export my conversation history?',
			answer: 'Yes, you can export your conversations in JSON or PDF format. Go to Settings > Data Export to download your chat history.',
			tags: ['export', 'conversations', 'data'],
		},
	];

	const quickLinks = [
		{
			icon: <Book className='w-6 h-6' />,
			title: 'Documentation',
			description:
				'Complete guides and API reference',
			link: '/documentation',
			color: 'from-blue-500 to-blue-600',
		},
		{
			icon: <Video className='w-6 h-6' />,
			title: 'Video Tutorials',
			description: 'Step-by-step video guides',
			link: '#',
			color: 'from-purple-500 to-purple-600',
		},
		{
			icon: <MessageCircle className='w-6 h-6' />,
			title: 'Community Forum',
			description: 'Connect with other users',
			link: '#',
			color: 'from-green-500 to-green-600',
		},
		{
			icon: <ExternalLink className='w-6 h-6' />,
			title: 'Status Page',
			description: 'Check service status',
			link: '/status',
			color: 'from-orange-500 to-orange-600',
		},
	];

	const supportOptions = [
		{
			icon: <MessageCircle className='w-8 h-8' />,
			title: 'Live Chat',
			description: 'Chat with our support team',
			availability: 'Available 24/7',
			action: 'Start Chat',
			primary: true,
		},
		{
			icon: <Mail className='w-8 h-8' />,
			title: 'Email Support',
			description: 'Send us a detailed message',
			availability: 'Response within 24 hours',
			action: 'Send Email',
			primary: false,
		},
		{
			icon: <Phone className='w-8 h-8' />,
			title: 'Phone Support',
			description: 'Speak with our team directly',
			availability: 'Enterprise customers only',
			action: 'Schedule Call',
			primary: false,
		},
	];

	const filteredFAQs = faqs.filter((faq) => {
		const matchesCategory =
			selectedCategory === 'all' ||
			faq.category === selectedCategory;
		const matchesSearch =
			faq.question
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			faq.answer
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			faq.tags.some((tag) =>
				tag
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			);
		return matchesCategory && matchesSearch;
	});

	const toggleFAQ = (id: number) => {
		setExpandedFAQ(expandedFAQ === id ? null : id);
	};

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
					<motion.div
						className='text-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className='flex items-center justify-center gap-3 mb-6'>
							<div className='p-3 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple'>
								<HelpCircle className='w-8 h-8 text-white' />
							</div>
							<h1
								className={`text-4xl md:text-5xl font-exo font-bold ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								Help Center
							</h1>
						</div>
						<p
							className={`text-xl max-w-3xl mx-auto mb-8 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Find answers to your questions
							and get the help you need.
						</p>

						{/* Search Bar */}
						<div className='max-w-2xl mx-auto'>
							<div className='relative'>
								<Search
									className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-400'
									}`}
								/>
								<input
									type='text'
									placeholder='Search for help...'
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(
											e.target.value
										)
									}
									className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 text-lg transition-all duration-300 focus:outline-none focus:border-chat-pink ${
										isDark
											? 'bg-chat-secondary border-chat-accent/30 text-white placeholder:text-chat-accent/60'
											: 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
									}`}
								/>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Quick Links */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.h2
						className={`text-3xl font-exo font-bold mb-8 text-center ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						Quick Links
					</motion.h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{quickLinks.map((link, index) => (
							<motion.a
								key={index}
								href={link.link}
								className={`block p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-pink/50'
										: 'bg-white border-gray-200 shadow-lg hover:shadow-xl hover:border-chat-pink/50'
								}`}
								initial={{
									opacity: 0,
									y: 20,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								transition={{
									duration: 0.6,
									delay: index * 0.1,
								}}
								whileHover={{ scale: 1.05 }}
							>
								<div
									className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${link.color} mb-4`}
								>
									{link.icon}
								</div>
								<h3
									className={`font-semibold mb-2 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									{link.title}
								</h3>
								<p
									className={`text-sm ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									{link.description}
								</p>
							</motion.a>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.h2
						className={`text-3xl font-exo font-bold mb-8 text-center ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						Frequently Asked Questions
					</motion.h2>

					{/* Category Filter */}
					<div className='flex flex-wrap gap-2 mb-8 justify-center'>
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() =>
									setSelectedCategory(
										category.id
									)
								}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
									selectedCategory ===
									category.id
										? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
										: isDark
										? 'bg-chat-secondary/50 text-chat-accent hover:bg-chat-secondary'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								{category.name} (
								{category.count})
							</button>
						))}
					</div>

					{/* FAQ List */}
					<div className='max-w-4xl mx-auto space-y-4'>
						{filteredFAQs.length > 0 ? (
							filteredFAQs.map(
								(faq, index) => (
									<motion.div
										key={faq.id}
										className={`border rounded-xl overflow-hidden ${
											isDark
												? 'bg-chat-secondary/30 border-chat-accent/20'
												: 'bg-white border-gray-200 shadow-lg'
										}`}
										initial={{
											opacity: 0,
											y: 20,
										}}
										animate={{
											opacity: 1,
											y: 0,
										}}
										transition={{
											duration: 0.6,
											delay:
												index *
												0.05,
										}}
									>
										<button
											onClick={() =>
												toggleFAQ(
													faq.id
												)
											}
											className={`w-full p-6 text-left flex items-center justify-between hover:bg-opacity-50 transition-all duration-300 ${
												isDark
													? 'hover:bg-chat-accent/10'
													: 'hover:bg-gray-50'
											}`}
										>
											<h3
												className={`font-semibold pr-4 ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{
													faq.question
												}
											</h3>
											{expandedFAQ ===
											faq.id ? (
												<ChevronDown className='w-5 h-5 text-chat-pink flex-shrink-0' />
											) : (
												<ChevronRight className='w-5 h-5 text-chat-pink flex-shrink-0' />
											)}
										</button>
										{expandedFAQ ===
											faq.id && (
											<motion.div
												className='px-6 pb-6'
												initial={{
													opacity: 0,
													height: 0,
												}}
												animate={{
													opacity: 1,
													height: 'auto',
												}}
												exit={{
													opacity: 0,
													height: 0,
												}}
												transition={{
													duration: 0.3,
												}}
											>
												<p
													className={`mb-4 ${
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}`}
												>
													{
														faq.answer
													}
												</p>
												<div className='flex flex-wrap gap-2'>
													{faq.tags.map(
														(
															tag,
															tagIndex
														) => (
															<span
																key={
																	tagIndex
																}
																className={`px-2 py-1 rounded text-xs ${
																	isDark
																		? 'bg-chat-accent/20 text-chat-accent'
																		: 'bg-gray-100 text-gray-600'
																}`}
															>
																{
																	tag
																}
															</span>
														)
													)}
												</div>
											</motion.div>
										)}
									</motion.div>
								)
							)
						) : (
							<motion.div
								className={`text-center py-16 ${
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							>
								<Search className='w-16 h-16 mx-auto mb-4 opacity-50' />
								<h3 className='text-xl font-semibold mb-2'>
									No results found
								</h3>
								<p>
									Try adjusting your
									search or browse
									different categories.
								</p>
							</motion.div>
						)}
					</div>
				</div>
			</section>

			{/* Contact Support */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.div
						className='text-center mb-12'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2
							className={`text-3xl font-exo font-bold mb-4 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Still Need Help?
						</h2>
						<p
							className={`text-lg ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Our support team is here to help
							you with any questions or
							issues.
						</p>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{supportOptions.map(
							(option, index) => (
								<motion.div
									key={index}
									className={`p-8 rounded-xl border text-center ${
										option.primary
											? 'border-chat-pink bg-gradient-to-br from-chat-pink/10 to-chat-purple/10'
											: isDark
											? 'bg-chat-secondary/30 border-chat-accent/20'
											: 'bg-white border-gray-200 shadow-lg'
									}`}
									initial={{
										opacity: 0,
										y: 20,
									}}
									animate={{
										opacity: 1,
										y: 0,
									}}
									transition={{
										duration: 0.6,
										delay: index * 0.1,
									}}
									whileHover={{
										scale: 1.02,
									}}
								>
									<div
										className={`inline-flex p-4 rounded-xl mb-4 ${
											option.primary
												? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white'
												: isDark
												? 'bg-chat-accent/20 text-chat-accent'
												: 'bg-gray-100 text-gray-600'
										}`}
									>
										{option.icon}
									</div>
									<h3
										className={`text-xl font-semibold mb-2 ${
											isDark
												? 'text-white'
												: 'text-gray-800'
										}`}
									>
										{option.title}
									</h3>
									<p
										className={`mb-4 ${
											isDark
												? 'text-chat-accent'
												: 'text-gray-600'
										}`}
									>
										{option.description}
									</p>
									<div
										className={`flex items-center justify-center gap-2 mb-6 text-sm ${
											isDark
												? 'text-chat-accent'
												: 'text-gray-500'
										}`}
									>
										<Clock className='w-4 h-4' />
										<span>
											{
												option.availability
											}
										</span>
									</div>
									<motion.button
										className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
											option.primary
												? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white shadow-lg hover:shadow-xl'
												: isDark
												? 'bg-chat-accent/20 text-chat-accent hover:bg-chat-accent hover:text-chat-primary border border-chat-accent/30'
												: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
										}`}
										whileHover={{
											scale: 1.05,
										}}
										whileTap={{
											scale: 0.95,
										}}
									>
										{option.action}
									</motion.button>
								</motion.div>
							)
						)}
					</div>
				</div>
			</section>

			{/* Popular Articles */}
			<section
				className={`py-16 ${
					isDark
						? 'bg-chat-secondary/30'
						: 'bg-gray-50'
				}`}
			>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.h2
						className={`text-3xl font-exo font-bold mb-8 text-center ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						Popular Articles
					</motion.h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[
							'How to create effective AI prompts',
							'Understanding AI model differences',
							'Setting up API integrations',
							'Managing your conversation history',
							'Customizing AI personas',
							'Troubleshooting common issues',
						].map((title, index) => (
							<motion.a
								key={index}
								href='#'
								className={`block p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
									isDark
										? 'bg-chat-primary border-chat-accent/20 hover:border-chat-pink/50'
										: 'bg-white border-gray-200 shadow-lg hover:shadow-xl hover:border-chat-pink/50'
								}`}
								initial={{
									opacity: 0,
									y: 20,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								transition={{
									duration: 0.6,
									delay: index * 0.1,
								}}
							>
								<div className='flex items-center gap-3 mb-3'>
									<CheckCircle className='w-5 h-5 text-green-500' />
									<span
										className={`text-sm ${
											isDark
												? 'text-chat-accent'
												: 'text-gray-500'
										}`}
									>
										Article
									</span>
								</div>
								<h3
									className={`font-semibold ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									{title}
								</h3>
							</motion.a>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default HelpCenter;
