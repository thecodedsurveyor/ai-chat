import React from 'react';
import { motion } from 'framer-motion';
import {
	Target,
	Users,
	Zap,
	Heart,
	Award,
	Globe,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTitle } from '../hooks/usePageTitle';

const About = () => {
	const { isDark } = useTheme();
	usePageTitle('About Us – NeuronFlow');

	const values = [
		{
			icon: <Zap className='w-8 h-8' />,
			title: 'Innovation',
			description:
				'We push the boundaries of AI technology to create cutting-edge conversational experiences.',
		},
		{
			icon: <Heart className='w-8 h-8' />,
			title: 'User-Centric',
			description:
				'Every feature we build is designed with our users in mind, prioritizing simplicity and effectiveness.',
		},
		{
			icon: <Globe className='w-8 h-8' />,
			title: 'Accessibility',
			description:
				'We believe AI should be accessible to everyone, regardless of technical background.',
		},
		{
			icon: <Award className='w-8 h-8' />,
			title: 'Excellence',
			description:
				'We strive for excellence in everything we do, from code quality to customer support.',
		},
	];

	const stats = [
		{ number: '50K+', label: 'Active Users' },
		{ number: '1M+', label: 'Conversations' },
		{ number: '99.9%', label: 'Uptime' },
		{ number: '24/7', label: 'Support' },
	];

	return (
		<div
			className={`min-h-screen pt-24 ${
				isDark
					? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
					: 'bg-gradient-to-br from-chat-light-primary via-chat-light-secondary to-chat-light-primary'
			}`}
		>
			{/* Hero Section */}
			<section className='py-20 px-6'>
				<div className='max-w-4xl mx-auto text-center'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1
							className={`text-5xl md:text-7xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							About{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								NeuronFlow
							</span>
						</h1>
						<p
							className={`text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							At NeuronFlow, we believe that
							artificial intelligence should
							enhance human communication, not
							replace it. Our mission is to
							create AI-powered tools that
							understand context, emotion, and
							intent, making every
							conversation more productive and
							meaningful.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Mission Section */}
			<section className='py-20 px-6'>
				<div className='max-w-6xl mx-auto'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
						>
							<div className='flex items-center gap-4 mb-6'>
								<Target className='w-8 h-8 text-chat-pink' />
								<h2
									className={`text-4xl font-exo font-bold ${
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									}`}
								>
									Our Mission
								</h2>
							</div>
							<p
								className={`text-lg leading-relaxed mb-6 ${
									isDark
										? 'text-chat-accent'
										: 'text-chat-light-muted'
								}`}
							>
								At NeuronFlow, we believe
								that artificial intelligence
								should enhance human
								communication, not replace
								it. Our mission is to create
								AI-powered tools that
								understand context, emotion,
								and intent, making every
								conversation more productive
								and meaningful.
							</p>
							<p
								className={`text-lg leading-relaxed ${
									isDark
										? 'text-chat-accent'
										: 'text-chat-light-muted'
								}`}
							>
								We're building the future of
								conversational AI, where
								technology serves humanity
								by making information more
								accessible, creativity more
								fluid, and connections more
								authentic.
							</p>
						</motion.div>

						<motion.div
							className='relative'
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
						>
							<div
								className={`backdrop-blur-sm border-2 rounded-2xl p-8 transition-all duration-300 ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-orange/40'
										: 'bg-white/80 border-chat-light-border hover:border-chat-light-accent/50 shadow-lg'
								}`}
							>
								<h3
									className={`text-2xl font-exo font-bold mb-6 ${
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									}`}
								>
									What Drives Us
								</h3>
								<div className='space-y-4'>
									<div className='flex items-start gap-3'>
										<div className='w-2 h-2 bg-chat-pink rounded-full mt-3 flex-shrink-0'></div>
										<p
											className={
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-muted'
											}
										>
											Making AI
											accessible to
											everyone,
											regardless of
											technical
											expertise
										</p>
									</div>
									<div className='flex items-start gap-3'>
										<div className='w-2 h-2 bg-chat-pink rounded-full mt-3 flex-shrink-0'></div>
										<p
											className={
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-muted'
											}
										>
											Prioritizing
											user privacy and
											data security in
											everything we
											build
										</p>
									</div>
									<div className='flex items-start gap-3'>
										<div className='w-2 h-2 bg-chat-pink rounded-full mt-3 flex-shrink-0'></div>
										<p
											className={
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-muted'
											}
										>
											Creating
											meaningful
											interactions
											that enhance
											human creativity
										</p>
									</div>
									<div className='flex items-start gap-3'>
										<div className='w-2 h-2 bg-chat-pink rounded-full mt-3 flex-shrink-0'></div>
										<p
											className={
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-muted'
											}
										>
											Building
											technology that
											brings people
											closer together
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className='py-20 px-6'>
				<div className='max-w-6xl mx-auto'>
					<motion.div
						className='text-center mb-16'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h2
							className={`text-4xl md:text-5xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							Our Impact in{' '}
							<span className='bg-gradient-to-r from-chat-orange to-chat-pink bg-clip-text text-transparent'>
								Numbers
							</span>
						</h2>
						<p
							className={`text-xl max-w-2xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							These numbers represent the
							trust our users place in us and
							our commitment to excellence.
						</p>
					</motion.div>

					<div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
						{stats.map((stat, index) => (
							<motion.div
								key={index}
								className={`backdrop-blur-sm border-2 rounded-2xl p-8 text-center transition-all duration-300 ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-orange/40'
										: 'bg-white/90 border-chat-light-border hover:border-chat-light-accent/60 shadow-lg'
								}`}
								initial={{
									opacity: 0,
									y: 30,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								transition={{
									duration: 0.5,
									delay: index * 0.1,
								}}
								whileHover={{ y: -5 }}
							>
								<div className='text-4xl font-exo font-bold bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent mb-2'>
									{stat.number}
								</div>
								<div
									className={`font-medium ${
										isDark
											? 'text-chat-accent'
											: 'text-chat-light-muted'
									}`}
								>
									{stat.label}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className='py-20 px-6'>
				<div className='max-w-6xl mx-auto'>
					<motion.div
						className='text-center mb-16'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h2
							className={`text-4xl md:text-5xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							Our{' '}
							<span className='bg-gradient-to-r from-chat-orange to-chat-pink bg-clip-text text-transparent'>
								Values
							</span>
						</h2>
						<p
							className={`text-xl max-w-2xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							These core values guide every
							decision we make and every
							feature we build.
						</p>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{values.map((value, index) => (
							<motion.div
								key={index}
								className={`backdrop-blur-sm border-2 rounded-2xl p-8 transition-all duration-300 ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-orange/40'
										: 'bg-white/90 border-chat-light-border hover:border-chat-light-accent/60 shadow-lg'
								}`}
								initial={{
									opacity: 0,
									y: 30,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								transition={{
									duration: 0.5,
									delay: index * 0.1,
								}}
								whileHover={{ y: -5 }}
							>
								<div className='text-chat-pink mb-4'>
									{value.icon}
								</div>
								<h3
									className={`text-2xl font-exo font-bold mb-4 ${
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									}`}
								>
									{value.title}
								</h3>
								<p
									className={`leading-relaxed ${
										isDark
											? 'text-chat-accent'
											: 'text-chat-light-muted'
									}`}
								>
									{value.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className='py-20 px-6'>
				<div className='max-w-4xl mx-auto text-center'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<div className='flex items-center justify-center gap-4 mb-6'>
							<Users className='w-8 h-8 text-chat-pink' />
							<h2
								className={`text-4xl md:text-5xl font-exo font-bold ${
									isDark
										? 'text-white'
										: 'text-chat-light-text'
								}`}
							>
								Our Team
							</h2>
						</div>
						<p
							className={`text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							We're a diverse team of
							engineers, designers, and AI
							researchers united by our
							passion for creating technology
							that makes a positive impact on
							the world.
						</p>

						<div
							className={`backdrop-blur-sm border-2 rounded-2xl p-12 transition-all duration-300 ${
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/20'
									: 'bg-white/90 border-chat-light-border hover:border-chat-light-accent/60 shadow-lg'
							}`}
						>
							<h3
								className={`text-2xl font-exo font-bold mb-6 ${
									isDark
										? 'text-white'
										: 'text-chat-light-text'
								}`}
							>
								Join Our Mission
							</h3>
							<p
								className={`text-lg mb-8 ${
									isDark
										? 'text-chat-accent'
										: 'text-chat-light-muted'
								}`}
							>
								We're always looking for
								talented individuals who
								share our vision of making
								AI more accessible and
								beneficial for everyone.
							</p>
							<motion.button
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-4 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-chat-pink/25 transition-all duration-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								View Open Positions
							</motion.button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default About;
