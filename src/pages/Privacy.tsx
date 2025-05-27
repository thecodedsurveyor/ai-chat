import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
	Shield,
	Eye,
	Lock,
	Database,
	Calendar,
	Mail,
} from 'lucide-react';

const Privacy = () => {
	const { isDark } = useTheme();
	const lastUpdated = 'January 15, 2024';

	const sections = [
		{
			icon: <Eye className='w-6 h-6' />,
			title: 'Information We Collect',
			content: [
				'Personal Information: When you use our service, we may collect personal information such as your name, email address, and usage preferences.',
				'Usage Data: We automatically collect information about how you use our AI Chat service, including conversation topics, frequency of use, and feature preferences.',
				'Technical Data: We collect technical information including IP address, browser type, device information, and operating system for service optimization.',
				'Cookies: We use cookies and similar technologies to enhance your experience and remember your preferences.',
			],
		},
		{
			icon: <Database className='w-6 h-6' />,
			title: 'How We Use Your Information',
			content: [
				'Service Provision: To provide, maintain, and improve our AI Chat service and respond to your inquiries.',
				'Personalization: To personalize your experience and provide content and features that match your interests.',
				'Communication: To send you important updates about our service, security alerts, and support messages.',
				'Analytics: To understand how our service is used and to improve functionality and user experience.',
				'Legal Compliance: To comply with applicable laws, regulations, and legal processes.',
			],
		},
		{
			icon: <Lock className='w-6 h-6' />,
			title: 'Data Security',
			content: [
				'Encryption: All data transmission is protected using industry-standard SSL/TLS encryption.',
				'Secure Storage: Personal information is stored in secure, access-controlled environments.',
				'Regular Audits: We conduct regular security audits and assessments to ensure data protection.',
				'Access Controls: Strict access controls ensure that only authorized personnel can access your data.',
				'Incident Response: We have procedures in place to quickly respond to any security incidents.',
			],
		},
		{
			icon: <Shield className='w-6 h-6' />,
			title: 'Your Privacy Rights',
			content: [
				'Access: You have the right to access the personal information we hold about you.',
				'Correction: You can request correction of any inaccurate or incomplete personal information.',
				'Deletion: You have the right to request deletion of your personal information, subject to certain exceptions.',
				'Portability: You can request a copy of your personal information in a structured, machine-readable format.',
				'Objection: You have the right to object to certain types of processing of your personal information.',
			],
		},
		{
			title: 'Chat Data and AI Processing',
			content: [
				'Conversation Privacy: Your conversations with our AI are processed to generate responses but are not stored permanently.',
				'Temporary Processing: Chat data is temporarily processed in memory to provide real-time responses.',
				'No Long-term Storage: We do not retain conversation content beyond the active session.',
				'AI Training: Conversations are not used to train AI models without explicit user consent.',
				'Data Minimization: We only process the minimum amount of data necessary to provide our service.',
			],
		},
		{
			title: 'Third-Party Services',
			content: [
				'AI Providers: We use third-party AI services to power our chatbot. These providers have their own privacy policies.',
				'Analytics: We may use third-party analytics services to understand usage patterns and improve our service.',
				'Security Services: We work with security providers to protect against fraud and abuse.',
				'Data Processing Agreements: All third-party providers are bound by data processing agreements that protect your privacy.',
			],
		},
		{
			title: 'International Data Transfers',
			content: [
				'Global Service: Our service may process data in multiple countries to provide optimal performance.',
				'Adequate Protection: We ensure adequate protection for international data transfers through appropriate safeguards.',
				'Privacy Shield: Where applicable, we comply with international privacy frameworks and agreements.',
				'User Consent: We obtain appropriate consent for international data transfers where required by law.',
			],
		},
		{
			title: 'Data Retention',
			content: [
				'Retention Periods: We retain personal information only as long as necessary for the purposes outlined in this policy.',
				'Legal Requirements: Some data may be retained longer to comply with legal obligations.',
				'User Control: You can request deletion of your data at any time, subject to legal requirements.',
				'Automatic Deletion: Some data is automatically deleted after specified periods of inactivity.',
			],
		},
		{
			title: "Children's Privacy",
			content: [
				'Age Restrictions: Our service is not intended for children under 13 years of age.',
				'No Collection: We do not knowingly collect personal information from children under 13.',
				'Parental Notice: If we learn we have collected information from a child under 13, we will delete it immediately.',
				"Parental Controls: Parents can contact us to review, delete, or stop collection of their child's information.",
			],
		},
		{
			title: 'Changes to This Policy',
			content: [
				'Updates: We may update this privacy policy from time to time to reflect changes in our practices or legal requirements.',
				'Notification: We will notify users of significant changes through our service or via email.',
				'Continued Use: Your continued use of our service after changes indicates acceptance of the updated policy.',
				'Review: We encourage you to review this policy periodically to stay informed about our privacy practices.',
			],
		},
	];

	return (
		<div
			className={`min-h-screen pt-24 ${
				isDark
					? 'bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-primary'
					: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
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
						<div className='flex justify-center mb-6'>
							<div className='p-4 rounded-2xl bg-gradient-to-r from-chat-pink to-chat-purple'>
								<Shield className='w-12 h-12 text-white' />
							</div>
						</div>
						<h1
							className={`text-5xl md:text-7xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Privacy{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								Policy
							</span>
						</h1>
						<p
							className={`text-xl mb-8 max-w-2xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Your privacy is important to us.
							This policy explains how we
							collect, use, and protect your
							information.
						</p>
						{/* Last Updated */}{' '}
						<div
							className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
								isDark
									? 'bg-chat-secondary/30 text-chat-accent'
									: 'bg-white/70 text-gray-600 border border-gray-200'
							}`}
						>
							{' '}
							<Calendar className='w-4 h-4' />{' '}
							<span>
								{' '}
								Last updated: {
									lastUpdated
								}{' '}
							</span>{' '}
						</div>
					</motion.div>
				</div>
			</section>

			{/* Privacy Highlights */}
			<section className='py-12 px-6'>
				<div className='max-w-6xl mx-auto'>
					<motion.div
						className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-16'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<div
							className={`backdrop-blur-sm border-2 rounded-2xl p-6 text-center transition-all duration-300 ${
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-orange/40'
									: 'bg-white/70 border-chat-purple/30 hover:border-chat-pink/50'
							}`}
						>
							{' '}
							<Lock className='w-10 h-10 mx-auto text-chat-pink mb-4' />{' '}
							<h3
								className={`font-exo font-semibold mb-2 ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								{' '}
								Secure by Design{' '}
							</h3>{' '}
							<p
								className={`text-sm ${
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
							>
								{' '}
								End-to-end encryption and
								secure storage protect your
								data at every step.{' '}
							</p>{' '}
						</div>
						<div
							className={`backdrop-blur-sm border rounded-2xl p-6 text-center ${
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/20'
									: 'bg-white/70 border-gray-200'
							}`}
						>
							{' '}
							<Eye className='w-10 h-10 mx-auto text-chat-pink mb-4' />{' '}
							<h3
								className={`font-exo font-semibold mb-2 ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								{' '}
								Transparent Practices{' '}
							</h3>{' '}
							<p
								className={`text-sm ${
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
							>
								{' '}
								Clear information about what
								data we collect and how we
								use it.{' '}
							</p>{' '}
						</div>{' '}
						<div
							className={`backdrop-blur-sm border rounded-2xl p-6 text-center ${
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/20'
									: 'bg-white/70 border-gray-200'
							}`}
						>
							{' '}
							<Shield className='w-10 h-10 mx-auto text-chat-pink mb-4' />{' '}
							<h3
								className={`font-exo font-semibold mb-2 ${
									isDark
										? 'text-white'
										: 'text-gray-800'
								}`}
							>
								{' '}
								Your Control{' '}
							</h3>{' '}
							<p
								className={`text-sm ${
									isDark
										? 'text-chat-accent'
										: 'text-gray-600'
								}`}
							>
								{' '}
								Full control over your data
								with options to access,
								modify, or delete.{' '}
							</p>{' '}
						</div>
					</motion.div>
				</div>
			</section>

			{/* Privacy Content */}
			<section className='py-12 px-6'>
				<div className='max-w-4xl mx-auto'>
					{sections.map((section, index) => (
						<motion.div
							key={index}
							className={`mb-12 backdrop-blur-sm border-2 rounded-2xl p-8 transition-all duration-300 ${
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-orange/40'
									: 'bg-white/70 border-chat-purple/30 hover:border-chat-pink/50'
							}`}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: index * 0.1,
							}}
						>
							<div className='flex items-center gap-4 mb-6'>
								<div className='text-chat-pink'>
									{section.icon || (
										<span className='text-chat-pink text-xl font-bold'>
											{index + 1}.
										</span>
									)}
								</div>
								<h2
									className={`text-2xl font-exo font-bold ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									{' '}
									{section.title}{' '}
								</h2>
							</div>
							<div className='space-y-4'>
								{section.content.map(
									(paragraph, pIndex) => (
										<p
											key={pIndex}
											className={`leading-relaxed ${
												isDark
													? 'text-chat-accent'
													: 'text-gray-600'
											}`}
										>
											{paragraph}
										</p>
									)
								)}
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Contact for Privacy */}
			<section className='py-20 px-6'>
				<div className='max-w-4xl mx-auto'>
					<motion.div
						className={`backdrop-blur-sm border rounded-2xl p-8 text-center ${
							isDark
								? 'bg-chat-secondary/30 border-chat-accent/20'
								: 'bg-white/70 border-gray-200'
						}`}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<Mail className='w-12 h-12 mx-auto text-chat-pink mb-6' />
						<h3
							className={`text-3xl font-exo font-bold mb-4 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							{' '}
							Questions About Privacy?{' '}
						</h3>{' '}
						<p
							className={`mb-6 leading-relaxed ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							If you have any questions about
							this Privacy Policy or how we
							handle your data, please don't
							hesitate to reach out to our
							privacy team.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<motion.a
								href='/contact'
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-3 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-chat-pink/25 transition-all duration-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Contact Privacy Team
							</motion.a>
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
						{/* GDPR Notice */}{' '}
						<div
							className={`mt-8 p-4 rounded-xl ${
								isDark
									? 'bg-chat-primary/50'
									: 'bg-blue-50'
							}`}
						>
							{' '}
							<p
								className={`text-sm ${
									isDark
										? 'text-chat-accent'
										: 'text-gray-700'
								}`}
							>
								<strong>
									EU Residents:
								</strong>{' '}
								Under GDPR, you have
								additional rights including
								data portability and the
								right to be forgotten.
								Contact us to exercise these
								rights.
							</p>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default Privacy;
