import React from 'react';
import { motion } from 'framer-motion';
import {
	Shield,
	Eye,
	Download,
	Trash2,
	Edit,
	FileText,
	Calendar,
	AlertCircle,
	CheckCircle,
	Mail,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const GDPR = () => {
	const { isDark } = useTheme();
	const lastUpdated = 'January 15, 2024';

	const dataRights = [
		{
			icon: <Eye className='w-6 h-6' />,
			title: 'Right to Access',
			description:
				'Request a copy of all personal data we hold about you',
			action: 'Request Data Export',
			color: 'from-blue-500 to-blue-600',
		},
		{
			icon: <Edit className='w-6 h-6' />,
			title: 'Right to Rectification',
			description:
				'Correct any inaccurate or incomplete personal data',
			action: 'Update Information',
			color: 'from-green-500 to-green-600',
		},
		{
			icon: <Trash2 className='w-6 h-6' />,
			title: 'Right to Erasure',
			description:
				'Request deletion of your personal data ("Right to be Forgotten")',
			action: 'Delete Account',
			color: 'from-red-500 to-red-600',
		},
		{
			icon: <Download className='w-6 h-6' />,
			title: 'Right to Portability',
			description:
				'Receive your data in a structured, machine-readable format',
			action: 'Download Data',
			color: 'from-purple-500 to-purple-600',
		},
		{
			icon: <Shield className='w-6 h-6' />,
			title: 'Right to Restrict Processing',
			description:
				'Limit how we process your personal data',
			action: 'Restrict Processing',
			color: 'from-orange-500 to-orange-600',
		},
		{
			icon: <FileText className='w-6 h-6' />,
			title: 'Right to Object',
			description:
				'Object to processing based on legitimate interests or direct marketing',
			action: 'Object to Processing',
			color: 'from-indigo-500 to-indigo-600',
		},
	];

	const dataProcessing = [
		{
			category: 'Account Information',
			data: [
				'Name',
				'Email address',
				'Password (encrypted)',
				'Profile preferences',
			],
			purpose:
				'Account management and authentication',
			legalBasis: 'Contract performance',
			retention: 'Until account deletion',
		},
		{
			category: 'Conversation Data',
			data: [
				'Chat messages',
				'AI responses',
				'Conversation metadata',
				'Usage patterns',
			],
			purpose: 'Service provision and improvement',
			legalBasis: 'Contract performance',
			retention: '30 days (unless saved by user)',
		},
		{
			category: 'Analytics Data',
			data: [
				'Usage statistics',
				'Feature interactions',
				'Performance metrics',
			],
			purpose: 'Service optimization and analytics',
			legalBasis: 'Legitimate interest',
			retention: '2 years',
		},
		{
			category: 'Marketing Data',
			data: [
				'Email preferences',
				'Communication history',
				'Engagement metrics',
			],
			purpose: 'Marketing communications',
			legalBasis: 'Consent',
			retention: 'Until consent withdrawn',
		},
	];

	const safeguards = [
		{
			title: 'Data Encryption',
			description:
				'All data is encrypted in transit and at rest using industry-standard encryption',
			icon: <Shield className='w-5 h-5' />,
		},
		{
			title: 'Access Controls',
			description:
				'Strict access controls ensure only authorized personnel can access personal data',
			icon: <Eye className='w-5 h-5' />,
		},
		{
			title: 'Regular Audits',
			description:
				'Regular security audits and compliance assessments',
			icon: <CheckCircle className='w-5 h-5' />,
		},
		{
			title: 'Data Minimization',
			description:
				'We only collect and process data necessary for our services',
			icon: <FileText className='w-5 h-5' />,
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
								<Shield className='w-8 h-8 text-white' />
							</div>
							<h1
								className={`text-4xl md:text-5xl font-exo font-bold ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								GDPR Compliance
							</h1>
						</div>
						<p
							className={`text-xl max-w-3xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Your data protection rights
							under the General Data
							Protection Regulation (GDPR).
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
				<div className='max-w-7xl mx-auto px-6 space-y-16'>
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
							Your Rights Under GDPR
						</h2>
						<p
							className={`mb-4 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							The General Data Protection
							Regulation (GDPR) gives you
							specific rights regarding your
							personal data. As a data
							controller, we are committed to
							respecting these rights and
							making it easy for you to
							exercise them.
						</p>
						<p
							className={`${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Below you'll find detailed
							information about your rights,
							how we process your data, and
							the safeguards we have in place
							to protect your privacy.
						</p>
					</motion.div>

					{/* Data Rights */}
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
							Your Data Rights
						</motion.h2>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{dataRights.map(
								(right, index) => (
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
										whileHover={{
											scale: 1.02,
										}}
									>
										<div className='flex items-center gap-3 mb-4'>
											<div
												className={`p-2 rounded-lg bg-gradient-to-r ${right.color}`}
											>
												{right.icon}
											</div>
											<h3
												className={`font-semibold ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{
													right.title
												}
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
												right.description
											}
										</p>
										<motion.button
											className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 bg-gradient-to-r ${right.color} text-white hover:shadow-lg`}
											whileHover={{
												scale: 1.05,
											}}
											whileTap={{
												scale: 0.95,
											}}
										>
											{right.action}
										</motion.button>
									</motion.div>
								)
							)}
						</div>
					</div>

					{/* Data Processing */}
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
								delay: 0.3,
							}}
						>
							How We Process Your Data
						</motion.h2>
						<div className='space-y-6'>
							{dataProcessing.map(
								(category, index) => (
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
												0.3 +
												index * 0.1,
										}}
									>
										<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
											<div>
												<h3
													className={`font-semibold mb-2 ${
														isDark
															? 'text-white'
															: 'text-gray-800'
													}`}
												>
													{
														category.category
													}
												</h3>
												<ul
													className={`text-sm space-y-1 ${
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}`}
												>
													{category.data.map(
														(
															item,
															i
														) => (
															<li
																key={
																	i
																}
															>
																•{' '}
																{
																	item
																}
															</li>
														)
													)}
												</ul>
											</div>
											<div>
												<h4
													className={`font-medium mb-2 text-sm ${
														isDark
															? 'text-white'
															: 'text-gray-800'
													}`}
												>
													Purpose
												</h4>
												<p
													className={`text-sm ${
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}`}
												>
													{
														category.purpose
													}
												</p>
											</div>
											<div>
												<h4
													className={`font-medium mb-2 text-sm ${
														isDark
															? 'text-white'
															: 'text-gray-800'
													}`}
												>
													Legal
													Basis
												</h4>
												<span
													className={`inline-block px-2 py-1 rounded text-xs ${
														category.legalBasis ===
														'Consent'
															? 'bg-green-100 text-green-800'
															: category.legalBasis ===
															  'Contract performance'
															? 'bg-blue-100 text-blue-800'
															: 'bg-orange-100 text-orange-800'
													}`}
												>
													{
														category.legalBasis
													}
												</span>
											</div>
											<div>
												<h4
													className={`font-medium mb-2 text-sm ${
														isDark
															? 'text-white'
															: 'text-gray-800'
													}`}
												>
													Retention
												</h4>
												<p
													className={`text-sm ${
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}`}
												>
													{
														category.retention
													}
												</p>
											</div>
										</div>
									</motion.div>
								)
							)}
						</div>
					</div>

					{/* Data Safeguards */}
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
							className={`text-2xl font-exo font-bold mb-6 text-center ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Data Protection Safeguards
						</h2>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{safeguards.map(
								(safeguard, index) => (
									<div
										key={index}
										className={`p-4 rounded-lg border ${
											isDark
												? 'border-chat-accent/20'
												: 'border-gray-200'
										}`}
									>
										<div className='flex items-center gap-3 mb-2'>
											<div className='text-chat-pink'>
												{
													safeguard.icon
												}
											</div>
											<h3
												className={`font-semibold ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{
													safeguard.title
												}
											</h3>
										</div>
										<p
											className={`text-sm ${
												isDark
													? 'text-chat-accent'
													: 'text-gray-600'
											}`}
										>
											{
												safeguard.description
											}
										</p>
									</div>
								)
							)}
						</div>
					</motion.div>

					{/* Data Transfers */}
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
							International Data Transfers
						</h2>
						<div className='space-y-4'>
							<p
								className={`${
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
							>
								We may transfer your
								personal data to countries
								outside the European
								Economic Area (EEA). When we
								do so, we ensure appropriate
								safeguards are in place:
							</p>
							<ul
								className={`space-y-2 text-sm ${
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
							>
								<li>
									•{' '}
									<strong>
										Adequacy Decisions:
									</strong>{' '}
									Transfers to countries
									with adequate data
									protection laws
								</li>
								<li>
									•{' '}
									<strong>
										Standard Contractual
										Clauses:
									</strong>{' '}
									EU-approved contracts
									ensuring data protection
								</li>
								<li>
									•{' '}
									<strong>
										Binding Corporate
										Rules:
									</strong>{' '}
									Internal rules for
									multinational companies
								</li>
								<li>
									•{' '}
									<strong>
										Certification
										Schemes:
									</strong>{' '}
									Industry-recognized data
									protection
									certifications
								</li>
							</ul>
						</div>
					</motion.div>

					{/* Breach Notification */}
					<motion.div
						className={`p-6 rounded-xl border-l-4 border-red-500 ${
							isDark
								? 'bg-red-900/20'
								: 'bg-red-50'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.7,
						}}
					>
						<div className='flex items-center gap-2 mb-2'>
							<AlertCircle className='w-5 h-5 text-red-500' />
							<h3
								className={`font-semibold ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								Data Breach Notification
							</h3>
						</div>
						<p
							className={`text-sm ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							In the unlikely event of a data
							breach that poses a high risk to
							your rights and freedoms, we
							will notify you within 72 hours
							of becoming aware of the breach,
							as required by GDPR Article 34.
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
							Exercise Your Rights
						</h2>
						<p
							className={`mb-6 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							To exercise any of your GDPR
							rights or if you have questions
							about our data processing,
							please contact our Data
							Protection Officer.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<motion.button
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-3 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-chat-pink/25 transition-all duration-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Contact DPO
							</motion.button>
							<motion.a
								href='mailto:dpo@neuronflow.com'
								className={`flex items-center gap-2 px-8 py-3 rounded-xl font-exo font-semibold border-2 transition-all duration-300 ${
									isDark
										? 'text-chat-accent border-chat-accent hover:bg-chat-accent hover:text-chat-primary'
										: 'text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Mail className='w-4 h-4' />
								dpo@neuronflow.com
							</motion.a>
						</div>
						<div
							className={`mt-6 text-sm ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-500'
							}`}
						>
							<p>
								We will respond to your
								request within 30 days as
								required by GDPR.
							</p>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default GDPR;
