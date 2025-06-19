import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Sparkles,
	Users,
	Zap,
	ArrowRight,
} from 'lucide-react';

interface GuestPromptProps {
	remainingUses?: number;
	totalUses?: number;
	className?: string;
}

const GuestPrompt: React.FC<GuestPromptProps> = ({
	remainingUses = 10,
	totalUses = 10,
	className = '',
}) => {
	const navigate = useNavigate();
	const usedUses = totalUses - remainingUses;
	const progressPercentage = (usedUses / totalUses) * 100;

	const handleSignUp = () => {
		navigate('/auth?mode=signup');
	};

	const handleLogin = () => {
		navigate('/auth?mode=login');
	};

	return (
		<div
			className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-blue-100 dark:border-gray-600 ${className}`}
		>
			{/* Header */}
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center space-x-3'>
					<div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
						<Sparkles className='w-5 h-5 text-white' />
					</div>
					<div>
						<h3 className='font-bold text-gray-900 dark:text-white'>
							Guest Mode
						</h3>
						<p className='text-sm text-gray-600 dark:text-gray-300'>
							Try before you sign up!
						</p>
					</div>
				</div>
			</div>

			{/* Usage Progress */}
			<div className='mb-4'>
				<div className='flex items-center justify-between text-sm mb-2'>
					<span className='text-gray-600 dark:text-gray-300'>
						Free messages
					</span>
					<span className='font-medium text-gray-900 dark:text-white'>
						{remainingUses} / {totalUses} left
					</span>
				</div>
				<div className='w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
					<div
						className='bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300'
						style={{
							width: `${progressPercentage}%`,
						}}
					/>
				</div>
			</div>

			{/* Features Preview */}
			<div className='space-y-2 mb-4'>
				<h4 className='font-semibold text-gray-900 dark:text-white text-sm'>
					Unlock with Account:
				</h4>
				<div className='space-y-1 text-xs text-gray-600 dark:text-gray-300'>
					<div className='flex items-center space-x-2'>
						<Zap className='w-3 h-3 text-blue-500' />
						<span>Unlimited conversations</span>
					</div>
					<div className='flex items-center space-x-2'>
						<Users className='w-3 h-3 text-purple-500' />
						<span>Access to all AI models</span>
					</div>
					<div className='flex items-center space-x-2'>
						<Sparkles className='w-3 h-3 text-pink-500' />
						<span>Save chat history</span>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className='space-y-2'>
				<button
					onClick={handleSignUp}
					className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2'
				>
					<span>Get Started Free</span>
					<ArrowRight className='w-4 h-4' />
				</button>
				<button
					onClick={handleLogin}
					className='w-full border border-blue-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 font-medium py-2.5 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm'
				>
					Already have an account?
				</button>
			</div>

			{/* Footer */}
			<div className='mt-4 pt-3 border-t border-blue-100 dark:border-gray-600'>
				<p className='text-xs text-center text-gray-500 dark:text-gray-400'>
					✨ No credit card required • Free
					forever
				</p>
			</div>
		</div>
	);
};

export default GuestPrompt;
