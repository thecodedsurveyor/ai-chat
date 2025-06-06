import { useState, useEffect } from 'react';
import {
	Link,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bot, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Navigation = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] =
		useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { toggleTheme, isDark } = useTheme();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);
		return () =>
			window.removeEventListener(
				'scroll',
				handleScroll
			);
	}, []);

	const navItems = [
		{ name: 'Home', path: '/' },
		{ name: 'Features', path: '/features' },
		{ name: 'About', path: '/about' },
		{ name: 'Contact', path: '/contact' },
		{ name: 'Terms', path: '/terms' },
		{ name: 'Privacy', path: '/privacy' },
	];

	const isActive = (path: string) => {
		if (path === '/') {
			return location.pathname === '/';
		}
		return location.pathname === path;
	};

	const handleTryAI = () => {
		navigate('/ai-chat');
	};

	// Handle Features link click - navigate to features page
	const handleFeaturesClick = (e: React.MouseEvent) => {
		e.preventDefault();
		navigate('/features');
		// Close mobile menu if open
		setIsMobileMenuOpen(false);
	};

	// Handle navigation item click
	const handleNavClick = (item: {
		name: string;
		path: string;
	}) => {
		if (item.name === 'Features') {
			return handleFeaturesClick;
		}
		return () => setIsMobileMenuOpen(false);
	};

	return (
		<>
			<motion.nav
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled
						? isDark
							? 'bg-chat-primary/95 backdrop-blur-lg shadow-lg'
							: 'bg-chat-light-primary/95 backdrop-blur-lg shadow-lg'
						: 'bg-transparent'
				}`}
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<div className='max-w-7xl mx-auto px-6'>
					<div className='flex items-center justify-between h-20'>
						{/* Logo */}
						<Link
							to='/'
							className='flex items-center gap-3 group'
						>
							<motion.div
								className='p-2 rounded-xl bg-gradient-to-r from-chat-pink to-chat-purple'
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<Bot className='w-6 h-6 text-white' />
							</motion.div>
							<span
								className={`font-exo font-bold text-2xl group-hover:text-chat-pink transition-colors ${
									isDark
										? 'text-white'
										: 'text-chat-light-text'
								}`}
							>
								NeuronFlow
							</span>
						</Link>

						{/* Desktop Navigation */}
						<div className='hidden md:flex items-center gap-8'>
							{navItems.map((item) => (
								<div key={item.name}>
									{item.name ===
									'Features' ? (
										<button
											onClick={
												handleFeaturesClick
											}
											className={`relative font-exo font-medium transition-colors ${
												isActive(
													item.path
												)
													? 'text-chat-pink'
													: isDark
													? 'text-chat-accent hover:text-white'
													: 'text-chat-light-accent hover:text-chat-light-text'
											}`}
										>
											{item.name}
											{isActive(
												item.path
											) && (
												<motion.div
													className='absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-chat-pink to-chat-purple'
													layoutId='activeTab'
													initial={
														false
													}
													transition={{
														type: 'spring',
														stiffness: 300,
														damping: 30,
													}}
												/>
											)}
										</button>
									) : (
										<Link
											to={item.path}
											className={`relative font-exo font-medium transition-colors ${
												isActive(
													item.path
												)
													? 'text-chat-pink'
													: isDark
													? 'text-chat-accent hover:text-white'
													: 'text-chat-light-accent hover:text-chat-light-text'
											}`}
										>
											{item.name}
											{isActive(
												item.path
											) && (
												<motion.div
													className='absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-chat-pink to-chat-purple'
													layoutId='activeTab'
													initial={
														false
													}
													transition={{
														type: 'spring',
														stiffness: 300,
														damping: 30,
													}}
												/>
											)}
										</Link>
									)}
								</div>
							))}
						</div>

						{/* Theme Toggle & CTA Button */}
						<div className='hidden md:flex items-center gap-4'>
							{/* Theme Toggle Button */}
							<motion.button
								onClick={toggleTheme}
								className={`p-3 rounded-xl transition-all duration-300 ${
									isDark
										? 'bg-chat-secondary/30 text-chat-accent hover:text-chat-pink hover:bg-chat-secondary/50'
										: 'bg-chat-light-secondary text-chat-light-accent hover:text-chat-pink hover:bg-chat-light-hover'
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								title={`Switch to ${
									isDark
										? 'light'
										: 'dark'
								} mode`}
							>
								{isDark ? (
									<Sun className='w-5 h-5' />
								) : (
									<Moon className='w-5 h-5' />
								)}
							</motion.button>

							{/* Login/Register Button */}
							<motion.button
								onClick={() =>
									navigate('/auth')
								}
								className={`px-4 py-3 rounded-xl font-exo font-semibold border-2 transition-all duration-300 ${
									isDark
										? 'border-chat-accent text-chat-accent hover:bg-chat-accent hover:text-chat-primary'
										: 'border-chat-light-accent text-chat-light-accent hover:bg-chat-light-accent hover:text-white'
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Login
							</motion.button>

							{/* CTA Button */}
							<motion.button
								onClick={handleTryAI}
								className='bg-gradient-to-r from-chat-pink to-chat-purple px-6 py-3 rounded-xl font-exo font-semibold text-white shadow-lg hover:shadow-chat-pink/25 transition-all duration-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Try AI Now
							</motion.button>
						</div>

						{/* Mobile Menu Button */}
						<motion.button
							onClick={() =>
								setIsMobileMenuOpen(
									!isMobileMenuOpen
								)
							}
							className={`md:hidden p-2 ${
								isDark
									? 'text-white'
									: 'text-chat-light-text'
							}`}
							whileTap={{ scale: 0.95 }}
						>
							{isMobileMenuOpen ? (
								<X className='w-6 h-6' />
							) : (
								<Menu className='w-6 h-6' />
							)}
						</motion.button>
					</div>
				</div>
			</motion.nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						className='fixed inset-0 z-40 md:hidden'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{/* Backdrop */}
						<div
							className='absolute inset-0 bg-black/50 backdrop-blur-sm'
							onClick={() =>
								setIsMobileMenuOpen(false)
							}
						/>

						{/* Menu Content */}
						<motion.div
							className={`absolute top-20 left-0 right-0 shadow-lg ${
								isDark
									? 'bg-chat-primary/95 backdrop-blur-lg'
									: 'bg-chat-light-primary/95 backdrop-blur-lg'
							}`}
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -20, opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<div className='px-6 py-6 space-y-4'>
								{navItems.map(
									(item, index) => (
										<motion.div
											key={item.name}
											initial={{
												x: -20,
												opacity: 0,
											}}
											animate={{
												x: 0,
												opacity: 1,
											}}
											transition={{
												delay:
													index *
													0.1,
											}}
										>
											{item.name ===
											'Features' ? (
												<button
													onClick={
														handleFeaturesClick
													}
													className={`block w-full text-left py-3 px-4 rounded-xl font-exo font-medium transition-all ${
														isActive(
															item.path
														)
															? isDark
																? 'text-chat-pink bg-chat-secondary/30'
																: 'text-chat-pink bg-chat-light-hover'
															: isDark
															? 'text-chat-accent hover:text-white hover:bg-chat-secondary/20'
															: 'text-chat-light-accent hover:text-chat-light-text hover:bg-chat-light-hover'
													}`}
												>
													{
														item.name
													}
												</button>
											) : (
												<Link
													to={
														item.path
													}
													onClick={handleNavClick(
														item
													)}
													className={`block py-3 px-4 rounded-xl font-exo font-medium transition-all ${
														isActive(
															item.path
														)
															? isDark
																? 'text-chat-pink bg-chat-secondary/30'
																: 'text-chat-pink bg-chat-light-hover'
															: isDark
															? 'text-chat-accent hover:text-white hover:bg-chat-secondary/20'
															: 'text-chat-light-accent hover:text-chat-light-text hover:bg-chat-light-hover'
													}`}
												>
													{
														item.name
													}
												</Link>
											)}
										</motion.div>
									)
								)}

								{/* Mobile Theme Toggle & CTA */}
								<motion.div
									initial={{
										x: -20,
										opacity: 0,
									}}
									animate={{
										x: 0,
										opacity: 1,
									}}
									transition={{
										delay:
											navItems.length *
											0.1,
									}}
									className='pt-4 space-y-4'
								>
									{/* Theme Toggle */}
									<button
										onClick={
											toggleTheme
										}
										className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl font-exo font-medium transition-all ${
											isDark
												? 'text-chat-accent hover:text-white hover:bg-chat-secondary/20'
												: 'text-chat-light-accent hover:text-chat-light-text hover:bg-chat-light-hover'
										}`}
									>
										{isDark ? (
											<Sun className='w-5 h-5' />
										) : (
											<Moon className='w-5 h-5' />
										)}
										Switch to{' '}
										{isDark
											? 'Light'
											: 'Dark'}{' '}
										Mode
									</button>

									{/* Login Button */}
									<button
										onClick={() => {
											navigate(
												'/auth'
											);
											setIsMobileMenuOpen(
												false
											);
										}}
										className={`w-full py-3 px-4 rounded-xl font-exo font-semibold border-2 transition-all ${
											isDark
												? 'border-chat-accent text-chat-accent hover:bg-chat-accent hover:text-chat-primary'
												: 'border-chat-light-accent text-chat-light-accent hover:bg-chat-light-accent hover:text-white'
										}`}
									>
										Login / Register
									</button>

									{/* CTA Button */}
									<button
										onClick={() => {
											handleTryAI();
											setIsMobileMenuOpen(
												false
											);
										}}
										className='w-full bg-gradient-to-r from-chat-pink to-chat-purple px-6 py-3 rounded-xl font-exo font-semibold text-white shadow-lg'
									>
										Try AI Now
									</button>
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navigation;
