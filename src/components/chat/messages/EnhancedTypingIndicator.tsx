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
				transition={{ duration: 0.2 }}
				className='max-w-[85%] md:max-w-[80%] rounded-3xl rounded-tl-none bg-gradient-to-r from-chat-orange to-chat-pink text-white px-4 py-3 md:px-6 md:py-4 shadow-lg border-2 border-white/20 relative'
			>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-full bg-white/20 shadow-lg'>
						<motion.div
							animate={{
								rotate: 360,
								scale: [1, 1.1, 1],
							}}
							transition={{
								rotate: {
									duration: 2,
									repeat: Infinity,
									ease: 'linear',
								},
								scale: {
									duration: 1,
									repeat: Infinity,
								},
							}}
						>
							<BiBrain className='text-white text-lg' />
						</motion.div>
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
										scale: [1, 1.3, 1],
										opacity: [
											0.4, 1, 0.4,
										],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										delay: i * 0.15,
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
