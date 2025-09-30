'use client';
import { useQueryState } from 'nuqs';
import { InputHTMLAttributes, useEffect } from 'react';

type SearchProps<T> = {
	data: T[];
	placeholder?: string; // Optional placeholder for the input
	onFiltered: (filteredData: T[]) => void; // Callback to return filtered data
	queryName: string;
	className?: string;
	searchAPI: (query: string) => Promise<T[]>;
} & InputHTMLAttributes<HTMLInputElement>;

export function SearchInput<T>({
	data,
	queryName,
	placeholder = 'Search...',
	className,
	onFiltered,
	searchAPI,
}: SearchProps<T>) {
	const [searchTerm, setSearchTerm] = useQueryState(queryName); // Use `nuqs` for query state

	useEffect(() => {
		if (searchTerm) {
			handleFilter(searchTerm);
		} else {
			onFiltered(data); // Reset if no search term
		}
	}, [searchTerm]);

	// Filter function based on the search input
	const handleFilter = async (search: string) => {
		const data = await searchAPI(search);
		onFiltered(data);
	};

	// Handle input change
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearchTerm(searchTerm); // Update URL query parameter
		handleFilter(searchTerm); // Filter immediately
	};

	return (
		<input
			type="text"
			value={searchTerm || ''}
			onChange={handleSearch}
			placeholder={placeholder}
			className={`p-2 rounded-md ring-2 ring-muted focus:ring-transparent ${className}`}
		/>
	);
}