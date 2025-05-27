import React from 'react';
import {
	BiCog,
	BiX,
	BiMenu,
	BiChevronDown,
	BiSearch,
	BiFilter,
	BiRefresh,
	BiDownload,
	BiCopy,
	BiEdit,
	BiTrash,
	BiShare,
	BiPlus,
	BiBookmark,
	BiStar,
	BiCheck,
	BiError,
	BiTime,
	BiUser,
	BiChat,
	BiShield,
	BiGlobe,
	BiBrain,
	BiMusic,
	BiPause,
	BiPlay,
	BiStop,
} from 'react-icons/bi';

import { FaPaperPlane, FaSmile } from 'react-icons/fa';
import { TbBolt } from 'react-icons/tb';
import {
	HiOutlineSun as Sun,
	HiOutlineMoon as Moon,
	HiOutlineComputerDesktop as Monitor,
} from 'react-icons/hi2';

export interface IconProps {
	className?: string;
	size?: number | string;
	color?: string;
	style?: React.CSSProperties;
}

// Clean icon mappings with only existing icons
export const iconMappings: Record<
	string,
	(props: IconProps) => React.JSX.Element
> = {
	// Navigation
	'bx-home': (props: IconProps) => <BiChat {...props} />,
	'bx-chat': (props: IconProps) => <BiChat {...props} />,
	'bx-cog': (props: IconProps) => <BiCog {...props} />,
	'bx-search': (props: IconProps) => (
		<BiSearch {...props} />
	),
	'bx-bookmark': (props: IconProps) => (
		<BiBookmark {...props} />
	),

	// Actions
	'bx-user': (props: IconProps) => <BiUser {...props} />,
	'bx-plus': (props: IconProps) => <BiPlus {...props} />,
	'bx-check': (props: IconProps) => (
		<BiCheck {...props} />
	),
	'bx-x': (props: IconProps) => <BiX {...props} />,

	// Menu and navigation
	'bx-menu': (props: IconProps) => <BiMenu {...props} />,
	'bx-chevron-down': (props: IconProps) => (
		<BiChevronDown {...props} />
	),

	// File operations
	'bx-edit': (props: IconProps) => <BiEdit {...props} />,
	'bx-trash': (props: IconProps) => (
		<BiTrash {...props} />
	),
	'bx-copy': (props: IconProps) => <BiCopy {...props} />,
	'bx-download': (props: IconProps) => (
		<BiDownload {...props} />
	),
	'bx-refresh': (props: IconProps) => (
		<BiRefresh {...props} />
	),

	// Communication
	'bx-share': (props: IconProps) => (
		<BiShare {...props} />
	),

	// Time
	'bx-time': (props: IconProps) => <BiTime {...props} />,

	// Media controls
	'bx-play': (props: IconProps) => <BiPlay {...props} />,
	'bx-pause': (props: IconProps) => (
		<BiPause {...props} />
	),
	'bx-stop': (props: IconProps) => <BiStop {...props} />,
	'bx-music': (props: IconProps) => (
		<BiMusic {...props} />
	),

	// Data operations
	'bx-filter': (props: IconProps) => (
		<BiFilter {...props} />
	),

	// Tags and labels
	'bx-star': (props: IconProps) => <BiStar {...props} />,

	// Status
	'bx-error': (props: IconProps) => (
		<BiError {...props} />
	),

	// Security
	'bx-shield': (props: IconProps) => (
		<BiShield {...props} />
	),

	// Misc
	'bx-globe': (props: IconProps) => (
		<BiGlobe {...props} />
	),
	'bx-brain': (props: IconProps) => (
		<BiBrain {...props} />
	),
	'bx-lightning': (props: IconProps) => (
		<TbBolt {...props} />
	),
};

// Font Awesome mappings
export const FontAwesomeMap = {
	'fa-paper-plane': (props: IconProps) => (
		<FaPaperPlane {...props} />
	),
	'fa-face-smile': (props: IconProps) => (
		<FaSmile {...props} />
	),
};

// Theme icons
export const ThemeIcons = {
	Sun,
	Moon,
	Monitor,
};

// Helper function to get icon by name
export const getIcon = (
	iconName: string,
	props: IconProps = {}
) => {
	// Remove prefixes and get base name
	const baseName = iconName.replace(
		/^(bx-|bxs-|fa-solid\s+fa-|fa-)/,
		''
	);

	// Check boxicons first
	const boxIconKey =
		`bx-${baseName}` as keyof typeof iconMappings;
	if (iconMappings[boxIconKey]) {
		return iconMappings[boxIconKey](props);
	}

	// Check font awesome
	const faIconKey =
		`fa-${baseName}` as keyof typeof FontAwesomeMap;
	if (FontAwesomeMap[faIconKey]) {
		return FontAwesomeMap[faIconKey](props);
	}

	// Fallback to a default icon
	console.warn(`Icon not found: ${iconName}`);
	return <BiError {...props} />;
};

// Helper function to convert className to size
export const getIconSize = (className: string): number => {
	if (className.includes('text-xs')) return 12;
	if (className.includes('text-sm')) return 14;
	if (className.includes('text-lg')) return 18;
	if (className.includes('text-xl')) return 20;
	if (className.includes('text-2xl')) return 24;
	if (className.includes('text-3xl')) return 30;
	if (className.includes('text-4xl')) return 36;
	if (className.includes('text-5xl')) return 48;
	if (className.includes('text-6xl')) return 60;

	// Check for w- and h- classes
	const sizeMatch = className.match(/w-(\d+)|h-(\d+)/);
	if (sizeMatch) {
		const size = parseInt(sizeMatch[1] || sizeMatch[2]);
		return size * 4; // Convert Tailwind units to pixels
	}

	return 16; // Default size
};

// Helper function to extract color from className
export const getIconColor = (
	className: string
): string | undefined => {
	// Extract text color classes
	const colorMatch = className.match(/text-(\w+)-(\d+)/);
	if (colorMatch) {
		return undefined; // Let CSS handle it
	}

	// Extract specific color names
	if (className.includes('text-white')) return '#ffffff';
	if (className.includes('text-black')) return '#000000';

	return undefined;
};

export default {
	iconMappings,
	FontAwesomeMap,
	ThemeIcons,
	getIcon,
	getIconSize,
	getIconColor,
};
