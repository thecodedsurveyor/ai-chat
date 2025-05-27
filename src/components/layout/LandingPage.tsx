import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
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
		// Hero animations
		if (heroRef.current) {
			gsap.fromTo(
				heroRef.current.children,
				{ y: 100, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 1,
					stagger: 0.2,
					ease: 'power3.out',
				}
			);
		}

		// Features scroll animation
		if (featuresRef.current) {
			gsap.fromTo(
				featuresRef.current.querySelectorAll(
					'.feature-card'
				),
				{ y: 100, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					stagger: 0.2,
					scrollTrigger: {
						trigger: featuresRef.current,
						start: 'top 80%',
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
				'Powered by advanced AI models for intelligent conversations and helpful responses.',
		},
		{
			icon: '💾',
			title: 'Smart Memory',
			description:
				'AI remembers your preferences and conversation context for personalized interactions.',
		},
		{
			icon: '🔍',
			title: 'Advanced Search',
			description:
				'Find any conversation or message instantly with powerful search capabilities.',
		},
		{
			icon: '📱',
			title: 'PWA Support',
			description:
				'Install as a native app on any device with offline capabilities and push notifications.',
		},
		{
			icon: '🎨',
			title: 'Customizable Themes',
			description:
				'Personalize your experience with multiple themes, fonts, and layout options.',
		},
		{
			icon: '⚡',
			title: 'Quick Responses',
			description:
				'Access pre-built templates and quick responses for faster conversations.',
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
						transition={{ duration: 0.8 }}
						className='mb-8'
					>
						<div className='w-20 h-20 mx-auto text-6xl mb-6 flex items-center justify-center'>
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

					<p className='text-lg text-gray-600 dark:text-gray-300 mb-8'>
						Experience the power of AI with
						smart memory capabilities, advanced
						search functionality, and
						customizable themes that adapt to
						your workflow.
					</p>

					<div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
						<motion.button
							onClick={handleTryAI}
							className='group bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-4 rounded-2xl font-exo font-semibold text-lg text-white shadow-2xl hover:shadow-chat-pink/25 transition-all duration-300 flex items-center gap-3'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Try AI Chat Now
							<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
						</motion.button>

						<motion.button
							onClick={handleLearnMore}
							className={`px-8 py-4 rounded-2xl font-exo font-semibold text-lg border-2 transition-all duration-300 ${
								isDark
									? 'border-chat-accent text-gray-700 hover:bg-gray-700 hover:text-white'
									: 'border-gray-300 text-gray-700 hover:bg-gray-600 hover:border-gray-400'
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Learn More
						</motion.button>
					</div>
				</div>

				{/* Floating elements */}
				<div className='absolute inset-0 pointer-events-none'>
					<motion.div
						className='absolute top-20 left-10 w-4 h-4 bg-chat-pink/30 rounded-full'
						animate={{
							y: [0, -20, 0],
							opacity: [0.3, 0.8, 0.3],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					/>
					<motion.div
						className='absolute top-40 right-20 w-6 h-6 bg-chat-purple/30 rounded-full'
						animate={{
							y: [0, 30, 0],
							x: [0, -10, 0],
							opacity: [0.4, 0.9, 0.4],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: 1,
						}}
					/>
					<motion.div
						className='absolute bottom-40 left-20 w-3 h-3 bg-chat-orange/40 rounded-full'
						animate={{
							y: [0, -15, 0],
							x: [0, 15, 0],
							opacity: [0.2, 0.7, 0.2],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: 2,
						}}
					/>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features-section'
				ref={featuresRef}
				className={`py-20 px-6 ${
					isDark
						? 'bg-gradient-to-br from-chat-secondary to-chat-primary'
						: 'bg-gradient-to-br from-white to-slate-100'
				}`}
			>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						className='text-center mb-16'
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2
							className={`text-4xl md:text-6xl font-exo font-bold mb-6 ${
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
							className={`text-xl max-w-3xl mx-auto leading-relaxed ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Experience cutting-edge
							artificial intelligence with
							voice capabilities, advanced
							conversations, and seamless
							interaction.
						</p>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								className={`feature-card p-8 rounded-3xl backdrop-blur-lg border transition-all duration-300 hover:scale-105 ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20 hover:bg-chat-secondary/50 hover:border-chat-orange/40'
										: 'bg-white/70 border-chat-purple/30 hover:bg-white hover:shadow-lg hover:border-chat-pink/50'
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
								<div className='text-chat-pink mb-6'>
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
				className={`py-20 px-6 ${
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
							className={`text-4xl md:text-6xl font-exo font-bold mb-6 ${
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
							className={`text-xl mb-8 max-w-2xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Join thousands of users who are
							already experiencing the future
							of AI conversation.
						</p>
						<motion.button
							onClick={handleTryAI}
							className='bg-gradient-to-r from-chat-pink to-chat-purple px-12 py-6 rounded-2xl font-exo font-bold text-xl text-white shadow-2xl hover:shadow-chat-pink/25 transition-all duration-300'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Get Started Free
						</motion.button>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
