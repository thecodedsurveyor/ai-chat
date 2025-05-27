// Simple class name utility - like clsx but minimal
export const cn = (
	...classes: (string | undefined | null | false)[]
): string => {
	return classes.filter(Boolean).join(' ');
};
