import React from 'react';
import {
	getIcon,
	getIconSize,
	getIconColor,
	type IconProps,
} from '../../utils/iconMappings';

interface IconComponentProps {
	name: string;
	className?: string;
	size?: number | string;
	color?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
	title?: string;
}

const Icon: React.FC<IconComponentProps> = ({
	name,
	className = '',
	size,
	color,
	style,
	onClick,
	title,
}) => {
	// Extract size from className if not provided
	const iconSize = size || getIconSize(className);

	// Extract color from className if not provided
	const iconColor = color || getIconColor(className);

	// Create props for the icon
	const iconProps: IconProps = {
		className,
		size: iconSize,
		color: iconColor,
		style,
	};

	const iconElement = getIcon(name, iconProps);

	if (onClick) {
		return (
			<button
				onClick={onClick}
				className={`inline-flex items-center justify-center ${className}`}
				title={title}
				style={style}
			>
				{iconElement}
			</button>
		);
	}

	return (
		<span
			className={`inline-flex items-center justify-center ${className}`}
			title={title}
			style={style}
		>
			{iconElement}
		</span>
	);
};

export default Icon;
