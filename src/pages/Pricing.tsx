import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTitle } from '../hooks/usePageTitle';
import {
	Check,
	X,
	Star,
	Zap,
	BarChart3,
	Shield,
	Headphones,
	Infinity as InfinityIcon,
} from 'lucide-react';

const Pricing = () => {
	const { isDark } = useTheme();
	const navigate = useNavigate();
	usePageTitle('Pricing – NeuronFlow');

	const plans = [
		{
			name: 'Free',
			price: '$0',
			period: 'forever',
			description:
				'Perfect for getting started with AI conversations - all features included',
			icon: <Zap className='w-6 h-6' />,
			color: 'from-green-500 to-emerald-600',
			popular: true,
			features: [
				{
					name: 'Unlimited messages',
					included: true,
				},
				{ name: 'All AI models', included: true },
				{
					name: 'Real-time responses',
					included: true,
				},
				{
					name: 'Web & mobile access',
					included: true,
				},
				{
					name: 'Voice input/output',
					included: true,
				},
				{
					name: 'Code syntax highlighting',
					included: true,
				},
				{
					name: 'Multiple AI personas',
					included: true,
				},
				{ name: 'Chat templates', included: true },
				{
					name: 'Export conversations',
					included: true,
				},
				{
					name: 'Dark/light themes',
					included: true,
				},
			],
		},
		{
			name: 'Premium',
			price: 'Coming Soon',
			period: '',
			description:
				'Advanced features and capabilities are in development',
			icon: <Star className='w-6 h-6' />,
			color: 'from-purple-500 to-pink-600',
			popular: false,
			features: [
				{
					name: 'Everything in Free',
					included: true,
				},
				{
					name: 'API access',
					included: true,
				},
				{
					name: 'Advanced analytics',
					included: true,
				},
				{
					name: 'Priority support',
					included: true,
				},
				{
					name: 'Custom integrations',
					included: true,
				},
				{
					name: 'Team collaboration',
					included: true,
				},
				{
					name: 'Advanced memory',
					included: true,
				},
				{ name: 'Custom personas', included: true },
				{
					name: 'Workflow automation',
					included: true,
				},
			],
		},
	];

	const faqs = [
		{
			question:
				'Is NeuronFlow really completely free?',
			answer: 'Yes! All features are currently free including unlimited messages, all AI models, and premium capabilities. We believe AI should be accessible to everyone.',
		},
		{
			question: 'What AI models can I use?',
			answer: 'You have access to all leading AI models including GPT-4, Claude, Gemini, and more. No restrictions or limits.',
		},
		{
			question:
				'Will you introduce paid plans in the future?',
			answer: 'We may introduce premium features for advanced enterprise needs, but our core platform will always remain free for individual users.',
		},
		{
			question: 'Is there a message limit?',
			answer: 'No! You can send unlimited messages and have unlimited conversations. There are no daily, monthly, or yearly limits.',
		},
		{
			question:
				'How can you offer everything for free?',
			answer: "We're building NeuronFlow as a platform to democratize AI access. We're currently funded by investors who share our vision of making AI accessible to all.",
		},
	];

	const features = [
		{
			icon: <BarChart3 className='w-6 h-6' />,
			title: 'Advanced Analytics',
			description:
				'Track usage patterns, conversation insights, and performance metrics.',
		},
		{
			icon: <Shield className='w-6 h-6' />,
			title: 'Enterprise Security',
			description:
				'SOC 2 compliance, data encryption, and advanced security features.',
		},
		{
			icon: <Headphones className='w-6 h-6' />,
			title: '24/7 Support',
			description:
				'Round-the-clock support from our expert team for Enterprise customers.',
		},
		{
			icon: <InfinityIcon className='w-6 h-6' />,
			title: 'Unlimited Usage',
			description:
				'No limits on messages, conversations, or AI model usage.',
		},
	];

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
							Simple, Transparent{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								Pricing
							</span>
						</h1>
						<p
							className={`text-xl mb-8 max-w-3xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							Choose the perfect plan for your
							AI conversation needs. Start
							free and scale as you grow.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Pricing Cards */}
			<section className='py-16 px-6'>
				<div className='max-w-5xl mx-auto'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center'>
						{plans.map((plan, index) => (
							<motion.div
								key={plan.name}
								className={`relative rounded-2xl border-2 p-8 w-full max-w-md ${
									plan.popular
										? isDark
											? 'border-chat-pink bg-chat-secondary/50'
											: 'border-chat-pink bg-white shadow-xl'
										: isDark
										? 'border-chat-accent/20 bg-chat-secondary/30'
										: 'border-gray-200 bg-white shadow-lg'
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
								whileHover={{ scale: 1.02 }}
							>
								{plan.popular && (
									<div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
										<div className='bg-gradient-to-r from-chat-pink to-chat-purple px-4 py-2 rounded-full'>
											<div className='flex items-center gap-2 text-white text-sm font-semibold'>
												<Star className='w-4 h-4' />
												Most Popular
											</div>
										</div>
									</div>
								)}

								<div className='text-center mb-8'>
									<div
										className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} mb-4 text-white`}
									>
										{plan.icon}
									</div>
									<h3
										className={`text-2xl font-exo font-bold mb-2 ${
											isDark
												? 'text-white'
												: 'text-gray-800'
										}`}
									>
										{plan.name}
									</h3>
									<div className='mb-4'>
										<span
											className={`text-4xl font-bold ${
												isDark
													? 'text-white'
													: 'text-gray-800'
											}`}
										>
											{plan.price}
										</span>
										<span
											className={`text-sm ${
												isDark
													? 'text-chat-accent'
													: 'text-gray-600'
											}`}
										>
											/{plan.period}
										</span>
									</div>
									<p
										className={`text-sm ${
											isDark
												? 'text-chat-accent'
												: 'text-gray-600'
										}`}
									>
										{plan.description}
									</p>
								</div>

								<div className='space-y-4 mb-8'>
									{plan.features.map(
										(
											feature,
											featureIndex
										) => (
											<div
												key={
													featureIndex
												}
												className='flex items-center gap-3'
											>
												{feature.included ? (
													<Check className='w-5 h-5 text-green-500 flex-shrink-0' />
												) : (
													<X className='w-5 h-5 text-gray-400 flex-shrink-0' />
												)}
												<span
													className={`text-sm ${
														feature.included
															? isDark
																? 'text-white'
																: 'text-gray-800'
															: isDark
															? 'text-gray-500'
															: 'text-gray-400'
													}`}
												>
													{
														feature.name
													}
												</span>
											</div>
										)
									)}
								</div>

								<motion.button
									className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
										plan.popular
											? 'bg-gradient-to-r from-chat-pink to-chat-purple text-white shadow-lg hover:shadow-xl'
											: isDark
											? 'bg-chat-accent/20 text-chat-accent hover:bg-chat-accent hover:text-chat-primary border border-chat-accent/30'
											: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
									}`}
									whileHover={{
										scale: 1.02,
									}}
									whileTap={{
										scale: 0.98,
									}}
									onClick={() => {
										if (
											plan.name ===
											'Free'
										) {
											navigate(
												'/chat'
											);
										} else {
											// Premium plan - contact sales
											const subject =
												encodeURIComponent(
													'Premium Plan Inquiry'
												);
											const body =
												encodeURIComponent(`
Hello NeuronFlow Team,

I'm interested in learning more about your upcoming Premium features.

Please notify me when premium features become available.

Best regards,
[Your Name]
											`);
											window.location.href = `mailto:sales@neuronflow.com?subject=${subject}&body=${body}`;
										}
									}}
								>
									{plan.name === 'Free'
										? 'Get Started'
										: 'Notify Me'}
								</motion.button>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-16 px-6'>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						className='text-center mb-16'
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
							Enterprise Features
						</h2>
						<p
							className={`text-lg max-w-3xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							Advanced capabilities designed
							for teams and organizations
						</p>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								className={`text-center p-6 rounded-xl ${
									isDark
										? 'bg-chat-secondary/30 border border-chat-accent/20'
										: 'bg-white border border-gray-200 shadow-lg'
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
								<div className='inline-flex p-3 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple mb-4'>
									{feature.icon}
								</div>
								<h3
									className={`text-lg font-semibold mb-3 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									{feature.title}
								</h3>
								<p
									className={`text-sm ${
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
			<section className='py-16 px-6'>
				<div className='max-w-4xl mx-auto'>
					<motion.div
						className='text-center mb-16'
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
							Frequently Asked Questions
						</h2>
					</motion.div>

					<div className='space-y-6'>
						{faqs.map((faq, index) => (
							<motion.div
								key={index}
								className={`p-6 rounded-xl ${
									isDark
										? 'bg-chat-secondary/30 border border-chat-accent/20'
										: 'bg-white border border-gray-200 shadow-lg'
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
								<h3
									className={`text-lg font-semibold mb-3 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									{faq.question}
								</h3>
								<p
									className={`${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									{faq.answer}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
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
							Ready to Get Started?
						</h2>
						<p
							className={`text-lg mb-8 ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							Join thousands of users already
							using NeuronFlow to enhance
							their productivity
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<motion.button
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-4 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() =>
									navigate('/chat')
								}
							>
								Start Free Trial
							</motion.button>
							<motion.button
								className={`px-8 py-4 rounded-xl font-exo font-semibold border-2 transition-all duration-300 ${
									isDark
										? 'text-chat-accent border-chat-accent hover:bg-chat-accent hover:text-chat-primary'
										: 'text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => {
									const subject =
										encodeURIComponent(
											'Enterprise Sales Inquiry'
										);
									const body =
										encodeURIComponent(`
Hello NeuronFlow Sales Team,

I am interested in learning more about your premium features and enterprise solutions.

Please contact me to discuss:
- Advanced features and capabilities
- Custom pricing options
- Implementation and support

Best regards,
[Your Name]
[Your Company]
[Your Contact Information]
									`);
									window.location.href = `mailto:sales@neuronflow.com?subject=${subject}&body=${body}`;
								}}
							>
								Contact Sales
							</motion.button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default Pricing;
