import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
	Mail,
	Phone,
	MapPin,
	Send,
	MessageCircle,
	Clock,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Contact = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});

	const { isDark } = useTheme();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission here
		// Form submitted - handle form data here
		alert(
			"Thank you for your message! We'll get back to you soon."
		);
		setFormData({
			name: '',
			email: '',
			subject: '',
			message: '',
		});
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement
		>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const contactInfo = [
		{
			icon: <Mail className='w-6 h-6' />,
			title: 'Email Us',
			content: 'hello@aichat.com',
			description: 'Send us an email anytime!',
		},
		{
			icon: <Phone className='w-6 h-6' />,
			title: 'Call Us',
			content: '+1 (555) 123-4567',
			description: 'Mon-Fri from 8am to 6pm.',
		},
		{
			icon: <MapPin className='w-6 h-6' />,
			title: 'Visit Us',
			content:
				'123 AI Street, San Francisco, CA 94105',
			description: 'Come and visit our office HQ.',
		},
		{
			icon: <MessageCircle className='w-6 h-6' />,
			title: 'Live Chat',
			content: 'Chat with our AI',
			description: 'Available 24/7 for instant help.',
		},
	];

	const faqs = [
		{
			question: 'How does the AI chatbot work?',
			answer: 'Our AI chatbot uses advanced natural language processing to understand and respond to your queries in real-time.',
		},
		{
			question: 'Is my data secure?',
			answer: 'Yes! We use enterprise-grade encryption and never store your conversations permanently.',
		},
		{
			question: 'What can I use the AI for?',
			answer: 'You can use our AI for general conversations, getting answers to questions, creative writing, and much more.',
		},
		{
			question: 'Is there a mobile app?',
			answer: 'Currently, we offer a responsive web app. A dedicated mobile app is coming soon!',
		},
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
							Get in{' '}
							<span className='bg-gradient-to-r from-chat-pink to-chat-purple bg-clip-text text-transparent'>
								Touch
							</span>
						</h1>
						<p
							className={`text-xl mb-8 max-w-2xl mx-auto ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-muted'
							}`}
						>
							Have questions about our AI
							chatbot? We'd love to hear from
							you. Send us a message and we'll
							respond as soon as possible.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Contact Cards */}
			<section className='py-12 px-6'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{contactInfo.map((info, index) => (
							<motion.div
								key={index}
								className={`backdrop-blur-sm border-2 rounded-2xl p-6 text-center transition-all duration-300 ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20 hover:bg-chat-secondary/50 hover:border-chat-orange/40'
										: 'bg-white/90 border-chat-light-border hover:bg-white hover:border-chat-light-accent/60 shadow-lg'
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
								whileHover={{ y: -5 }}
							>
								<div className='text-chat-pink mb-4 flex justify-center'>
									{info.icon}
								</div>
								<h3
									className={`font-exo font-semibold mb-2 ${
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									}`}
								>
									{info.title}
								</h3>
								<p
									className={`font-medium mb-2 ${
										isDark
											? 'text-chat-accent'
											: 'text-chat-light-muted'
									}`}
								>
									{info.content}
								</p>
								<p
									className={`text-sm ${
										isDark
											? 'text-chat-accent/70'
											: 'text-chat-light-muted/80'
									}`}
								>
									{info.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Contact Form & Info */}
			<section className='py-20 px-6'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
						{/* Contact Form */}
						<motion.div
							className={`backdrop-blur-sm border-2 rounded-2xl p-8 transition-all duration-300 ${
								isDark
									? 'bg-chat-secondary/30 border-chat-accent/20 hover:border-chat-orange/40'
									: 'bg-chat-light-secondary/30 border-chat-purple/30 hover:border-chat-pink/50'
							}`}
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
						>
							<h2
								className={`text-3xl font-exo font-bold mb-6 ${
									isDark
										? 'text-white'
										: 'text-chat-light-text'
								}`}
							>
								Send us a message
							</h2>
							<form
								onSubmit={handleSubmit}
								className='space-y-6'
							>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<label
											className={`block mb-2 font-medium ${
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											}`}
										>
											Name *
										</label>
										<input
											type='text'
											name='name'
											value={
												formData.name
											}
											onChange={
												handleChange
											}
											required
											className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-chat-pink focus:scale-[1.02] ${
												isDark
													? 'bg-chat-primary border-chat-accent/30 text-white placeholder:text-chat-accent/60 hover:border-chat-orange/40'
													: 'bg-chat-light-primary border-chat-purple/30 text-chat-light-text placeholder:text-chat-light-accent/60 hover:border-chat-pink/50'
											}`}
											placeholder='Your name'
										/>
									</div>
									<div>
										<label
											className={`block mb-2 font-medium ${
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											}`}
										>
											Email *
										</label>
										<input
											type='email'
											name='email'
											value={
												formData.email
											}
											onChange={
												handleChange
											}
											required
											className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-chat-pink focus:scale-[1.02] ${
												isDark
													? 'bg-chat-primary border-chat-accent/30 text-white placeholder:text-chat-accent/60 hover:border-chat-orange/40'
													: 'bg-chat-light-primary border-chat-purple/30 text-chat-light-text placeholder:text-chat-light-accent/60 hover:border-chat-pink/50'
											}`}
											placeholder='your@email.com'
										/>
									</div>
								</div>

								<div>
									<label
										className={`block mb-2 font-medium ${
											isDark
												? 'text-chat-accent'
												: 'text-chat-light-accent'
										}`}
									>
										Subject *
									</label>
									<input
										type='text'
										name='subject'
										value={
											formData.subject
										}
										onChange={
											handleChange
										}
										required
										className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-chat-pink focus:scale-[1.02] ${
											isDark
												? 'bg-chat-primary border-chat-accent/30 text-white placeholder:text-chat-accent/60 hover:border-chat-orange/40'
												: 'bg-chat-light-primary border-chat-purple/30 text-chat-light-text placeholder:text-chat-light-accent/60 hover:border-chat-pink/50'
										}`}
										placeholder='How can we help?'
									/>
								</div>

								<div>
									<label
										className={`block mb-2 font-medium ${
											isDark
												? 'text-chat-accent'
												: 'text-chat-light-accent'
										}`}
									>
										Message *
									</label>
									<textarea
										name='message'
										value={
											formData.message
										}
										onChange={
											handleChange
										}
										required
										rows={6}
										className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-chat-pink resize-none focus:scale-[1.02] ${
											isDark
												? 'bg-chat-primary border-chat-accent/30 text-white placeholder:text-chat-accent/60 hover:border-chat-orange/40'
												: 'bg-chat-light-primary border-chat-purple/30 text-chat-light-text placeholder:text-chat-light-accent/60 hover:border-chat-pink/50'
										}`}
										placeholder='Tell us more about your inquiry...'
									/>
								</div>

								<motion.button
									type='submit'
									className='w-full bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-4 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-chat-pink/25 transition-all duration-300 flex items-center justify-center gap-3'
									whileHover={{
										scale: 1.02,
									}}
									whileTap={{
										scale: 0.98,
									}}
								>
									<Send className='w-5 h-5' />
									Send Message
								</motion.button>
							</form>
						</motion.div>

						{/* Office Hours & FAQ */}
						<div className='space-y-8'>
							{/* Office Hours */}
							<motion.div
								className={`backdrop-blur-sm border rounded-2xl p-8 ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20'
										: 'bg-chat-light-secondary/30 border-chat-light-border'
								}`}
								initial={{
									opacity: 0,
									x: 30,
								}}
								animate={{
									opacity: 1,
									x: 0,
								}}
								transition={{
									duration: 0.8,
									delay: 0.2,
								}}
							>
								<div className='flex items-center gap-3 mb-6'>
									<Clock className='w-6 h-6 text-chat-pink' />
									<h3
										className={`text-2xl font-exo font-bold ${
											isDark
												? 'text-white'
												: 'text-chat-light-text'
										}`}
									>
										Office Hours
									</h3>
								</div>
								<div className='space-y-4'>
									<div className='flex justify-between'>
										<span
											className={
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											}
										>
											Monday - Friday
										</span>
										<span
											className={`font-medium ${
												isDark
													? 'text-white'
													: 'text-chat-light-text'
											}`}
										>
											8:00 AM - 6:00
											PM
										</span>
									</div>
									<div className='flex justify-between'>
										<span
											className={
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											}
										>
											Saturday
										</span>
										<span
											className={`font-medium ${
												isDark
													? 'text-white'
													: 'text-chat-light-text'
											}`}
										>
											9:00 AM - 4:00
											PM
										</span>
									</div>
									<div className='flex justify-between'>
										<span
											className={
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											}
										>
											Sunday
										</span>
										<span
											className={`font-medium ${
												isDark
													? 'text-white'
													: 'text-chat-light-text'
											}`}
										>
											Closed
										</span>
									</div>
								</div>
							</motion.div>

							{/* FAQ */}
							<motion.div
								className={`backdrop-blur-sm border rounded-2xl p-8 ${
									isDark
										? 'bg-chat-secondary/30 border-chat-accent/20'
										: 'bg-chat-light-secondary/30 border-chat-light-border'
								}`}
								initial={{
									opacity: 0,
									x: 30,
								}}
								animate={{
									opacity: 1,
									x: 0,
								}}
								transition={{
									duration: 0.8,
									delay: 0.4,
								}}
							>
								<h3
									className={`text-2xl font-exo font-bold mb-6 ${
										isDark
											? 'text-white'
											: 'text-chat-light-text'
									}`}
								>
									Frequently Asked
									Questions
								</h3>
								<div className='space-y-6'>
									{faqs.map(
										(faq, index) => (
											<div
												key={index}
											>
												<h4
													className={`font-semibold mb-2 ${
														isDark
															? 'text-white'
															: 'text-chat-light-text'
													}`}
												>
													{
														faq.question
													}
												</h4>
												<p
													className={`text-sm leading-relaxed ${
														isDark
															? 'text-chat-accent'
															: 'text-chat-light-accent'
													}`}
												>
													{
														faq.answer
													}
												</p>
											</div>
										)
									)}
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Contact;
