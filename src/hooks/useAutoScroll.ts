import { useEffect, useRef, useState } from 'react';

// Hook to auto-scroll to bottom when messages change, but only if user is near bottom
export const useAutoScroll = (dependency: unknown[]) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [shouldAutoScroll, setShouldAutoScroll] =
		useState(true);

	// Check if user is near the bottom of the scroll container
	const isNearBottom = () => {
		const container = containerRef.current;
		if (!container) return true;

		const { scrollTop, scrollHeight, clientHeight } =
			container;
		const threshold = 100; // pixels from bottom
		return (
			scrollHeight - (scrollTop + clientHeight) <=
			threshold
		);
	};

	// Handle scroll events to determine if we should auto-scroll
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleScroll = () => {
			setShouldAutoScroll(isNearBottom());
		};

		container.addEventListener('scroll', handleScroll);
		return () =>
			container.removeEventListener(
				'scroll',
				handleScroll
			);
	}, []);

	// Auto-scroll only if user is near bottom
	useEffect(() => {
		if (shouldAutoScroll && scrollRef.current) {
			scrollRef.current.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [dependency, shouldAutoScroll]);

	return { scrollRef, containerRef };
};
