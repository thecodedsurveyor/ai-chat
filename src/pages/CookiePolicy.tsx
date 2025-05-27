import React from 'react';
import { motion } from 'framer-motion';
import {
	Cookie,
	Shield,
	Settings,
	Eye,
	BarChart3,
	Calendar,
	AlertCircle,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const CookiePolicy = () => {
	const { isDark } = useTheme();
	const lastUpdated = 'January 15, 2024';

	const cookieTypes = [
		{
			icon: <Shield className='w-6 h-6' />,
			title: 'Essential Cookies',
			description:
				'Required for basic website functionality and security',
			examples: [
				'Authentication tokens',
				'Security preferences',
				'Session management',
			],
			retention: 'Session or up to 1 year',
			canDisable: false,
		},
		{
			icon: <BarChart3 className='w-6 h-6' />,
			title: 'Analytics Cookies',
			description:
				'Help us understand how visitors interact with our website',
			examples: [
				'Google Analytics',
				'Usage statistics',
				'Performance metrics',
			],
			retention: 'Up to 2 years',
			canDisable: true,
		},
		{
			icon: <Settings className='w-6 h-6' />,
			title: 'Functional Cookies',
			description:
				'Enable enhanced functionality and personalization',
			examples: [
				'Language preferences',
				'Theme settings',
				'Chat history',
			],
			retention: 'Up to 1 year',
			canDisable: true,
		},
		{
			icon: <Eye className='w-6 h-6' />,
			title: 'Marketing Cookies',
			description:
				'Used to track visitors and display relevant advertisements',
			examples: [
				'Ad targeting',
				'Social media integration',
				'Conversion tracking',
			],
			retention: 'Up to 2 years',
			canDisable: true,
		},
	];

	const thirdPartyCookies = [
		{
			provider: 'Google Analytics',
			purpose:
				'Website analytics and performance monitoring',
			cookies: ['_ga', '_gid', '_gat'],
			privacy: 'https://policies.google.com/privacy',
		},
		{
			provider: 'Stripe',
			purpose:
				'Payment processing and fraud prevention',
			cookies: ['__stripe_mid', '__stripe_sid'],
			privacy: 'https://stripe.com/privacy',
		},
		{
			provider: 'Intercom',
			purpose: 'Customer support and communication',
			cookies: ['intercom-*'],
			privacy:
				'https://www.intercom.com/legal/privacy',
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
								<Cookie className='w-8 h-8 text-white' />
							</div>
							<h1
								className={`text-4xl md:text-5xl font-exo font-bold ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								Cookie Policy
							</h1>
						</div>
						<p
							className={`text-xl max-w-3xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Learn how we use cookies to
							improve your experience and
							protect your privacy.
						</p>
						<div
							className={`flex items-center justify-center gap-2 mt-4 text-sm ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-500'
							}`}
						>
							<Calendar className='w-4 h-4' />
							<span>
								Last updated: {lastUpdated}
							</span>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Main Content */}
			<section className='py-16'>
				<div className='max-w-4xl mx-auto px-6 space-y-12'>
					{/* Introduction */}
					<motion.div
						className={`p-8 rounded-xl ${
							isDark
								? 'bg-chat-secondary/30'
								: 'bg-white shadow-lg'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2
							className={`text-2xl font-exo font-bold mb-4 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							What Are Cookies?
						</h2>
						<p
							className={`mb-4 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Cookies are small text files
							that are stored on your device
							when you visit our website. They
							help us provide you with a
							better experience by remembering
							your preferences and
							understanding how you use our
							service.
						</p>
						<p
							className={`${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							We use cookies for various
							purposes, including essential
							site functionality, analytics,
							personalization, and marketing.
							You have control over most
							cookies and can manage your
							preferences at any time.
						</p>
					</motion.div>

					{/* Cookie Types */}
					<div>
						<motion.h2
							className={`text-3xl font-exo font-bold mb-8 text-center ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: 0.1,
							}}
						>
							Types of Cookies We Use
						</motion.h2>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{cookieTypes.map(
								(type, index) => (
									<motion.div
										key={index}
										className={`p-6 rounded-xl border ${
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
												0.1 +
												index * 0.1,
										}}
									>
										<div className='flex items-center gap-3 mb-4'>
											<div className='p-2 rounded-lg bg-gradient-to-r from-chat-pink to-chat-purple'>
												{type.icon}
											</div>
											<h3
												className={`font-semibold ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{type.title}
											</h3>
										</div>
										<p
											className={`text-sm mb-4 ${
												isDark
													? 'text-chat-accent'
													: 'text-gray-600'
											}`}
										>
											{
												type.description
											}
										</p>
										<div className='space-y-3'>
											<div>
												<h4
													className={`text-sm font-medium mb-2 ${
														isDark
															? 'text-white'
															: 'text-gray-800'
													}`}
												>
													Examples:
												</h4>
												<ul
													className={`text-xs space-y-1 ${
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}`}
												>
													{type.examples.map(
														(
															example,
															i
														) => (
															<li
																key={
																	i
																}
															>
																•{' '}
																{
																	example
																}
															</li>
														)
													)}
												</ul>
											</div>
											<div className='flex items-center justify-between text-xs'>
												<span
													className={
														isDark
															? 'text-chat-accent'
															: 'text-gray-500'
													}
												>
													Retention:{' '}
													{
														type.retention
													}
												</span>
												<span
													className={`px-2 py-1 rounded ${
														type.canDisable
															? 'bg-green-100 text-green-800'
															: 'bg-red-100 text-red-800'
													}`}
												>
													{type.canDisable
														? 'Optional'
														: 'Required'}
												</span>
											</div>
										</div>
									</motion.div>
								)
							)}
						</div>
					</div>

					{/* Third-Party Cookies */}
					<motion.div
						className={`p-8 rounded-xl ${
							isDark
								? 'bg-chat-secondary/30'
								: 'bg-white shadow-lg'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.5,
						}}
					>
						<h2
							className={`text-2xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Third-Party Cookies
						</h2>
						<p
							className={`mb-6 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							We work with trusted third-party
							services that may set their own
							cookies. Here are the main
							third-party cookies you might
							encounter:
						</p>
						<div className='space-y-4'>
							{thirdPartyCookies.map(
								(provider, index) => (
									<div
										key={index}
										className={`p-4 rounded-lg border ${
											isDark
												? 'border-chat-accent/20'
												: 'border-gray-200'
										}`}
									>
										<div className='flex items-center justify-between mb-2'>
											<h3
												className={`font-semibold ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{
													provider.provider
												}
											</h3>
											<a
												href={
													provider.privacy
												}
												target='_blank'
												rel='noopener noreferrer'
												className='text-chat-pink hover:text-chat-purple text-sm'
											>
												Privacy
												Policy
											</a>
										</div>
										<p
											className={`text-sm mb-2 ${
												isDark
													? 'text-chat-accent'
													: 'text-gray-600'
											}`}
										>
											{
												provider.purpose
											}
										</p>
										<div className='flex flex-wrap gap-2'>
											{provider.cookies.map(
												(
													cookie,
													i
												) => (
													<code
														key={
															i
														}
														className={`px-2 py-1 rounded text-xs ${
															isDark
																? 'bg-chat-primary text-chat-accent'
																: 'bg-gray-100 text-gray-700'
														}`}
													>
														{
															cookie
														}
													</code>
												)
											)}
										</div>
									</div>
								)
							)}
						</div>
					</motion.div>

					{/* Cookie Management */}
					<motion.div
						className={`p-8 rounded-xl ${
							isDark
								? 'bg-chat-secondary/30'
								: 'bg-white shadow-lg'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.6,
						}}
					>
						<h2
							className={`text-2xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Managing Your Cookie Preferences
						</h2>
						<div className='space-y-6'>
							<div>
								<h3
									className={`font-semibold mb-3 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Browser Settings
								</h3>
								<p
									className={`mb-4 ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									You can control cookies
									through your browser
									settings. Most browsers
									allow you to:
								</p>
								<ul
									className={`space-y-2 text-sm ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									<li>
										• View and delete
										existing cookies
									</li>
									<li>
										• Block cookies from
										specific websites
									</li>
									<li>
										• Block third-party
										cookies
									</li>
									<li>
										• Clear all cookies
										when you close your
										browser
									</li>
									<li>
										• Set up
										notifications when
										cookies are being
										set
									</li>
								</ul>
							</div>

							<div>
								<h3
									className={`font-semibold mb-3 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Our Cookie Preferences
								</h3>
								<p
									className={`mb-4 ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									You can also manage your
									cookie preferences
									directly on our website:
								</p>
								<motion.button
									className='bg-gradient-to-r from-chat-pink to-chat-purple px-6 py-3 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300'
									whileHover={{
										scale: 1.05,
									}}
									whileTap={{
										scale: 0.95,
									}}
								>
									Manage Cookie
									Preferences
								</motion.button>
							</div>
						</div>
					</motion.div>

					{/* Important Notice */}
					<motion.div
						className={`p-6 rounded-xl border-l-4 border-yellow-500 ${
							isDark
								? 'bg-yellow-900/20'
								: 'bg-yellow-50'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.7,
						}}
					>
						<div className='flex items-center gap-2 mb-2'>
							<AlertCircle className='w-5 h-5 text-yellow-500' />
							<h3
								className={`font-semibold ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								Important Notice
							</h3>
						</div>
						<p
							className={`text-sm ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Disabling certain cookies may
							affect the functionality of our
							website. Essential cookies
							cannot be disabled as they are
							necessary for basic website
							operation and security.
						</p>
					</motion.div>

					{/* Contact Information */}
					<motion.div
						className={`text-center p-8 rounded-xl ${
							isDark
								? 'bg-chat-secondary/30'
								: 'bg-white shadow-lg'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.8,
						}}
					>
						<h2
							className={`text-2xl font-exo font-bold mb-4 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Questions About Cookies?
						</h2>
						<p
							className={`mb-6 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							If you have any questions about
							our use of cookies, please
							contact us.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<motion.button
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-3 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-chat-pink/25 transition-all duration-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Contact Support
							</motion.button>
							<motion.a
								href='mailto:privacy@aichat.com'
								className={`px-8 py-3 rounded-xl font-exo font-semibold border-2 transition-all duration-300 ${
									isDark
										? 'text-chat-accent border-chat-accent hover:bg-chat-accent hover:text-chat-primary'
										: 'text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Email Privacy Team
							</motion.a>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default CookiePolicy;
