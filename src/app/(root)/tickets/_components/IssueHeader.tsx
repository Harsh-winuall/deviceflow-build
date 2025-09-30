import { Input } from '@/components/wind/Input';
import React from 'react';

type searchType = {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

function IssueHeader({ searchTerm, setSearchTerm }: searchType) {
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	return (
		<div className="py-6">
			<Input
				placeholder="Search by status, email, or serial number"
				onChange={handleSearch}
				value={searchTerm}
			/>
		</div>
	);
}

export default IssueHeader;
