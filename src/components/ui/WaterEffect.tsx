import React, {
	useRef,
	useState,
	useEffect,
	useCallback,
} from 'react';
import { motion } from 'framer-motion';

interface Ripple {
	id: number;
	x: number;
	y: number;
	startTime: number;
}

interface WaterEffectProps {
	className?: string;
}

const WaterEffect: React.FC<WaterEffectProps> = ({
	className = '',
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [ripples, setRipples] = useState<Ripple[]>([]);
	const [mousePosition, setMousePosition] = useState({
		x: 50,
		y: 50,
	});
	const [isHovered, setIsHovered] = useState(false);
	const rippleCounter = useRef(0);

	// Create ripple on mouse move
	const handleMouseMove = useCallback(
		(event: React.MouseEvent) => {
			if (containerRef.current) {
				const rect =
					containerRef.current.getBoundingClientRect();
				const x = event.clientX - rect.left;
				const y = event.clientY - rect.top;

				setMousePosition({ x, y });

				// Create ripple with throttling
				const now = Date.now();
				setRipples((prev) => {
					// Remove old ripples and add new one
					const filtered = prev.filter(
						(ripple) =>
							now - ripple.startTime < 2000
					);

					return [
						...filtered,
						{
							id: rippleCounter.current++,
							x,
							y,
							startTime: now,
						},
					];
				});
			}
		},
		[]
	);

	// Clean up old ripples
	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			setRipples((prev) =>
				prev.filter(
					(ripple) =>
						now - ripple.startTime < 2000
				)
			);
		}, 100);

		return () => clearInterval(interval);
	}, []);

	// Floating particles animation
	const particles = Array.from(
		{ length: 15 },
		(_, i) => ({
			id: i,
			initialX: Math.random() * 100,
			initialY: Math.random() * 100,
			size: Math.random() * 3 + 1,
			delay: Math.random() * 4,
		})
	);

	return (
		<div
			ref={containerRef}
			className={`relative w-full h-full overflow-hidden cursor-crosshair ${className}`}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				background: `
					radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
						rgba(59, 130, 246, 0.15) 0%, 
						rgba(147, 51, 234, 0.1) 50%, 
						rgba(236, 72, 153, 0.05) 100%
					),
					linear-gradient(45deg, 
						rgba(59, 130, 246, 0.1) 0%, 
						rgba(147, 51, 234, 0.08) 25%, 
						rgba(236, 72, 153, 0.06) 50%, 
						rgba(245, 158, 11, 0.04) 75%, 
						rgba(16, 185, 129, 0.08) 100%
					)
				`,
			}}
		>
			{/* Animated water surface */}
			<div className='absolute inset-0'>
				<motion.div
					className='absolute inset-0 opacity-30'
					animate={{
						x: [0, 5, -3, 2, 0],
						y: [0, -5, -2, 3, 0],
						opacity: [0.3, 0.4, 0.2, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					style={{
						background: `
							repeating-linear-gradient(
								0deg,
								transparent 0px,
								rgba(59, 130, 246, 0.1) 2px,
								transparent 4px
							),
							repeating-linear-gradient(
								90deg,
								transparent 0px,
								rgba(147, 51, 234, 0.08) 2px,
								transparent 4px
							)
						`,
					}}
				/>
			</div>

			{/* Floating particles */}
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className='absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-sm'
					style={{
						left: `${particle.initialX}%`,
						top: `${particle.initialY}%`,
						width: particle.size,
						height: particle.size,
					}}
					animate={{
						y: [0, -20, 0],
						x: [
							0,
							Math.sin(particle.id) * 10,
							0,
						],
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.7, 0.3],
					}}
					transition={{
						duration: 4 + particle.delay,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: particle.delay,
					}}
				/>
			))}

			{/* Mouse ripples */}
			{ripples.map((ripple) => (
				<motion.div
					key={ripple.id}
					className='absolute pointer-events-none'
					style={{
						left: ripple.x,
						top: ripple.y,
						transform: 'translate(-50%, -50%)',
					}}
					initial={{ scale: 0, opacity: 0.8 }}
					animate={{ scale: 4, opacity: 0 }}
					transition={{
						duration: 2,
						ease: 'easeOut',
					}}
				>
					<div className='w-8 h-8 rounded-full border-2 border-blue-400/60' />
				</motion.div>
			))}

			{/* Central water orb */}
			<motion.div
				className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
				animate={{
					scale: isHovered ? 1.2 : 1,
					rotate: [0, 360],
				}}
				transition={{
					scale: { duration: 0.3 },
					rotate: {
						duration: 20,
						repeat: Infinity,
						ease: 'linear',
					},
				}}
			>
				<div className='relative w-32 h-32'>
					{/* Main water orb */}
					<div
						className='absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/30 backdrop-blur-md border border-white/20'
						style={{
							background: `
								radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
								conic-gradient(from 45deg, 
									rgba(59, 130, 246, 0.4), 
									rgba(147, 51, 234, 0.3), 
									rgba(236, 72, 153, 0.4), 
									rgba(59, 130, 246, 0.4)
								)
							`,
							boxShadow: `
								0 0 30px rgba(59, 130, 246, 0.3),
								inset 0 0 30px rgba(255, 255, 255, 0.1)
							`,
						}}
					/>

					{/* Inner ripples */}
					{[...Array(3)].map((_, i) => (
						<motion.div
							key={i}
							className='absolute inset-0 rounded-full border border-white/30'
							animate={{
								scale: [0.5, 1.5],
								opacity: [0.8, 0],
							}}
							transition={{
								duration: 3,
								repeat: Infinity,
								delay: i * 1,
								ease: 'easeOut',
							}}
						/>
					))}

					{/* Highlight */}
					<div
						className='absolute top-4 left-4 w-4 h-4 rounded-full bg-white/60 backdrop-blur-sm'
						style={{
							background: `
								radial-gradient(circle at center, 
									rgba(255, 255, 255, 0.8) 0%, 
									rgba(255, 255, 255, 0.3) 70%, 
									transparent 100%
								)
							`,
						}}
					/>
				</div>
			</motion.div>

			{/* Wave effect on hover */}
			{isHovered && (
				<motion.div
					className='absolute inset-0 pointer-events-none'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{[...Array(5)].map((_, i) => (
						<motion.div
							key={i}
							className='absolute rounded-full border border-blue-400/40'
							style={{
								left: mousePosition.x,
								top: mousePosition.y,
								transform:
									'translate(-50%, -50%)',
							}}
							animate={{
								scale: [0, 3],
								opacity: [0.6, 0],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								delay: i * 0.3,
								ease: 'easeOut',
							}}
						>
							<div className='w-4 h-4' />
						</motion.div>
					))}
				</motion.div>
			)}
		</div>
	);
};

export default WaterEffect;
