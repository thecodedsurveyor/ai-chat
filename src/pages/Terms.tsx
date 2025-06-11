import React from 'react';
import { motion } from 'framer-motion';
import {
	FileText,
	Calendar,
	Shield,
	AlertCircle,
	Users,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTitle } from '../hooks/usePageTitle';

const Terms = () => {
	const { isDark } = useTheme();
	usePageTitle('Terms of Service – NeuronFlow');
	const lastUpdated = 'January 15, 2024';

	const sections = [
		{
			icon: <FileText className='w-6 h-6' />,
			title: 'Acceptance of Terms',
			content: [
				'By accessing and using our NeuronFlow service, you accept and agree to be bound by the terms and provision of this agreement.',
				'If you do not agree to abide by the above, please do not use this service.',
				'We reserve the right to change these terms at any time by posting changes online.',
			],
		},
		{
			icon: <Users className='w-6 h-6' />,
			title: 'Use License',
			content: [
				'Permission is granted to temporarily use our NeuronFlow service for personal, non-commercial transitory viewing only.',
				'This is the grant of a license, not a transfer of title, and under this license you may not:',
				'• Modify or copy the materials',
				'• Use the materials for any commercial purpose or for any public display',
				'• Attempt to reverse engineer any software contained in our service',
				'• Remove any copyright or other proprietary notations from the materials',
			],
		},
		{
			icon: <Shield className='w-6 h-6' />,
			title: 'Privacy and Data',
			content: [
				'We are committed to protecting your privacy and the security of your personal information.',
				'Conversations are processed to provide AI responses but are not stored permanently.',
				'We use industry-standard encryption to protect data transmission.',
				'For detailed information about our data practices, please review our Privacy Policy.',
			],
		},
		{
			icon: <AlertCircle className='w-6 h-6' />,
			title: 'Disclaimer',
			content: [
				'The materials on NeuronFlow are provided on an "as is" basis. NeuronFlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability.',
			],
		},
		{
			title: 'Service Availability',
			content: [
				'We strive to maintain service availability but cannot guarantee uninterrupted access.',
				'Maintenance, updates, or technical issues may temporarily affect service availability.',
				'We reserve the right to modify or discontinue the service at any time.',
				'We are not liable for any service interruptions or data loss.',
			],
		},
		{
			title: 'AI Content Disclaimer',
			content: [
				'AI-generated responses are provided for informational purposes only.',
				'We do not guarantee the accuracy, completeness, or reliability of AI responses.',
				'Users should not rely solely on AI responses for important decisions.',
				'The AI service is not a substitute for professional advice in any field.',
			],
		},
		{
			title: 'Intellectual Property',
			content: [
				'All content, features, and functionality of our service are owned by us or our licensors.',
				'Our trademarks, service marks, and logos used in this service are our property.',
				'You may not use our intellectual property without our prior written consent.',
				'User-generated content remains the property of the user, but you grant us a license to use it for service improvement.',
			],
		},
		{
			title: 'Limitation of Liability',
			content: [
				'In no event shall our company be liable for any indirect, incidental, special, consequential, or punitive damages.',
				'Our total liability shall not exceed the amount paid by you for the service in the past 12 months.',
				'Some jurisdictions do not allow the exclusion of certain warranties or damages, so some of the above may not apply to you.',
			],
		},
		{
			title: 'Termination',
			content: [
				'We may terminate or suspend your access immediately, without prior notice, for any reason.',
				'You may terminate your use of the service at any time by discontinuing use.',
				'Upon termination, your right to use the service will cease immediately.',
				'Provisions that by their nature should survive termination shall survive.',
			],
		},
		{
			title: 'Governing Law',
			content: [
				'These terms shall be governed by and construed in accordance with the laws of California.',
				'Any legal disputes shall be resolved in the courts of San Francisco County, California.',
				'If any provision of these terms is found to be unenforceable, the remainder shall remain in effect.',
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
								<FileText className='w-12 h-12 text-white' />
							</div>
						</div>
						<h1
							className={`text-5xl md:text-7xl font-exo font-bold mb-6 ${
								isDark
									? 'text-white'
									: 'text-gray-800'
							}`}
						>
							Terms of{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								Service
							</span>
						</h1>
						<p
							className={`text-xl mb-8 max-w-2xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							Please read these terms of
							service carefully before using
							our NeuronFlow platform.
						</p>

						{/* Last Updated */}
						<div
							className={`flex items-center justify-center gap-3 text-sm ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
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

			{/* Important Notice */}
			<section className='py-8 px-6'>
				<div className='max-w-4xl mx-auto'>
					<motion.div
						className={`bg-chat-orange/10 border-2 border-chat-orange/30 rounded-2xl p-6 transition-all duration-300 ${
							isDark
								? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-orange/40'
								: 'bg-white/70 border-chat-purple/30 hover:border-chat-pink/50'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className='flex items-start gap-4'>
							<AlertCircle className='w-6 h-6 text-chat-orange flex-shrink-0 mt-1' />
							<div>
								<h3
									className={`font-exo font-semibold text-white mb-2 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Important Notice
								</h3>
								<p
									className={`text-chat-accent leading-relaxed ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									By using our NeuronFlow
									service, you acknowledge
									that you have read,
									understood, and agree to
									be bound by these Terms
									of Service. If you do
									not agree with any part
									of these terms, you may
									not use our service.
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Terms Content */}
			<section className='py-12 px-6'>
				<div className='max-w-4xl mx-auto'>
					<div className='space-y-8'>
						{sections.map((section, index) => (
							<motion.div
								key={index}
								className={`backdrop-blur-sm border-2 rounded-2xl p-8 transition-all duration-300 ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-orange/40'
										: 'bg-white/70 border-chat-purple/30 hover:border-chat-pink/50'
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
									duration: 0.5,
									delay: index * 0.1,
								}}
							>
								<div className='flex items-center gap-4 mb-6'>
									<div className='text-chat-pink'>
										{section.icon}
									</div>
									<h2
										className={`text-2xl font-exo font-bold ${
											isDark
												? 'text-white'
												: 'text-gray-800'
										}`}
									>
										{section.title}
									</h2>
								</div>
								<div className='space-y-4'>
									{section.content.map(
										(
											paragraph,
											pIndex
										) => (
											<p
												key={pIndex}
												className={`text-lg leading-relaxed ${
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

					{/* Additional Terms */}
					<motion.div
						className={`mt-12 backdrop-blur-sm border rounded-2xl p-8 ${
							isDark
								? 'bg-chat-secondary/30 border-chat-accent/20'
								: 'bg-white/70 border-gray-200'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
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
							Additional Terms
						</h2>
						<div className='space-y-6'>
							<div>
								<h3
									className={`text-xl font-semibold mb-3 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Service Modifications
								</h3>
								<p
									className={`leading-relaxed ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									NeuronFlow reserves the
									right to modify or
									discontinue the service
									at any time without
									notice. We shall not be
									liable to you or any
									third party for any
									modification,
									suspension, or
									discontinuance of the
									service.
								</p>
							</div>
							<div>
								<h3
									className={`text-xl font-semibold mb-3 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									User Conduct
								</h3>
								<p
									className={`leading-relaxed ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									You agree not to use the
									service for any unlawful
									purpose or in any way
									that could damage,
									disable, overburden, or
									impair our servers or
									networks. Harassment,
									abuse, or harmful
									content is strictly
									prohibited.
								</p>
							</div>
							<div>
								<h3
									className={`text-xl font-semibold mb-3 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									Limitation of Liability
								</h3>
								<p
									className={`leading-relaxed ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									In no event shall
									NeuronFlow be liable for
									any indirect,
									incidental, special,
									consequential, or
									punitive damages,
									including without
									limitation, loss of
									profits, data, use,
									goodwill, or other
									intangible losses.
								</p>
							</div>
						</div>
					</motion.div>

					{/* Contact Section */}
					<motion.div
						className={`mt-12 text-center backdrop-blur-sm border rounded-2xl p-8 ${
							isDark
								? 'bg-chat-secondary/30 border-chat-accent/20'
								: 'bg-white/70 border-gray-200'
						}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
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
							Questions About These Terms?
						</h2>
						<p
							className={`mb-6 ${
								isDark
									? 'text-chat-accent'
									: 'text-gray-600'
							}`}
						>
							If you have any questions about
							these Terms of Service, please
							contact us.
						</p>
						<motion.button
							className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-3 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-chat-pink/25 transition-all duration-300'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Contact Support
						</motion.button>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default Terms;
