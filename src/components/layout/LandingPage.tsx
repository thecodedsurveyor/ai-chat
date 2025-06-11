import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
	ArrowRight,
	Search,
	Users,
	MessageCircle,
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
import WaterEffect from '../ui/WaterEffect';

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
			answer: 'We support 15+ advanced AI models including GPT-4, Claude, Gemini, Llama, and more. You can switch between them seamlessly.',
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

	// Animated counters
	useEffect(() => {
		const userTarget = 12847;
		const convTarget = 534291;

		const userInterval = setInterval(() => {
			setUserCount((prev) => {
				const increment = Math.ceil(
					(userTarget - prev) / 50
				);
				return prev + increment >= userTarget
					? userTarget
					: prev + increment;
			});
		}, 50);

		const convInterval = setInterval(() => {
			setConversationCount((prev) => {
				const increment = Math.ceil(
					(convTarget - prev) / 60
				);
				return prev + increment >= convTarget
					? convTarget
					: prev + increment;
			});
		}, 30);

		return () => {
			clearInterval(userInterval);
			clearInterval(convInterval);
		};
	}, []);

	// Mouse tracking for particle interactions
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			// Mouse tracking for interactive particles
			const x = e.clientX;
			const y = e.clientY;

			// Update particle positions based on mouse
			const particles = document.querySelectorAll(
				'.interactive-particle'
			);
			particles.forEach((particle) => {
				const rect =
					particle.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;

				const deltaX = (x - centerX) / 50;
				const deltaY = (y - centerY) / 50;

				(
					particle as HTMLElement
				).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
			});
		};
		window.addEventListener(
			'mousemove',
			handleMouseMove
		);
		return () =>
			window.removeEventListener(
				'mousemove',
				handleMouseMove
			);
	}, []);

	useEffect(() => {
		// Hero animations with enhanced timing
		if (heroRef.current) {
			gsap.fromTo(
				heroRef.current.children,
				{ y: 100, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 1.2,
					stagger: 0.15,
					ease: 'power3.out',
				}
			);
		}

		// Features scroll animation with smoother entrance
		if (featuresRef.current) {
			gsap.fromTo(
				featuresRef.current.querySelectorAll(
					'.feature-card'
				),
				{ y: 80, opacity: 0, scale: 0.95 },
				{
					y: 0,
					opacity: 1,
					scale: 1,
					duration: 0.9,
					stagger: 0.15,
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
	}, []);

	const features = [
		{
			icon: '🤖',
			title: 'Smart AI Assistant',
			description:
				'Engage with 15+ advanced AI models including GPT-4, Claude, and Gemini for intelligent conversations and expert assistance.',
		},
		{
			icon: '💾',
			title: 'Smart Memory',
			description:
				'AI remembers your preferences, conversation context, and learning patterns for truly personalized interactions.',
		},
		{
			icon: '🔍',
			title: 'Advanced Search',
			description:
				'Find any conversation, message, or topic instantly with powerful search capabilities and smart filtering.',
		},
		{
			icon: '📱',
			title: 'PWA Support',
			description:
				'Install as a native app on any device with full offline capabilities, push notifications, and seamless sync.',
		},
		{
			icon: '🎨',
			title: 'Beautiful Themes',
			description:
				'Personalize your experience with 6 stunning color schemes, custom fonts, and adaptive layout options.',
		},
		{
			icon: '⚡',
			title: 'Quick Responses',
			description:
				'Access intelligent templates, conversation starters, and quick responses for enhanced productivity.',
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
				{/* Background Water Effect */}
				<div className='absolute inset-0 z-0'>
					<WaterEffect />
				</div>

				{/* Interactive Particles */}
				<div className='absolute inset-0 pointer-events-none'>
					{Array.from({ length: 15 }, (_, i) => (
						<motion.div
							key={i}
							className={`absolute w-2 h-2 rounded-full interactive-particle ${
								isDark
									? 'bg-white/20'
									: 'bg-purple-400/30'
							}`}
							style={{
								left: `${
									Math.random() * 100
								}%`,
								top: `${
									Math.random() * 100
								}%`,
							}}
							animate={{
								y: [0, -25, 0],
								opacity: [0.4, 0.9, 0.4],
								scale: [1, 1.2, 1],
							}}
							transition={{
								duration: 4 + i * 0.5,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: i * 0.2,
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

					{/* Animated Gradient Text */}
					<motion.h1
						className={`text-6xl md:text-8xl font-exo font-bold mb-6 ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
						style={{
							background: `linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6, #06b6d4)`,
							backgroundSize: '400% 400%',
							WebkitBackgroundClip: 'text',
							backgroundClip: 'text',
							color: 'transparent',
							animation:
								'gradient 3s ease infinite',
						}}
					>
						<span className='block'>
							NeuronFlow
						</span>
						Revolution
					</motion.h1>

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
							beautiful customizable themes
						</span>{' '}
						that adapt to your workflow.
					</p>

					<div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
						<motion.button
							onClick={handleTryAI}
							className='group bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-4 rounded-2xl font-exo font-semibold text-lg text-white shadow-2xl hover:shadow-chat-pink/30 transition-all duration-300 flex items-center gap-3 relative overflow-hidden'
							whileHover={{
								scale: 1.05,
								y: -2,
							}}
							whileTap={{ scale: 0.95 }}
						>
							<div className='absolute inset-0 bg-gradient-to-r from-chat-purple to-chat-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
							<span className='relative'>
								Try NeuronFlow Now
							</span>
							<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform relative' />
						</motion.button>

						<motion.button
							onClick={handleLearnMore}
							className={`px-8 py-4 rounded-2xl font-exo font-semibold text-lg border-2 transition-all duration-300 flex items-center gap-3 backdrop-blur-sm ${
								isDark
									? 'border-chat-accent text-white hover:bg-chat-accent/20 hover:border-chat-pink'
									: 'border-gray-300 text-gray-700 hover:bg-white hover:border-chat-purple hover:text-chat-purple'
							}`}
							whileHover={{
								scale: 1.05,
								y: -2,
							}}
							whileTap={{ scale: 0.95 }}
						>
							<Search className='w-5 h-5' />
							Explore Features
						</motion.button>
					</div>
				</div>

				{/* Enhanced Floating elements */}
				<div className='absolute inset-0 pointer-events-none'>
					<motion.div
						className='absolute top-20 left-10 w-4 h-4 bg-chat-pink/40 rounded-full shadow-lg'
						animate={{
							y: [0, -25, 0],
							opacity: [0.4, 0.9, 0.4],
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					/>
					<motion.div
						className='absolute top-40 right-20 w-6 h-6 bg-chat-purple/40 rounded-full shadow-lg'
						animate={{
							y: [0, 35, 0],
							x: [0, -15, 0],
							opacity: [0.5, 1, 0.5],
							scale: [1, 1.3, 1],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: 1,
						}}
					/>
					<motion.div
						className='absolute bottom-40 left-20 w-3 h-3 bg-chat-orange/50 rounded-full shadow-lg'
						animate={{
							y: [0, -20, 0],
							x: [0, 20, 0],
							opacity: [0.3, 0.8, 0.3],
							scale: [1, 1.4, 1],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: 2,
						}}
					/>
					{/* Additional floating elements */}
					<motion.div
						className='absolute top-60 left-1/2 w-2 h-2 bg-chat-cyan/40 rounded-full shadow-lg'
						animate={{
							y: [0, -30, 0],
							x: [0, 25, 0],
							opacity: [0.2, 0.7, 0.2],
							scale: [1, 1.5, 1],
						}}
						transition={{
							duration: 7,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: 3,
						}}
					/>
					<motion.div
						className='absolute bottom-60 right-1/4 w-5 h-5 bg-chat-green/30 rounded-full shadow-lg'
						animate={{
							y: [0, 25, 0],
							x: [0, -20, 0],
							opacity: [0.3, 0.8, 0.3],
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: 5.5,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: 1.5,
						}}
					/>
				</div>
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
							className={`p-6 rounded-2xl backdrop-blur-sm ${
								isDark
									? 'bg-white/10'
									: 'bg-white/80'
							}`}
						>
							<Users
								className={`w-12 h-12 mx-auto mb-4 ${
									isDark
										? 'text-chat-pink'
										: 'text-chat-purple'
								}`}
							/>
							<div
								className={`text-4xl font-bold mb-2 ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								{userCount.toLocaleString()}
								+
							</div>
							<div
								className={`${
									isDark
										? 'text-gray-300'
										: 'text-gray-600'
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
							className={`p-6 rounded-2xl backdrop-blur-sm ${
								isDark
									? 'bg-white/10'
									: 'bg-white/80'
							}`}
						>
							<MessageCircle
								className={`w-12 h-12 mx-auto mb-4 ${
									isDark
										? 'text-chat-orange'
										: 'text-chat-pink'
								}`}
							/>
							<div
								className={`text-4xl font-bold mb-2 ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								{conversationCount.toLocaleString()}
								+
							</div>
							<div
								className={`${
									isDark
										? 'text-gray-300'
										: 'text-gray-600'
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
							className={`p-6 rounded-2xl backdrop-blur-sm ${
								isDark
									? 'bg-white/10'
									: 'bg-white/80'
							}`}
						>
							<Clock
								className={`w-12 h-12 mx-auto mb-4 ${
									isDark
										? 'text-chat-green'
										: 'text-chat-orange'
								}`}
							/>
							<div
								className={`text-4xl font-bold mb-2 ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								99.9%
							</div>
							<div
								className={`${
									isDark
										? 'text-gray-300'
										: 'text-gray-600'
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
								className={`feature-card p-8 rounded-3xl backdrop-blur-lg border transition-all duration-300 hover:scale-105 hover:-translate-y-2 group ${
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
								15+ AI models
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
