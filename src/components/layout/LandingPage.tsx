import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
	ArrowRight,
	Search,
	Users,
	MessagesSquare,
	Shield,
	Globe,
	ChevronDown,
	ChevronUp,
	Clock,
	Zap,
	Search as SearchIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
	const navigate = useNavigate();
	const { isDark } = useTheme();
	const [userCount, setUserCount] = useState(0);
	const [conversationCount, setConversationCount] =
		useState(0);
	const [expandedFAQ, setExpandedFAQ] = useState<
		number | null
	>(null);
	const [faqSearch, setFaqSearch] = useState('');
	const [mousePosition, setMousePosition] = useState({
		x: 0,
		y: 0,
	});
	const [mouseVelocity, setMouseVelocity] = useState(0);
	const lastMousePos = useRef({ x: 0, y: 0 });

	const handleTryAI = () => {
		navigate('/chat');
	};

	const handleLearnMore = () => {
		navigate('/features');
	};

	const heroRef = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLDivElement>(null);

	// FAQ data
	const faqs = [
		{
			question: 'How many AI models are available?',
			answer: 'We support 5 powerful AI models including GPT-4, Claude, and Gemini. You can switch between them seamlessly for different tasks.',
		},
		{
			question: 'Is my data safe and private?',
			answer: 'Absolutely! Your conversations are stored locally on your device. We prioritize privacy and never send your data to external servers without your consent.',
		},
		{
			question: 'Can I use this offline?',
			answer: 'Yes! Our PWA (Progressive Web App) works 100% offline. You can install it on any device and continue chatting even without internet.',
		},
		{
			question: 'How does the smart memory work?',
			answer: 'Our AI remembers your preferences, conversation context, and learning patterns to provide personalized responses across all your chats.',
		},
		{
			question: 'Is it really free?',
			answer: 'Yes! All core features are completely free forever. We believe AI should be accessible to everyone.',
		},
		{
			question: 'Which devices are supported?',
			answer: 'Works on all modern browsers and devices - Windows, Mac, iOS, Android. Install as a native app or use in your browser.',
		},
	];

	// Optimized animated counters - lazy load when section is visible
	useEffect(() => {
		let userInterval: NodeJS.Timeout;
		let convInterval: NodeJS.Timeout;

		// Delay counter animation to improve initial load
		const counterTimeoutId = setTimeout(() => {
			const userTarget = 12847;
			const convTarget = 534291;

			userInterval = setInterval(() => {
				setUserCount((prev) => {
					const increment = Math.ceil(
						(userTarget - prev) / 30
					);
					return prev + increment >= userTarget
						? userTarget
						: prev + increment;
				});
			}, 80);

			convInterval = setInterval(() => {
				setConversationCount((prev) => {
					const increment = Math.ceil(
						(convTarget - prev) / 40
					);
					return prev + increment >= convTarget
						? convTarget
						: prev + increment;
				});
			}, 60);
		}, 1000); // Delay by 1 second to improve initial load

		return () => {
			clearTimeout(counterTimeoutId);
			if (userInterval) clearInterval(userInterval);
			if (convInterval) clearInterval(convInterval);
		};
	}, []);

	// Removed expensive mouse tracking for performance optimization

	// Optimized mouse tracking for gradient light effect
	useEffect(() => {
		let rafId: number;
		let lastTime = 0;

		const handleMouseMove = (e: MouseEvent) => {
			const now = performance.now();
			// Throttle to 30fps for smooth but efficient performance
			if (now - lastTime < 33) return;
			lastTime = now;

			if (rafId) cancelAnimationFrame(rafId);

			rafId = requestAnimationFrame(() => {
				// Calculate mouse velocity for dynamic effect intensity
				const deltaX =
					e.clientX - lastMousePos.current.x;
				const deltaY =
					e.clientY - lastMousePos.current.y;
				const velocity = Math.sqrt(
					deltaX * deltaX + deltaY * deltaY
				);

				setMousePosition({
					x: e.clientX,
					y: e.clientY,
				});
				setMouseVelocity(
					Math.min(velocity / 10, 1)
				); // Normalize velocity

				lastMousePos.current = {
					x: e.clientX,
					y: e.clientY,
				};
			});
		};

		window.addEventListener(
			'mousemove',
			handleMouseMove,
			{ passive: true }
		);
		return () => {
			window.removeEventListener(
				'mousemove',
				handleMouseMove
			);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, []);

	useEffect(() => {
		// Simplified hero animations - faster and lighter
		const timeoutId = setTimeout(() => {
			if (heroRef.current) {
				gsap.fromTo(
					heroRef.current.children,
					{ y: 30, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: 0.6,
						stagger: 0.08,
						ease: 'power2.out',
					}
				);
			}
		}, 100); // Faster initial load

		// Features scroll animation - simplified
		if (featuresRef.current) {
			gsap.fromTo(
				featuresRef.current.querySelectorAll(
					'.feature-card'
				),
				{ y: 40, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.5,
					stagger: 0.08,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: featuresRef.current,
						start: 'top 85%',
						end: 'bottom 20%',
						toggleActions:
							'play none none reverse',
					},
				}
			);
		}

		return () => clearTimeout(timeoutId);
	}, []);

	const features = [
		{
			icon: '🤖',
			title: '5 Powerful AI Models',
			description:
				'Access multiple AI models including GPT-4, Claude, and Gemini with seamless switching for different tasks.',
			highlight: 'FEATURED',
			color: 'from-purple-500 to-pink-600',
		},
		{
			icon: '👤',
			title: 'AI Personas & Templates',
			description:
				'Choose from specialized AI personalities and conversation templates for creative, educational, or professional assistance.',
			highlight: 'SMART',
			color: 'from-blue-500 to-indigo-600',
		},
		{
			icon: '🔗',
			title: 'Share Conversations',
			description:
				'Generate shareable links to your conversations and export chat history for collaboration and backup.',
			highlight: 'SOCIAL',
			color: 'from-green-500 to-emerald-600',
		},
		{
			icon: '💾',
			title: 'Smart Memory System',
			description:
				'AI remembers your preferences, conversation context, and learning patterns for personalized interactions.',
			highlight: 'INTELLIGENT',
			color: 'from-orange-500 to-red-600',
		},
		{
			icon: '📱',
			title: 'Progressive Web App',
			description:
				'Install as a native app with 100% offline functionality, push notifications, and seamless device sync.',
			highlight: 'PWA',
			color: 'from-teal-500 to-cyan-600',
		},
		{
			icon: '📄',
			title: 'Document Analysis',
			description:
				'Upload PDFs and Word documents for AI-powered analysis, summarization, and intelligent Q&A conversations.',
			highlight: 'SMART',
			color: 'from-blue-500 to-indigo-600',
		},
	];

	const filteredFAQs = faqs.filter(
		(faq) =>
			faq.question
				.toLowerCase()
				.includes(faqSearch.toLowerCase()) ||
			faq.answer
				.toLowerCase()
				.includes(faqSearch.toLowerCase())
	);

	return (
		<div
			className={`min-h-screen relative ${
				isDark
					? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
					: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
			}`}
		>
			{/* Hero Section */}
			<section className='relative min-h-screen flex items-center justify-center px-6 overflow-hidden'>
				{/* Simplified Background - Removed heavy WaterEffect for performance */}
				<div
					className={`absolute inset-0 z-0 ${
						isDark
							? 'bg-gradient-to-br from-chat-primary/50 via-chat-secondary/30 to-chat-primary/50'
							: 'bg-gradient-to-br from-blue-50/40 to-purple-50/30'
					}`}
				/>

				{/* Mouse Follow Gradient Light Effect */}
				<div
					className='absolute inset-0 z-0 pointer-events-none transition-opacity duration-300'
					style={{
						opacity: 0.4 + mouseVelocity * 0.3, // Dynamic opacity based on mouse speed
						background: `radial-gradient(${
							600 + mouseVelocity * 200
						}px circle at ${
							mousePosition.x
						}px ${mousePosition.y}px, 
							${
								isDark
									? `rgba(236, 72, 153, ${
											0.12 +
											mouseVelocity *
												0.08
									  }), rgba(139, 92, 246, ${
											0.08 +
											mouseVelocity *
												0.05
									  }), transparent 50%`
									: `rgba(59, 130, 246, ${
											0.1 +
											mouseVelocity *
												0.06
									  }), rgba(147, 51, 234, ${
											0.06 +
											mouseVelocity *
												0.04
									  }), transparent 50%`
							})`,
					}}
				/>

				{/* Minimal decorative particles - Only 3 for performance */}
				<div className='absolute inset-0 pointer-events-none'>
					{Array.from({ length: 3 }, (_, i) => (
						<motion.div
							key={i}
							className={`absolute w-2 h-2 rounded-full ${
								isDark
									? 'bg-white/10'
									: 'bg-purple-400/20'
							}`}
							style={{
								left: `${25 + i * 25}%`,
								top: `${30 + i * 20}%`,
							}}
							animate={{
								opacity: [0.2, 0.4, 0.2],
							}}
							transition={{
								duration: 4 + i,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: i * 0.8,
							}}
						/>
					))}
				</div>

				{/* Hero Content */}
				<div
					ref={heroRef}
					className='relative z-10 text-center max-w-6xl mx-auto'
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.8,
							ease: 'backOut',
						}}
						className='mb-8'
					>
						<div className='w-20 h-20 mx-auto text-6xl mb-6 flex items-center justify-center transform hover:scale-110 transition-transform duration-300'>
							🤖
						</div>
					</motion.div>

					{/* Simplified Static Gradient Text - No animation for performance */}
					<motion.h2
						className={`text-3xl md:text-5xl font-exo font-bold mb-6`}
						style={{
							background: `linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6)`,
							WebkitBackgroundClip: 'text',
							backgroundClip: 'text',
							color: 'transparent',
						}}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.3,
						}}
					>
						<span className='block'>
							NeuronFlow
						</span>
						Revolution
					</motion.h2>

					<p
						className={`text-xl leading-relaxed mb-10 max-w-4xl mx-auto ${
							isDark
								? 'text-gray-300'
								: 'text-gray-700'
						}`}
					>
						Experience the power of AI with{' '}
						<span className='font-semibold text-chat-pink'>
							smart memory capabilities
						</span>
						,{' '}
						<span className='font-semibold text-chat-purple'>
							advanced search functionality
						</span>
						, and{' '}
						<span className='font-semibold text-chat-orange'>
							document analysis features
						</span>{' '}
						that adapt to your workflow.
					</p>

					<div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
						<motion.button
							onClick={handleTryAI}
							className='group bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-4 rounded-2xl font-exo font-semibold text-lg text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3'
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<span>Try NeuronFlow Now</span>
							<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
						</motion.button>

						<motion.button
							onClick={handleLearnMore}
							className={`px-8 py-4 rounded-2xl font-exo font-semibold text-lg border-2 transition-all duration-200 flex items-center gap-3 ${
								isDark
									? 'border-chat-accent text-white hover:bg-chat-accent/10'
									: 'border-gray-300 text-gray-700 hover:bg-gray-50'
							}`}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<Search className='w-5 h-5' />
							Explore Features
						</motion.button>
					</div>
				</div>

				{/* Removed floating elements for better performance */}
			</section>

			{/* Social Proof & Statistics Section */}
			<section
				className={`py-16 px-6 ${
					isDark
						? 'bg-gradient-to-r from-chat-secondary/50 to-chat-primary/50'
						: 'bg-gradient-to-r from-white/80 to-blue-50/80'
				} backdrop-blur-sm`}
			>
				<div className='max-w-6xl mx-auto'>
					{/* Trust Badges */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className='flex flex-wrap justify-center gap-8 mb-12'
					>
						{[
							{
								icon: (
									<Shield className='w-6 h-6' />
								),
								text: 'Privacy First',
								color: 'green',
							},
							{
								icon: (
									<Globe className='w-6 h-6' />
								),
								text: 'Open Source',
								color: 'blue',
							},
							{
								icon: (
									<Zap className='w-6 h-6' />
								),
								text: 'Offline Ready',
								color: 'purple',
							},
						].map((badge, index) => (
							<div
								key={index}
								className={`flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm border ${
									isDark
										? 'bg-white/10 border-white/20 text-white'
										: 'bg-white border-gray-200 text-gray-700'
								}`}
							>
								<div
									className={`text-${badge.color}-500`}
								>
									{badge.icon}
								</div>
								<span className='font-medium'>
									{badge.text}
								</span>
							</div>
						))}
					</motion.div>

					{/* Statistics */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
						<motion.div
							initial={{
								opacity: 0,
								scale: 0.8,
							}}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							transition={{
								duration: 0.6,
								delay: 0.1,
							}}
							viewport={{ once: true }}
							whileHover={{
								scale: 1.05,
								y: -8,
							}}
							className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer group ${
								isDark
									? 'bg-white/10 hover:bg-white/20 hover:shadow-2xl hover:shadow-chat-pink/20'
									: 'bg-white/80 hover:bg-white hover:shadow-2xl hover:shadow-chat-purple/20'
							}`}
						>
							<Users
								className={`w-12 h-12 mx-auto mb-4 transition-all duration-300 group-hover:scale-110 ${
									isDark
										? 'text-chat-pink group-hover:text-chat-pink'
										: 'text-chat-purple group-hover:text-chat-purple'
								}`}
							/>
							<div
								className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
									isDark
										? 'text-white group-hover:text-chat-pink'
										: 'text-gray-800 group-hover:text-chat-purple'
								}`}
							>
								{userCount.toLocaleString()}
								+
							</div>
							<div
								className={`transition-colors duration-300 ${
									isDark
										? 'text-gray-300 group-hover:text-gray-200'
										: 'text-gray-600 group-hover:text-gray-700'
								}`}
							>
								Active Users
							</div>
						</motion.div>

						<motion.div
							initial={{
								opacity: 0,
								scale: 0.8,
							}}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							transition={{
								duration: 0.6,
								delay: 0.2,
							}}
							viewport={{ once: true }}
							whileHover={{
								scale: 1.05,
								y: -8,
							}}
							className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer group ${
								isDark
									? 'bg-white/10 hover:bg-white/20 hover:shadow-2xl hover:shadow-chat-orange/20'
									: 'bg-white/80 hover:bg-white hover:shadow-2xl hover:shadow-chat-pink/20'
							}`}
						>
							<MessagesSquare
								className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 group-hover:scale-110 ${
									isDark
										? 'text-chat-orange group-hover:text-chat-orange'
										: 'text-chat-pink group-hover:text-chat-pink'
								}`}
							/>
							<div
								className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
									isDark
										? 'text-white group-hover:text-chat-orange'
										: 'text-gray-800 group-hover:text-chat-pink'
								}`}
							>
								{conversationCount.toLocaleString()}
								+
							</div>
							<div
								className={`transition-colors duration-300 ${
									isDark
										? 'text-gray-300 group-hover:text-gray-200'
										: 'text-gray-600 group-hover:text-gray-700'
								}`}
							>
								Conversations
							</div>
						</motion.div>

						<motion.div
							initial={{
								opacity: 0,
								scale: 0.8,
							}}
							whileInView={{
								opacity: 1,
								scale: 1,
							}}
							transition={{
								duration: 0.6,
								delay: 0.3,
							}}
							viewport={{ once: true }}
							whileHover={{
								scale: 1.05,
								y: -8,
							}}
							className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer group ${
								isDark
									? 'bg-white/10 hover:bg-white/20 hover:shadow-2xl hover:shadow-green-500/20'
									: 'bg-white/80 hover:bg-white hover:shadow-2xl hover:shadow-chat-orange/20'
							}`}
						>
							<Clock
								className={`w-12 h-12 mx-auto mb-4 transition-all duration-300 group-hover:scale-110 ${
									isDark
										? 'text-green-400 group-hover:text-green-400'
										: 'text-chat-orange group-hover:text-chat-orange'
								}`}
							/>
							<div
								className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
									isDark
										? 'text-white group-hover:text-green-400'
										: 'text-gray-800 group-hover:text-chat-orange'
								}`}
							>
								99.9%
							</div>
							<div
								className={`transition-colors duration-300 ${
									isDark
										? 'text-gray-300 group-hover:text-gray-200'
										: 'text-gray-600 group-hover:text-gray-700'
								}`}
							>
								Uptime
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features-section'
				ref={featuresRef}
				className={`py-24 px-6 ${
					isDark
						? 'bg-gradient-to-br from-chat-secondary to-chat-primary'
						: 'bg-gradient-to-br from-white to-slate-100'
				}`}
			>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						className='text-center mb-20'
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2
							className={`text-5xl md:text-7xl font-exo font-bold mb-8 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Powerful{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								AI Features
							</span>
						</h2>
						<p
							className={`text-xl max-w-4xl mx-auto leading-relaxed ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Experience cutting-edge
							artificial intelligence with{' '}
							<span className='font-semibold'>
								voice capabilities
							</span>
							,{' '}
							<span className='font-semibold'>
								advanced conversations
							</span>
							, and{' '}
							<span className='font-semibold'>
								seamless interaction
							</span>{' '}
							across all your devices.
						</p>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								className={`feature-card p-8 rounded-3xl backdrop-blur-lg border transition-all duration-300 hover:scale-105 hover:-translate-y-2 group relative overflow-hidden ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20 hover:bg-chat-secondary/50 hover:border-chat-orange/40 hover:shadow-2xl hover:shadow-chat-orange/10'
										: 'bg-white/70 border-chat-purple/30 hover:bg-white hover:shadow-2xl hover:border-chat-pink/50 hover:shadow-chat-pink/10'
								}`}
								initial={{
									opacity: 0,
									y: 50,
								}}
								whileInView={{
									opacity: 1,
									y: 0,
								}}
								transition={{
									duration: 0.6,
									delay: index * 0.1,
								}}
								viewport={{ once: true }}
							>
								{/* Feature Highlight Badge */}
								{feature.highlight && (
									<div
										className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${feature.color} shadow-lg z-10`}
									>
										{feature.highlight}
									</div>
								)}

								<div className='text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300'>
									{feature.icon}
								</div>
								<h3
									className={`text-2xl font-exo font-semibold mb-4 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									{feature.title}
								</h3>
								<p
									className={`leading-relaxed ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									{feature.description}
								</p>

								{/* Enhanced Hover Effect with Feature Color */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500 pointer-events-none`}
								/>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section
				className={`py-20 px-6 ${
					isDark
						? 'bg-gradient-to-br from-chat-primary/50 to-chat-secondary/50'
						: 'bg-gradient-to-br from-blue-50/80 to-white/80'
				} backdrop-blur-sm`}
			>
				<div className='max-w-4xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className='text-center mb-12'
					>
						<h2
							className={`text-4xl md:text-5xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Frequently Asked{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								Questions
							</span>
						</h2>

						{/* FAQ Search */}
						<div
							className={`relative max-w-md mx-auto mb-8 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							<SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='text'
								placeholder='Search questions...'
								value={faqSearch}
								onChange={(e) =>
									setFaqSearch(
										e.target.value
									)
								}
								className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-sm ${
									isDark
										? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
										: 'bg-white/80 border-gray-200 text-gray-800 placeholder-gray-500'
								} focus:outline-none focus:ring-2 focus:ring-chat-pink/50`}
							/>
						</div>
					</motion.div>

					<div className='space-y-4'>
						{filteredFAQs.map((faq, index) => (
							<motion.div
								key={index}
								initial={{
									opacity: 0,
									y: 20,
								}}
								whileInView={{
									opacity: 1,
									y: 0,
								}}
								transition={{
									duration: 0.5,
									delay: index * 0.1,
								}}
								viewport={{ once: true }}
								className={`rounded-xl backdrop-blur-sm border overflow-hidden ${
									isDark
										? 'bg-white/10 border-white/20'
										: 'bg-white/80 border-gray-200'
								}`}
							>
								<button
									onClick={() =>
										setExpandedFAQ(
											expandedFAQ ===
												index
												? null
												: index
										)
									}
									className={`w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-colors ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									<span className='font-semibold pr-4'>
										{faq.question}
									</span>
									{expandedFAQ ===
									index ? (
										<ChevronUp className='w-5 h-5 flex-shrink-0 text-chat-pink' />
									) : (
										<ChevronDown className='w-5 h-5 flex-shrink-0 text-chat-pink' />
									)}
								</button>

								<motion.div
									initial={false}
									animate={{
										height:
											expandedFAQ ===
											index
												? 'auto'
												: 0,
										opacity:
											expandedFAQ ===
											index
												? 1
												: 0,
									}}
									transition={{
										duration: 0.3,
									}}
									className='overflow-hidden'
								>
									<div
										className={`p-6 pt-0 ${
											isDark
												? 'text-gray-300'
												: 'text-gray-600'
										}`}
									>
										{faq.answer}
									</div>
								</motion.div>
							</motion.div>
						))}
					</div>

					{filteredFAQs.length === 0 && (
						<div
							className={`text-center py-8 ${
								isDark
									? 'text-gray-400'
									: 'text-gray-500'
							}`}
						>
							No questions found matching your
							search.
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section
				className={`py-24 px-6 ${
					isDark
						? 'bg-gradient-to-r from-chat-primary to-chat-secondary'
						: 'bg-gradient-to-r from-blue-50 to-indigo-100'
				}`}
			>
				<div className='max-w-4xl mx-auto text-center'>
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2
							className={`text-5xl md:text-7xl font-exo font-bold mb-8 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Ready to{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								Start Chatting
							</span>
							?
						</h2>
						<p
							className={`text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Join thousands of users who are
							already experiencing the future
							of AI conversation with{' '}
							<span className='font-semibold'>
								24 powerful features
							</span>{' '}
							and{' '}
							<span className='font-semibold'>
								5 AI models
							</span>
							.
						</p>
						<motion.button
							onClick={handleTryAI}
							className='bg-gradient-to-r from-chat-pink to-chat-purple px-12 py-6 rounded-2xl font-exo font-bold text-xl text-white shadow-2xl hover:shadow-chat-pink/30 transition-all duration-300 relative overflow-hidden group'
							whileHover={{
								scale: 1.05,
								y: -3,
							}}
							whileTap={{ scale: 0.95 }}
						>
							<div className='absolute inset-0 bg-gradient-to-r from-chat-purple to-chat-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
							<span className='relative'>
								Get Started Free
							</span>
						</motion.button>
					</motion.div>
				</div>
			</section>

			{/* CSS for gradient animation */}
			<style>
				{`
					@keyframes gradient {
						0% { background-position: 0% 50%; }
						50% { background-position: 100% 50%; }
						100% { background-position: 0% 50%; }
					}
				`}
			</style>
		</div>
	);
};

export default LandingPage;
