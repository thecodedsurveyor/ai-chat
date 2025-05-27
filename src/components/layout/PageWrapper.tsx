import React from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';

interface PageWrapperProps {
	children: React.ReactNode;
	title?: string;
	className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
	children,
	title,
	className = '',
}) => {
	// Apply the dynamic title system
	usePageTitle(title);

	return (
		<div className={`min-h-screen ${className}`}>
			{children}
		</div>
	);
};

export default PageWrapper;
