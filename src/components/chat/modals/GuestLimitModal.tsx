import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Star, Zap } from 'lucide-react';

interface GuestLimitModalProps {
	isOpen: boolean;
	onClose: () => void;
	usedCount: number;
	maxCount: number;
}

const GuestLimitModal: React.FC<GuestLimitModalProps> = ({
	isOpen,
	onClose,
	usedCount,
	maxCount,
}) => {
	const navigate = useNavigate();

	const handleSignUp = () => {
		onClose();
		navigate('/auth?mode=signup');
	};

	const handleLogin = () => {
		onClose();
		navigate('/auth?mode=login');
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
			<div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden'>
				{/* Background decoration */}
				<div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full translate-y-12 -translate-x-12'></div>

				{/* Close button */}
				<button
					onClick={onClose}
					className='absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10'
				>
					<X size={20} />
				</button>

				{/* Content */}
				<div className='relative p-8 text-center'>
					{/* Icon */}
					<div className='mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6'>
						<Sparkles className='w-8 h-8 text-white' />
					</div>

					{/* Title */}
					<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
						Free Trial Complete! 🎉
					</h2>

					{/* Description */}
					<p className='text-gray-600 dark:text-gray-300 mb-6 leading-relaxed'>
						You've used all{' '}
						<span className='font-semibold text-blue-600 dark:text-blue-400'>
							{maxCount} free messages
						</span>
						. Join our community to unlock
						unlimited conversations and premium
						features!
					</p>

					{/* Usage stats */}
					<div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6'>
						<div className='flex items-center justify-center space-x-4 text-sm'>
							<div className='flex items-center space-x-2'>
								<div className='w-3 h-3 bg-blue-500 rounded-full'></div>
								<span className='text-gray-600 dark:text-gray-300'>
									Used: {usedCount}
								</span>
							</div>
							<div className='flex items-center space-x-2'>
								<div className='w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full'></div>
								<span className='text-gray-600 dark:text-gray-300'>
									Limit: {maxCount}
								</span>
							</div>
						</div>
					</div>

					{/* Premium features preview */}
					<div className='mb-6'>
						<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
							Unlock Premium Features
						</h3>
						<div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
							<div className='flex items-center justify-center space-x-2'>
								<Star className='w-4 h-4 text-yellow-500' />
								<span>
									Unlimited conversations
								</span>
							</div>
							<div className='flex items-center justify-center space-x-2'>
								<Zap className='w-4 h-4 text-blue-500' />
								<span>
									Access to all AI models
								</span>
							</div>
							<div className='flex items-center justify-center space-x-2'>
								<Sparkles className='w-4 h-4 text-purple-500' />
								<span>
									Chat history & favorites
								</span>
							</div>
						</div>
					</div>

					{/* Action buttons */}
					<div className='space-y-3'>
						<button
							onClick={handleSignUp}
							className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]'
						>
							Create Free Account
						</button>
						<button
							onClick={handleLogin}
							className='w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
						>
							Already have an account? Sign In
						</button>
					</div>

					{/* Footer note */}
					<p className='text-xs text-gray-500 dark:text-gray-400 mt-4'>
						No credit card required • Free
						forever
					</p>
				</div>
			</div>
		</div>
	);
};

export default GuestLimitModal;
