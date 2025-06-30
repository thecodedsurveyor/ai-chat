import React, { useState } from 'react';
import type { ReactNode } from 'react';

interface TooltipProps {
	text: string;
	children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
	text,
	children,
}) => {
	const [visible, setVisible] = useState(false);

	return (
		<div className='relative inline-flex items-center'>
			<div
				className='cursor-help'
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				onFocus={() => setVisible(true)}
				onBlur={() => setVisible(false)}
				tabIndex={0}
			>
				{children}
			</div>
			{visible && (
				<div className='absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap pointer-events-none'>
					{text}
					<div className='absolute w-2 h-2 bg-gray-900 transform rotate-45 translate-x-[-50%] left-[50%] bottom-[-4px]'></div>
				</div>
			)}
		</div>
	);
};

export default Tooltip;
