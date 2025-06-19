import { useEffect, useRef, useState } from 'react';

interface SwipeCallbacks {
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	onSwipeUp?: () => void;
	onSwipeDown?: () => void;
}

interface UseSwipeGestureOptions {
	threshold?: number;
	preventDefaultTouchmoveEvent?: boolean;
}

const useSwipeGesture = (
	callbacks: SwipeCallbacks,
	options: UseSwipeGestureOptions = {}
) => {
	const {
		threshold = 50,
		preventDefaultTouchmoveEvent = false,
	} = options;
	const [touchStart, setTouchStart] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [touchEnd, setTouchEnd] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const elementRef = useRef<HTMLElement>(null);

	const onTouchStart = (e: TouchEvent) => {
		setTouchEnd(null); // Reset touch end
		setTouchStart({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		});
	};

	const onTouchMove = (e: TouchEvent) => {
		if (preventDefaultTouchmoveEvent) {
			e.preventDefault();
		}
		setTouchEnd({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		});
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const distanceX = touchStart.x - touchEnd.x;
		const distanceY = touchStart.y - touchEnd.y;
		const isLeftSwipe = distanceX > threshold;
		const isRightSwipe = distanceX < -threshold;
		const isUpSwipe = distanceY > threshold;
		const isDownSwipe = distanceY < -threshold;

		// Determine if it's more horizontal or vertical
		if (Math.abs(distanceX) > Math.abs(distanceY)) {
			// Horizontal swipe
			if (isLeftSwipe && callbacks.onSwipeLeft) {
				callbacks.onSwipeLeft();
			}
			if (isRightSwipe && callbacks.onSwipeRight) {
				callbacks.onSwipeRight();
			}
		} else {
			// Vertical swipe
			if (isUpSwipe && callbacks.onSwipeUp) {
				callbacks.onSwipeUp();
			}
			if (isDownSwipe && callbacks.onSwipeDown) {
				callbacks.onSwipeDown();
			}
		}
	};

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		element.addEventListener(
			'touchstart',
			onTouchStart,
			{ passive: true }
		);
		element.addEventListener('touchmove', onTouchMove, {
			passive: !preventDefaultTouchmoveEvent,
		});
		element.addEventListener('touchend', onTouchEnd, {
			passive: true,
		});

		return () => {
			element.removeEventListener(
				'touchstart',
				onTouchStart
			);
			element.removeEventListener(
				'touchmove',
				onTouchMove
			);
			element.removeEventListener(
				'touchend',
				onTouchEnd
			);
		};
	}, [
		callbacks,
		threshold,
		preventDefaultTouchmoveEvent,
	]);

	return elementRef;
};

export default useSwipeGesture;
