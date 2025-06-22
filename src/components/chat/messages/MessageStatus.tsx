import type { MessageStatus } from '../../../types';
import {
	BiTime,
	BiCheck,
	BiCheckDouble,
	BiError,
} from 'react-icons/bi';

type MessageStatusProps = {
	status?: MessageStatus;
	className?: string;
};

const MessageStatusComponent = ({
	status,
	className = '',
}: MessageStatusProps) => {
	if (!status) return null;

	const getStatusIcon = () => {
		switch (status) {
			case 'sending':
				return (
					<div className='flex items-center space-x-1'>
						<div className='w-3 h-3 rounded-full bg-white animate-pulse'></div>
						<BiTime className='text-white text-xl' />
					</div>
				);
			case 'sent':
				return (
					<BiCheck className='text-white text-xl' />
				);
			case 'delivered':
				return (
					<BiCheckDouble className='text-white text-xl' />
				);
			case 'error':
				return (
					<div className='flex items-center space-x-1'>
						<BiError className='text-red-400 text-xl' />
						<span className='text-sm text-red-400'>
							Failed
						</span>
					</div>
				);
			default:
				return null;
		}
	};

	const getStatusText = () => {
		switch (status) {
			case 'sending':
				return 'Sending...';
			case 'sent':
				return 'Sent';
			case 'delivered':
				return 'Delivered';
			case 'error':
				return 'Failed to send';
			default:
				return '';
		}
	};

	return (
		<div
			className={`flex items-center space-x-1 ${className}`}
			title={getStatusText()}
		>
			{getStatusIcon()}
		</div>
	);
};

export default MessageStatusComponent;
