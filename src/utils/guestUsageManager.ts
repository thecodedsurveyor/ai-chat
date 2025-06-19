/**
 * Guest Usage Manager
 * Tracks and manages usage limits for non-authenticated users
 *
 * Features:
 * - Daily reset: Usage count resets at midnight local time
 * - 10 free messages per day for guest users
 * - Automatic cleanup and migration when users sign up
 */

const GUEST_USAGE_KEY = 'neuronflow_guest_usage';
const MAX_GUEST_USES = 10;

export interface GuestUsage {
	count: number;
	firstUse: string;
	lastUse: string;
	lastResetDate: string; // Track the last reset date for daily resets
}

export class GuestUsageManager {
	/**
	 * Get today's date string (YYYY-MM-DD format)
	 */
	static getTodayDateString(): string {
		return new Date().toISOString().split('T')[0];
	}

	/**
	 * Check if usage should be reset (new day)
	 */
	static shouldResetUsage(usage: GuestUsage): boolean {
		const today =
			GuestUsageManager.getTodayDateString();
		return usage.lastResetDate !== today;
	}

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
		const now = new Date().toISOString();
		return {
			count: 0,
			firstUse: now,
			lastUse: now,
			lastResetDate:
				GuestUsageManager.getTodayDateString(),
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
		let usage = GuestUsageManager.getUsage();
		const now = new Date().toISOString();
		const today =
			GuestUsageManager.getTodayDateString();

		// Reset usage if it's a new day
		if (GuestUsageManager.shouldResetUsage(usage)) {
			usage = {
				count: 0,
				firstUse: now,
				lastUse: now,
				lastResetDate: today,
			};
		}

		const updatedUsage: GuestUsage = {
			count: usage.count + 1,
			firstUse:
				usage.count === 0 ? now : usage.firstUse,
			lastUse: now,
			lastResetDate: today,
		};

		GuestUsageManager.saveUsage(updatedUsage);
		return updatedUsage;
	}

	/**
	 * Check if guest has reached usage limit
	 */
	static hasReachedLimit(): boolean {
		let usage = GuestUsageManager.getUsage();

		// Reset usage if it's a new day
		if (GuestUsageManager.shouldResetUsage(usage)) {
			GuestUsageManager.resetUsageForNewDay();
			usage = GuestUsageManager.getUsage();
		}

		return usage.count >= MAX_GUEST_USES;
	}

	/**
	 * Get remaining uses for guest
	 */
	static getRemainingUses(): number {
		let usage = GuestUsageManager.getUsage();

		// Reset usage if it's a new day
		if (GuestUsageManager.shouldResetUsage(usage)) {
			GuestUsageManager.resetUsageForNewDay();
			usage = GuestUsageManager.getUsage();
		}

		return Math.max(0, MAX_GUEST_USES - usage.count);
	}

	/**
	 * Reset guest usage for a new day
	 */
	static resetUsageForNewDay(): void {
		const now = new Date().toISOString();
		const today =
			GuestUsageManager.getTodayDateString();

		const resetUsage: GuestUsage = {
			count: 0,
			firstUse: now,
			lastUse: now,
			lastResetDate: today,
		};

		GuestUsageManager.saveUsage(resetUsage);
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
		resetsAt: string;
	} {
		let usage = GuestUsageManager.getUsage();

		// Reset usage if it's a new day
		if (GuestUsageManager.shouldResetUsage(usage)) {
			GuestUsageManager.resetUsageForNewDay();
			usage = GuestUsageManager.getUsage();
		}

		const used = usage.count;
		const remaining = Math.max(
			0,
			MAX_GUEST_USES - usage.count
		);
		const total = MAX_GUEST_USES;
		const percentage = Math.round((used / total) * 100);

		// Calculate when the usage resets (next midnight)
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);
		const resetsAt = tomorrow.toISOString();

		return {
			used,
			remaining,
			total,
			percentage,
			resetsAt,
		};
	}
}

export default GuestUsageManager;
