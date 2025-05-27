import React from 'react';
import { Bot, Settings, Mic, Volume2 } from 'lucide-react';
// React Icons imports
import {
	MdFlashOn,
	MdCollections,
	MdStar,
	MdEmojiEmotions,
} from 'react-icons/md';

const TestComponent: React.FC = () => {
	return (
		<div className='p-4 space-y-4'>
			<h2 className='text-xl font-bold'>
				Component Test
			</h2>

			{/* Icon Tests */}
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>
					Icons Test
				</h3>
				<div className='flex items-center gap-4'>
					<Bot className='w-6 h-6 text-blue-500' />
					<Settings className='w-6 h-6 text-gray-500' />
					<Mic className='w-6 h-6 text-green-500' />
					<Volume2 className='w-6 h-6 text-purple-500' />
				</div>
				<div className='flex items-center gap-4'>
					<MdFlashOn className='text-2xl text-yellow-500' />
					<MdCollections className='text-2xl text-blue-500' />
					<MdEmojiEmotions className='text-2xl text-green-500' />
					<MdStar className='text-2xl text-yellow-400' />
				</div>
			</div>

			{/* Font Tests */}
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>
					Font Test
				</h3>
				<p
					style={{
						fontFamily: 'Inter, sans-serif',
					}}
				>
					Inter Font Test
				</p>
				<p
					style={{
						fontFamily: 'Roboto, sans-serif',
					}}
				>
					Roboto Font Test
				</p>
				<p
					style={{
						fontFamily: 'Poppins, sans-serif',
					}}
				>
					Poppins Font Test
				</p>
				<p
					style={{
						fontFamily: 'Open Sans, sans-serif',
					}}
				>
					Open Sans Font Test
				</p>
			</div>
		</div>
	);
};

export default TestComponent;
