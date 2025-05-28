import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import WaterEffect from '../ui/WaterEffect';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
	const navigate = useNavigate();
	const { isDark } = useTheme();

	const handleTryAI = () => {
		navigate('/ai-chat');
	};

	// Navigate to features page
	const handleLearnMore = () => {
		navigate('/features');
	};

	const heroRef = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLDivElement>(null);

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

	return (
		<div
			className={`min-h-screen ${
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

					<h1
						className={`text-6xl md:text-8xl font-exo font-bold mb-6 ${
							isDark
								? 'text-white'
								: 'text-gray-800'
						}`}
					>
						<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
							AI Chat
						</span>{' '}
						Revolution
					</h1>

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
								Try AI Chat Now
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
		</div>
	);
};

export default LandingPage;
