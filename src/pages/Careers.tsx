import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTitle } from '../hooks/usePageTitle';
import {
	MapPin,
	Clock,
	Users,
	Heart,
	Coffee,
	Laptop,
	TrendingUp,
	ArrowRight,
} from 'lucide-react';

const Careers = () => {
	const { isDark } = useTheme();
	usePageTitle('Careers – NeuronFlow');

	const jobs = [
		{
			id: 1,
			title: 'Senior AI Engineer',
			department: 'Engineering',
			location: 'San Francisco, CA',
			type: 'Full-time',
			experience: '5+ years',
			description:
				'Lead the development of cutting-edge AI models and conversation systems.',
			requirements: [
				'Python/JavaScript expertise',
				'ML/AI experience',
				'Cloud platforms',
			],
		},
		{
			id: 2,
			title: 'Product Designer',
			department: 'Design',
			location: 'Remote',
			type: 'Full-time',
			experience: '3+ years',
			description:
				'Design intuitive user experiences for our NeuronFlow platform.',
			requirements: [
				'UI/UX design',
				'Figma/Sketch',
				'User research',
			],
		},
		{
			id: 3,
			title: 'DevOps Engineer',
			department: 'Infrastructure',
			location: 'New York, NY',
			type: 'Full-time',
			experience: '4+ years',
			description:
				'Scale our infrastructure to support millions of AI conversations.',
			requirements: [
				'AWS/GCP',
				'Kubernetes',
				'CI/CD pipelines',
			],
		},
	];

	const benefits = [
		{
			icon: <Heart className='w-6 h-6' />,
			title: 'Health & Wellness',
			description:
				'Comprehensive health insurance and wellness programs',
		},
		{
			icon: <Coffee className='w-6 h-6' />,
			title: 'Flexible Work',
			description:
				'Remote-first culture with flexible hours',
		},
		{
			icon: <Laptop className='w-6 h-6' />,
			title: 'Latest Tech',
			description:
				'Top-tier equipment and tools for maximum productivity',
		},
		{
			icon: <TrendingUp className='w-6 h-6' />,
			title: 'Growth',
			description:
				'Learning budget and career development opportunities',
		},
	];

	const values = [
		{
			title: 'Innovation First',
			description:
				"We push the boundaries of what's possible with AI",
		},
		{
			title: 'User-Centric',
			description:
				"Every decision starts with our users' needs",
		},
		{
			title: 'Transparency',
			description:
				'Open communication and honest feedback',
		},
		{
			title: 'Diversity',
			description:
				'Building an inclusive team from all backgrounds',
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
							Join Our{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								Team
							</span>
						</h1>
						<p
							className={`text-xl mb-8 max-w-3xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							Help us build the future of AI
							conversations. Join a team of
							passionate innovators working on
							cutting-edge technology.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Values Section */}
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
							Our Values
						</h2>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{values.map((value, index) => (
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
								<h3
									className={`text-lg font-semibold mb-3 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									{value.title}
								</h3>
								<p
									className={`text-sm ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									{value.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
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
							Benefits & Perks
						</h2>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{benefits.map((benefit, index) => (
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
									{benefit.icon}
								</div>
								<h3
									className={`text-lg font-semibold mb-3 ${
										isDark
											? 'text-white'
											: 'text-gray-800'
									}`}
								>
									{benefit.title}
								</h3>
								<p
									className={`text-sm ${
										isDark
											? 'text-chat-accent'
											: 'text-gray-600'
									}`}
								>
									{benefit.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Open Positions */}
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
							Open Positions
						</h2>
					</motion.div>

					<div className='space-y-6'>
						{jobs.map((job, index) => (
							<motion.div
								key={job.id}
								className={`p-8 rounded-xl ${
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
								whileHover={{ scale: 1.01 }}
							>
								<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
									<div className='flex-1'>
										<div className='flex items-center gap-4 mb-4'>
											<h3
												className={`text-2xl font-exo font-bold ${
													isDark
														? 'text-white'
														: 'text-gray-800'
												}`}
											>
												{job.title}
											</h3>
											<span className='px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-chat-pink to-chat-purple text-white'>
												{
													job.department
												}
											</span>
										</div>

										<div className='flex items-center gap-6 mb-4 text-sm'>
											<div className='flex items-center gap-2'>
												<MapPin className='w-4 h-4' />
												<span
													className={
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}
												>
													{
														job.location
													}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												<Clock className='w-4 h-4' />
												<span
													className={
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}
												>
													{
														job.type
													}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												<Users className='w-4 h-4' />
												<span
													className={
														isDark
															? 'text-chat-accent'
															: 'text-gray-600'
													}
												>
													{
														job.experience
													}
												</span>
											</div>
										</div>

										<p
											className={`mb-4 ${
												isDark
													? 'text-chat-accent'
													: 'text-gray-600'
											}`}
										>
											{
												job.description
											}
										</p>

										<div className='flex flex-wrap gap-2'>
											{job.requirements.map(
												(
													req,
													reqIndex
												) => (
													<span
														key={
															reqIndex
														}
														className={`px-3 py-1 rounded-lg text-sm ${
															isDark
																? 'bg-chat-accent/20 text-chat-accent'
																: 'bg-gray-100 text-gray-700'
														}`}
													>
														{
															req
														}
													</span>
												)
											)}
										</div>
									</div>

									<motion.button
										className='flex items-center gap-2 bg-gradient-to-r from-chat-pink to-chat-purple px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300'
										whileHover={{
											scale: 1.05,
										}}
										whileTap={{
											scale: 0.95,
										}}
										onClick={() => {
											const subject =
												encodeURIComponent(
													`Application for ${job.title} Position`
												);
											const body =
												encodeURIComponent(`
Dear NeuronFlow Hiring Team,

I am interested in applying for the ${job.title} position in the ${job.department} department.

Position Details:
- Title: ${job.title}
- Department: ${job.department} 
- Location: ${job.location}
- Type: ${job.type}

Please find my resume attached. I look forward to hearing from you.

Best regards,
[Your Name]
											`);
											window.location.href = `mailto:careers@neuronflow.com?subject=${subject}&body=${body}`;
										}}
									>
										Apply Now
										<ArrowRight className='w-4 h-4' />
									</motion.button>
								</div>
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
							Don't See Your Role?
						</h2>
						<p
							className={`text-lg mb-8 ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							We're always looking for
							talented individuals. Send us
							your resume and let's talk!
						</p>
						<motion.button
							className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-4 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => {
								const subject =
									encodeURIComponent(
										'General Application - Resume Submission'
									);
								const body =
									encodeURIComponent(`
Dear NeuronFlow Hiring Team,

I am interested in joining your team at NeuronFlow. While I don't see a specific role that matches my background, I believe my skills and passion for AI technology would be valuable to your organization.

Please find my resume attached. I would welcome the opportunity to discuss how I can contribute to your mission of building the future of AI conversations.

Best regards,
[Your Name]
								`);
								window.location.href = `mailto:careers@neuronflow.com?subject=${subject}&body=${body}`;
							}}
						>
							Send Resume
						</motion.button>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default Careers;
