import { useState, useMemo } from 'react';
import type {
	UserAnalytics,
	FeatureFlag,
} from '../types/admin';

interface UseSearchAndFilterResult<T> {
	filteredData: T[];
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	sortBy: string;
	setSortBy: (sort: string) => void;
	filterBy: Record<string, string>;
	updateFilter: (key: string, value: string) => void;
	clearFilters: () => void;
	hasActiveFilters: boolean;
	totalItems: number;
	filteredItems: number;
}

const useSearchAndFilter = <
	T extends Record<string, unknown>
>(
	data: T[],
	searchFields: string[] = [],
	initialSort: string = ''
): UseSearchAndFilterResult<T> => {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState(initialSort);
	const [filterBy, setFilterBy] = useState<
		Record<string, string>
	>({});

	const filteredAndSortedData = useMemo(() => {
		let result = [...data];

		// Apply search filter
		if (searchTerm && searchFields.length > 0) {
			const lowercaseSearch =
				searchTerm.toLowerCase();
			result = result.filter((item) =>
				searchFields.some((field) => {
					const value = item[field];
					if (typeof value === 'string') {
						return value
							.toLowerCase()
							.includes(lowercaseSearch);
					}
					if (typeof value === 'number') {
						return value
							.toString()
							.includes(lowercaseSearch);
					}
					return false;
				})
			);
		}

		// Apply category filter for feature flags
		if (
			filterBy.category &&
			filterBy.category !== 'all'
		) {
			result = result.filter((item) => {
				const category = item.category as string;
				return category === filterBy.category;
			});
		}

		// Apply status filter for users
		if (filterBy.status && filterBy.status !== 'all') {
			result = result.filter((item) => {
				const status = item.status as string;
				return status === filterBy.status;
			});
		}

		// Apply enabled filter for flags
		if (
			filterBy.enabled &&
			filterBy.enabled !== 'all'
		) {
			result = result.filter((item) => {
				const enabled = item.enabled as boolean;
				return (
					enabled ===
					(filterBy.enabled === 'enabled')
				);
			});
		}

		// Apply sorting
		if (sortBy) {
			result.sort((a, b) => {
				const aValue = a[sortBy];
				const bValue = b[sortBy];

				// Handle strings
				if (
					typeof aValue === 'string' &&
					typeof bValue === 'string'
				) {
					return aValue.localeCompare(bValue);
				}

				// Handle numbers
				if (
					typeof aValue === 'number' &&
					typeof bValue === 'number'
				) {
					return bValue - aValue; // Descending order
				}

				// Handle dates
				if (
					typeof aValue === 'string' &&
					typeof bValue === 'string'
				) {
					const dateA = new Date(aValue);
					const dateB = new Date(bValue);
					if (
						!isNaN(dateA.getTime()) &&
						!isNaN(dateB.getTime())
					) {
						return (
							dateB.getTime() -
							dateA.getTime()
						); // Newest first
					}
				}

				return 0;
			});
		}

		return result;
	}, [data, searchTerm, sortBy, filterBy, searchFields]);

	const updateFilter = (key: string, value: string) => {
		setFilterBy((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const clearFilters = () => {
		setSearchTerm('');
		setSortBy(initialSort);
		setFilterBy({});
	};

	const hasActiveFilters = useMemo(() => {
		return (
			searchTerm !== '' ||
			sortBy !== initialSort ||
			Object.keys(filterBy).some(
				(key) =>
					filterBy[key] !== 'all' &&
					filterBy[key] !== ''
			)
		);
	}, [searchTerm, sortBy, filterBy, initialSort]);

	return {
		filteredData: filteredAndSortedData,
		searchTerm,
		setSearchTerm,
		sortBy,
		setSortBy,
		filterBy,
		updateFilter,
		clearFilters,
		hasActiveFilters,
		totalItems: data.length,
		filteredItems: filteredAndSortedData.length,
	};
};

// Type-safe hooks for admin data
export const useUserSearch = (users: UserAnalytics[]) => {
	return useSearchAndFilter(
		users as unknown as Record<string, unknown>[],
		['firstName', 'lastName', 'email'],
		'createdAt'
	);
};

export const useFeatureFlagSearch = (
	flags: FeatureFlag[]
) => {
	return useSearchAndFilter(
		flags as unknown as Record<string, unknown>[],
		['name', 'description'],
		'lastModified'
	);
};

export default useSearchAndFilter;
