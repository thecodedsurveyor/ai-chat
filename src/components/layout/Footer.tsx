import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
	Bot,
	Mail,
	Phone,
	MapPin,
	Github,
	Twitter,
	Linkedin,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
	const currentYear = new Date().getFullYear();
	const { isDark } = useTheme();

	const footerLinks = {
		product: [
			{ name: 'Features', path: '/features' },
			{ name: 'Pricing', path: '/pricing' },
		],
		company: [
			{ name: 'About Us', path: '/about' },
			{ name: 'Careers', path: '/careers' },
			{ name: 'Blog', path: '/blog' },
		],
		legal: [
			{ name: 'Privacy Policy', path: '/privacy' },
			{ name: 'Terms of Service', path: '/terms' },
			{ name: 'Cookie Policy', path: '/cookies' },
			{ name: 'GDPR', path: '/gdpr' },
		],
		support: [
			{ name: 'Help Center', path: '/help' },
			{ name: 'Contact Us', path: '/contact' },
			{ name: 'Status', path: '/status' },
		],
	};

	const socialLinks = [
		{
			name: 'Twitter',
			icon: Twitter,
			url: 'https://twitter.com',
		},
		{
			name: 'LinkedIn',
			icon: Linkedin,
			url: 'https://linkedin.com',
		},
		{
			name: 'GitHub',
			icon: Github,
			url: 'https://github.com',
		},
	];

	return (
		<footer
			className={`border-t ${
				isDark
					? 'bg-chat-primary border-chat-accent/20'
					: 'bg-chat-light-primary border-chat-light-border'
			}`}
		>
			<div className='max-w-7xl mx-auto px-6 py-16'>
				{/* Main Footer Content */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12'>
					{/* Brand Section */}
					<div className='lg:col-span-2'>
						<Link
							to='/'
							className='flex items-center gap-3 mb-6'
						>
							<motion.div
								className='p-2 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple'
								whileHover={{ scale: 1.1 }}
							>
								<Bot className='w-6 h-6 text-white' />
							</motion.div>
							<span
								className={`font-exo font-bold text-2xl ${
									isDark
										? 'text-white'
										: 'text-chat-light-text'
								}`}
							>
								AI Chat
							</span>
						</Link>
						<p
							className={`mb-6 leading-relaxed ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							Experience the future of
							conversation with our advanced
							AI chatbot. Intelligent, fast,
							and designed for the modern
							world.
						</p>

						{/* Contact Info */}
						<div className='space-y-3'>
							<div
								className={`flex items-center gap-3 ${
									isDark
										? 'text-chat-accent'
										: 'text-chat-light-accent'
								}`}
							>
								<Mail className='w-4 h-4' />
								<span>
									hello@aichat.com
								</span>
							</div>
							<div
								className={`flex items-center gap-3 ${
									isDark
										? 'text-chat-accent'
										: 'text-chat-light-accent'
								}`}
							>
								<Phone className='w-4 h-4' />
								<span>
									+1 (555) 123-4567
								</span>
							</div>
							<div
								className={`flex items-center gap-3 ${
									isDark
										? 'text-chat-accent'
										: 'text-chat-light-accent'
								}`}
							>
								<MapPin className='w-4 h-4' />
								<span>
									San Francisco, CA
								</span>
							</div>
						</div>
					</div>

					{/* Product Links */}
					<div>
						<h3
							className={`font-exo font-semibold mb-6 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							Product
						</h3>
						<ul className='space-y-3'>
							{footerLinks.product.map(
								(link) => (
									<li key={link.name}>
										<Link
											to={link.path}
											className={`transition-colors hover:text-chat-pink ${
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											}`}
										>
											{link.name}
										</Link>
									</li>
								)
							)}
						</ul>
					</div>

					{/* Company Links */}
					<div>
						<h3
							className={`font-exo font-semibold mb-6 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							Company
						</h3>
						<ul className='space-y-3'>
							{footerLinks.company.map(
								(link) => (
									<li key={link.name}>
										<Link
											to={link.path}
											className={`transition-colors hover:text-chat-pink ${
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											}`}
										>
											{link.name}
										</Link>
									</li>
								)
							)}
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h3
							className={`font-exo font-semibold mb-6 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							Legal
						</h3>
						<ul className='space-y-3'>
							{footerLinks.legal.map(
								(link) => (
									<li key={link.name}>
										<Link
											to={link.path}
											className={`transition-colors hover:text-chat-pink ${
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											}`}
										>
											{link.name}
										</Link>
									</li>
								)
							)}
						</ul>
					</div>

					{/* Support Links */}
					<div>
						<h3
							className={`font-exo font-semibold mb-6 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							Support
						</h3>
						<ul className='space-y-3'>
							{footerLinks.support.map(
								(link) => (
									<li key={link.name}>
										<Link
											to={link.path}
											className={`transition-colors hover:text-chat-pink ${
												isDark
													? 'text-chat-accent'
													: 'text-chat-light-accent'
											}`}
										>
											{link.name}
										</Link>
									</li>
								)
							)}
						</ul>
					</div>
				</div>

				{/* Newsletter Section */}
				<div
					className={`rounded-2xl p-8 mb-12 ${
						isDark
							? 'bg-chat-secondary/30'
							: 'bg-chat-light-secondary border border-chat-light-border'
					}`}
				>
					<div className='max-w-2xl mx-auto text-center'>
						<h3
							className={`font-exo font-bold text-2xl mb-4 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
						>
							Stay Updated
						</h3>
						<p
							className={`mb-6 ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							Get the latest news and updates
							about our AI chatbot features.
						</p>
						<form className='flex flex-col sm:flex-row gap-4'>
							<input
								type='email'
								placeholder='Enter your email'
								className={`flex-1 px-6 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-chat-pink focus:scale-[1.02] ${
									isDark
										? 'bg-chat-primary border-chat-accent/30 text-white placeholder:text-chat-accent/60 hover:border-chat-orange/40'
										: 'bg-chat-light-primary border-chat-purple/30 text-chat-light-text placeholder:text-chat-light-accent/60 hover:border-chat-pink/50'
								}`}
							/>
							<motion.button
								type='submit'
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-8 py-3 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-chat-pink/25 transition-all duration-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Subscribe
							</motion.button>
						</form>
					</div>
				</div>

				{/* Bottom Bar */}
				<div
					className={`border-t pt-8 ${
						isDark
							? 'border-chat-accent/20'
							: 'border-chat-light-border'
					}`}
				>
					<div className='flex flex-col md:flex-row items-center justify-between gap-6'>
						{/* Copyright */}
						<p
							className={`text-center md:text-left ${
								isDark
									? 'text-chat-accent'
									: 'text-chat-light-accent'
							}`}
						>
							© {currentYear} AI Chat. All
							rights reserved. Built with ❤️
							for the future.
						</p>

						{/* Social Links */}
						<div className='flex items-center gap-4'>
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<motion.a
										key={social.name}
										href={social.url}
										target='_blank'
										rel='noopener noreferrer'
										className={`p-2 rounded-lg transition-all duration-300 hover:text-chat-pink ${
											isDark
												? 'bg-chat-secondary/30 text-chat-accent hover:bg-chat-secondary/50'
												: 'bg-chat-light-secondary text-chat-light-accent hover:bg-chat-light-hover'
										}`}
										whileHover={{
											scale: 1.1,
										}}
										whileTap={{
											scale: 0.95,
										}}
									>
										<Icon className='w-5 h-5' />
									</motion.a>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
