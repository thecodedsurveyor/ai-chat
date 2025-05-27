import React from 'react';
import { motion } from 'framer-motion';
import { BiBrain } from 'react-icons/bi';

interface EnhancedTypingIndicatorProps {
	isVisible: boolean;
}

const EnhancedTypingIndicator: React.FC<
	EnhancedTypingIndicatorProps
> = ({ isVisible }) => {
	if (!isVisible) return null;

	return (
		<div className='flex w-full justify-start'>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				className='max-w-[85%] md:max-w-[80%] rounded-3xl rounded-tl-none bg-gradient-to-r from-chat-orange to-chat-pink text-white px-4 py-4 md:px-8 md:py-6 shadow-lg border-2 border-white/20 relative'
			>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-full bg-white/20 shadow-lg'>
						<BiBrain className='text-white text-lg' />
					</div>
					<div className='flex items-center gap-1'>
						<span className='text-sm font-medium text-white'>
							AI is thinking
						</span>
						<div className='flex gap-1 ml-2'>
							{[0, 1, 2].map((i) => (
								<motion.div
									key={i}
									className='w-2 h-2 rounded-full bg-white/70'
									animate={{
										scale: [1, 1.2, 1],
										opacity: [
											0.5, 1, 0.5,
										],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										delay: i * 0.2,
									}}
								/>
							))}
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default EnhancedTypingIndicator;
