import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTitle } from '../hooks/usePageTitle';
import {
	Calendar,
	Clock,
	User,
	ArrowRight,
	Search,
	TrendingUp,
	Brain,
	Shield,
	Globe,
	Code,
	Users,
} from 'lucide-react';

const Blog = () => {
	const { isDark } = useTheme();
	usePageTitle('Blog – NeuronFlow');
	const [selectedCategory, setSelectedCategory] =
		useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	const categories = [
		{ id: 'all', name: 'All Posts', count: 24 },
		{
			id: 'ai-insights',
			name: 'AI Insights',
			count: 8,
		},
		{ id: 'tutorials', name: 'Tutorials', count: 6 },
		{
			id: 'product-updates',
			name: 'Product Updates',
			count: 5,
		},
		{
			id: 'industry-news',
			name: 'Industry News',
			count: 3,
		},
		{
			id: 'case-studies',
			name: 'Case Studies',
			count: 2,
		},
	];

	const blogPosts = [
		{
			id: 1,
			title: 'The Future of AI Conversations: Trends to Watch in 2024',
			excerpt:
				"Explore the latest developments in conversational AI and how they're reshaping human-computer interactions across industries.",
			content:
				'As we advance into 2024, artificial intelligence continues to revolutionize how we communicate with technology...',
			author: 'Dr. Sarah Chen',
			authorRole: 'AI Research Lead',
			publishDate: '2024-01-15',
			readTime: '8 min read',
			category: 'ai-insights',
			tags: ['AI', 'Future Tech', 'Conversations'],
			image: '/api/placeholder/600/400',
			featured: true,
			icon: <Brain className='w-6 h-6' />,
		},
		{
			id: 2,
			title: 'Building Your First NeuronFlow App: A Complete Guide',
			excerpt:
				'Step-by-step tutorial on creating intelligent conversational AI using our platform. Perfect for developers getting started with AI.',
			content:
				"Creating an AI-powered conversation app has never been easier. In this comprehensive guide, we'll walk you through...",
			author: 'Mike Rodriguez',
			authorRole: 'Senior Developer',
			publishDate: '2024-01-12',
			readTime: '12 min read',
			category: 'tutorials',
			tags: ['Tutorial', 'API', 'Development'],
			image: '/api/placeholder/600/400',
			featured: false,
			icon: <Code className='w-6 h-6' />,
		},
		{
			id: 3,
			title: 'Introducing Advanced Persona Customization',
			excerpt:
				'Our latest update brings powerful new features for creating and managing AI personas tailored to your specific needs.',
			content:
				"We're excited to announce the release of our advanced persona customization features...",
			author: 'Emily Johnson',
			authorRole: 'Product Manager',
			publishDate: '2024-01-10',
			readTime: '5 min read',
			category: 'product-updates',
			tags: [
				'Product Update',
				'Personas',
				'Features',
			],
			image: '/api/placeholder/600/400',
			featured: false,
			icon: <Users className='w-6 h-6' />,
		},
		{
			id: 4,
			title: 'Enterprise Security: Protecting Your AI Conversations',
			excerpt:
				'Learn about our comprehensive security measures and best practices for keeping your AI interactions safe and compliant.',
			content:
				'Security is paramount when dealing with AI conversations, especially in enterprise environments...',
			author: 'David Kim',
			authorRole: 'Security Engineer',
			publishDate: '2024-01-08',
			readTime: '10 min read',
			category: 'ai-insights',
			tags: ['Security', 'Enterprise', 'Privacy'],
			image: '/api/placeholder/600/400',
			featured: false,
			icon: <Shield className='w-6 h-6' />,
		},
		{
			id: 5,
			title: 'Global AI Adoption: Market Trends and Insights',
			excerpt:
				'Analyzing the worldwide adoption of AI technologies and what it means for businesses and consumers.',
			content:
				'The global AI market continues to expand at an unprecedented rate...',
			author: 'Lisa Wang',
			authorRole: 'Market Analyst',
			publishDate: '2024-01-05',
			readTime: '7 min read',
			category: 'industry-news',
			tags: [
				'Market Analysis',
				'Global Trends',
				'AI Adoption',
			],
			image: '/api/placeholder/600/400',
			featured: false,
			icon: <Globe className='w-6 h-6' />,
		},
		{
			id: 6,
			title: 'Case Study: How TechCorp Increased Productivity by 40%',
			excerpt:
				'Discover how TechCorp leveraged our NeuronFlow platform to streamline operations and boost team productivity.',
			content:
				'TechCorp, a leading software development company, was facing challenges with internal communication...',
			author: 'Alex Thompson',
			authorRole: 'Customer Success',
			publishDate: '2024-01-03',
			readTime: '6 min read',
			category: 'case-studies',
			tags: [
				'Case Study',
				'Productivity',
				'Success Story',
			],
			image: '/api/placeholder/600/400',
			featured: false,
			icon: <TrendingUp className='w-6 h-6' />,
		},
	];

	const filteredPosts = blogPosts.filter((post) => {
		const matchesCategory =
			selectedCategory === 'all' ||
			post.category === selectedCategory;
		const matchesSearch =
			post.title
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			post.excerpt
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			post.tags.some((tag) =>
				tag
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			);
		return matchesCategory && matchesSearch;
	});

	const featuredPost = blogPosts.find(
		(post) => post.featured
	);
	const regularPosts = filteredPosts.filter(
		(post) => !post.featured
	);

	return (
		<div
			className={`min-h-screen ${
				isDark
					? 'bg-chat-primary'
					: 'bg-chat-light-primary'
			}`}
		>
			{/* Hero Section */}
			<section className='relative py-20 px-6'>
				<div className='max-w-7xl mx-auto text-center'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1
							className={`text-4xl md:text-6xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							NeuronFlow{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								Blog
							</span>
						</h1>
						<p
							className={`text-xl mb-8 max-w-3xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							Insights, tutorials, and updates
							from the world of AI
							conversations. Stay informed
							about the latest trends and best
							practices.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Search and Filter */}
			<section className='py-8 px-6'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex flex-col lg:flex-row gap-6 mb-8'>
						{/* Search */}
						<div className='flex-1'>
							<div className='relative'>
								<Search
									className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-400'
									}`}
								/>
								<input
									type='text'
									placeholder='Search articles...'
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(
											e.target.value
										)
									}
									className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-chat-pink ${
										isDark
											? 'bg-chat-secondary border-chat-accent/30 text-white placeholder:text-chat-accent/60'
											: 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
									}`}
								/>
							</div>
						</div>

						{/* Categories */}
						<div className='flex flex-wrap gap-2'>
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
					</div>
				</div>
			</section>

			{/* Featured Post */}
			{featuredPost &&
				selectedCategory === 'all' &&
				!searchTerm && (
					<section className='py-8 px-6'>
						<div className='max-w-7xl mx-auto'>
							<motion.div
								className={`relative overflow-hidden rounded-2xl ${
									isDark
										? 'bg-chat-secondary/30 border border-chat-accent/20'
										: 'bg-white border border-gray-200 shadow-xl'
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
								}}
							>
								<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
									<div className='space-y-6'>
										<div className='flex items-center gap-3'>
											<div className='p-2 rounded-lg bg-gradient-to-r from-chat-pink to-chat-purple'>
												{
													featuredPost.icon
												}
											</div>
											<span className='px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-chat-pink to-chat-purple text-white'>
												Featured
											</span>
										</div>
										<h2
											className={`text-3xl font-exo font-bold ${
												isDark
													? 'text-white'
													: 'text-gray-800'
											}`}
										>
											{
												featuredPost.title
											}
										</h2>
										<p
											className={`text-lg ${
												isDark
													? 'text-chat-accent'
													: 'text-gray-600'
											}`}
										>
											{
												featuredPost.excerpt
											}
										</p>
										<div className='flex items-center gap-6 text-sm'>
											<div className='flex items-center gap-2'>
												<User className='w-4 h-4' />
												<span
													className={
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}
												>
													{
														featuredPost.author
													}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												<Calendar className='w-4 h-4' />
												<span
													className={
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}
												>
													{new Date(
														featuredPost.publishDate
													).toLocaleDateString()}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												<Clock className='w-4 h-4' />
												<span
													className={
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}
												>
													{
														featuredPost.readTime
													}
												</span>
											</div>
										</div>
										<motion.button
											className='flex items-center gap-2 bg-gradient-to-r from-chat-pink to-chat-purple px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300'
											whileHover={{
												scale: 1.05,
											}}
											whileTap={{
												scale: 0.95,
											}}
										>
											Read Article
											<ArrowRight className='w-4 h-4' />
										</motion.button>
									</div>
									<div className='relative'>
										<div
											className={`w-full h-64 lg:h-full rounded-xl ${
												isDark
													? 'bg-chat-secondary/50'
													: 'bg-gray-200'
											} flex items-center justify-center`}
										>
											<span
												className={`text-lg font-medium ${
													isDark
														? 'text-chat-accent'
														: 'text-gray-500'
												}`}
											>
												Featured
												Image
											</span>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					</section>
				)}

			{/* Blog Posts Grid */}
			<section className='py-16 px-6'>
				<div className='max-w-7xl mx-auto'>
					{regularPosts.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
							{regularPosts.map(
								(post, index) => (
									<motion.article
										key={post.id}
										className={`group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
											isDark
												? 'bg-chat-secondary/30 border border-chat-accent/20 hover:border-chat-pink/50'
												: 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
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
												index * 0.1,
										}}
									>
										{/* Image Placeholder */}
										<div
											className={`w-full h-48 ${
												isDark
													? 'bg-chat-secondary/50'
													: 'bg-gray-200'
											} flex items-center justify-center relative overflow-hidden`}
										>
											<div className='absolute inset-0 bg-gradient-to-br from-chat-pink/20 to-chat-purple/20' />
											<div className='relative z-10 p-3 rounded-lg bg-gradient-to-r from-chat-pink to-chat-purple'>
												{post.icon}
											</div>
										</div>

										<div className='p-6 space-y-4'>
											{/* Category and Tags */}
											<div className='flex items-center gap-2 flex-wrap'>
												<span
													className={`px-2 py-1 rounded text-xs font-medium ${
														isDark
															? 'bg-chat-pink/20 text-chat-pink'
															: 'bg-purple-100 text-purple-700'
													}`}
												>
													{
														categories.find(
															(
																cat
															) =>
																cat.id ===
																post.category
														)
															?.name
													}
												</span>
												{post.tags
													.slice(
														0,
														2
													)
													.map(
														(
															tag
														) => (
															<span
																key={
																	tag
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

											{/* Title */}
											<h3
												className={`text-xl font-exo font-bold line-clamp-2 group-hover:text-chat-pink transition-colors ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{post.title}
											</h3>

											{/* Excerpt */}
											<p
												className={`text-sm line-clamp-3 ${
													isDark
														? 'text-chat-accent'
														: 'text-gray-600'
												}`}
											>
												{
													post.excerpt
												}
											</p>

											{/* Meta Info */}
											<div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-chat-accent/20'>
												<div className='flex items-center gap-2'>
													<div
														className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
															isDark
																? 'bg-chat-accent/20 text-chat-accent'
																: 'bg-gray-200 text-gray-700'
														}`}
													>
														{post.author
															.split(
																' '
															)
															.map(
																(
																	n
																) =>
																	n[0]
															)
															.join(
																''
															)}
													</div>
													<div>
														<p
															className={`text-sm font-medium ${
																isDark
																	? 'text-white'
																	: 'text-gray-800'
															}`}
														>
															{
																post.author
															}
														</p>
														<p
															className={`text-xs ${
																isDark
																	? 'text-chat-accent'
																	: 'text-gray-500'
															}`}
														>
															{
																post.authorRole
															}
														</p>
													</div>
												</div>
												<div className='text-right'>
													<p
														className={`text-xs ${
															isDark
																? 'text-chat-accent'
																: 'text-gray-500'
														}`}
													>
														{new Date(
															post.publishDate
														).toLocaleDateString()}
													</p>
													<p
														className={`text-xs ${
															isDark
																? 'text-chat-accent'
																: 'text-gray-500'
														}`}
													>
														{
															post.readTime
														}
													</p>
												</div>
											</div>
										</div>
									</motion.article>
								)
							)}
						</div>
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
								No articles found
							</h3>
							<p>
								Try adjusting your search or
								filter criteria.
							</p>
						</motion.div>
					)}
				</div>
			</section>

			{/* Newsletter Subscription */}
			<section className='py-16 px-6'>
				<div className='max-w-4xl mx-auto text-center'>
					<motion.div
						className={`p-12 rounded-2xl ${
							isDark
								? 'bg-chat-secondary/30 border border-chat-accent/20'
								: 'bg-white border border-gray-200 shadow-xl'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2
							className={`text-3xl md:text-4xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							Stay Updated
						</h2>
						<p
							className={`text-lg mb-8 ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							Subscribe to our newsletter and
							never miss the latest AI
							insights and updates
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
							<input
								type='email'
								placeholder='Enter your email'
								className={`flex-1 px-6 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-chat-pink ${
									isDark
										? 'bg-chat-primary border-chat-accent/30 text-white placeholder:text-chat-accent/60'
										: 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
								}`}
							/>
							<motion.button
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-3 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Subscribe
							</motion.button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default Blog;
