import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const BackToTop = () => {
	const [isVisible, setIsVisible] = useState(false);
	const { isDark } = useTheme();

	useEffect(() => {
		const toggleVisibility = () => {
			// Show button when user scrolls past half of the page
			const scrollHeight =
				document.documentElement.scrollHeight;
			const clientHeight =
				document.documentElement.clientHeight;
			const scrollTop = window.pageYOffset;

			const halfPageHeight =
				(scrollHeight - clientHeight) / 2;

			if (scrollTop > halfPageHeight) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener('scroll', toggleVisibility);
		return () =>
			window.removeEventListener(
				'scroll',
				toggleVisibility
			);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					onClick={scrollToTop}
					className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg backdrop-blur-sm border-2 transition-all duration-300 ${
						isDark
							? 'bg-chat-secondary/80 border-chat-accent/30 text-chat-accent hover:bg-chat-secondary hover:border-chat-pink/50 hover:text-chat-pink'
							: 'bg-white/80 border-chat-purple/30 text-chat-light-accent hover:bg-white hover:border-chat-pink/50 hover:text-chat-pink'
					}`}
					initial={{
						opacity: 0,
						scale: 0.8,
						y: 20,
					}}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.8, y: 20 }}
					whileHover={{
						scale: 1.1,
						boxShadow: isDark
							? '0 8px 32px rgba(244, 47, 95, 0.3)'
							: '0 8px 32px rgba(244, 47, 95, 0.2)',
					}}
					whileTap={{ scale: 0.95 }}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 20,
					}}
					title='Back to Top'
				>
					<ArrowUp className='w-6 h-6' />
				</motion.button>
			)}
		</AnimatePresence>
	);
};

export default BackToTop;
