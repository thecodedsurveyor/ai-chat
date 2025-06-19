/**
 * Guest Usage Manager
 * Tracks and manages usage limits for non-authenticated users
 */

const GUEST_USAGE_KEY = 'neuronflow_guest_usage';
const MAX_GUEST_USES = 10;

export interface GuestUsage {
	count: number;
	firstUse: string;
	lastUse: string;
}

export class GuestUsageManager {
	/**
	 * Get current guest usage from localStorage
	 */
	static getUsage(): GuestUsage {
		try {
			const stored =
				localStorage.getItem(GUEST_USAGE_KEY);
			if (stored) {
				return JSON.parse(stored);
			}
		} catch (error) {
			console.warn(
				'Failed to parse guest usage data:',
				error
			);
		}

		// Return default usage
		return {
			count: 0,
			firstUse: new Date().toISOString(),
			lastUse: new Date().toISOString(),
		};
	}

	/**
	 * Save usage data to localStorage
	 */
	static saveUsage(usage: GuestUsage): void {
		try {
			localStorage.setItem(
				GUEST_USAGE_KEY,
				JSON.stringify(usage)
			);
		} catch (error) {
			console.warn(
				'Failed to save guest usage data:',
				error
			);
		}
	}

	/**
	 * Increment usage count
	 */
	static incrementUsage(): GuestUsage {
		const usage = GuestUsageManager.getUsage();
		const now = new Date().toISOString();

		const updatedUsage: GuestUsage = {
			count: usage.count + 1,
			firstUse:
				usage.count === 0 ? now : usage.firstUse,
			lastUse: now,
		};

		GuestUsageManager.saveUsage(updatedUsage);
		return updatedUsage;
	}

	/**
	 * Check if guest has reached usage limit
	 */
	static hasReachedLimit(): boolean {
		const usage = GuestUsageManager.getUsage();
		return usage.count >= MAX_GUEST_USES;
	}

	/**
	 * Get remaining uses for guest
	 */
	static getRemainingUses(): number {
		const usage = GuestUsageManager.getUsage();
		return Math.max(0, MAX_GUEST_USES - usage.count);
	}

	/**
	 * Reset guest usage (useful for testing or admin purposes)
	 */
	static resetUsage(): void {
		localStorage.removeItem(GUEST_USAGE_KEY);
	}

	/**
	 * Get maximum allowed uses for guests
	 */
	static getMaxUses(): number {
		return MAX_GUEST_USES;
	}

	/**
	 * Check if user can make another request
	 */
	static canMakeRequest(): boolean {
		return !GuestUsageManager.hasReachedLimit();
	}

	/**
	 * Get usage statistics for display
	 */
	static getUsageStats(): {
		used: number;
		remaining: number;
		total: number;
		percentage: number;
	} {
		const usage = GuestUsageManager.getUsage();
		const used = usage.count;
		const remaining =
			GuestUsageManager.getRemainingUses();
		const total = MAX_GUEST_USES;
		const percentage = Math.round((used / total) * 100);

		return {
			used,
			remaining,
			total,
			percentage,
		};
	}
}

export default GuestUsageManager;
