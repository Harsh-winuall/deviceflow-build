export const parseCSV = (
	csvText: string,
): { headers: string[]; data: any[] } => {
	const lines = csvText.trim().split('\n');
	const headers = lines[0].split(',').map((header) => header.trim());
	const data = lines.slice(1).map((line) => {
		const values = line.split(',').map((value) => value.trim());
		const entry: { [key: string]: string } = {};
		headers.forEach((header, index) => {
			entry[header] = values[index] || '';
		});
		return entry;
	});
	return { headers, data };
};

export const checkForDuplicates = (
	data: any[],
): { hasDuplicates: boolean; duplicateRows: number[] } => {
	const seen = new Set();
	const duplicates = new Set<number>();

	data.forEach((entry, rowIndex) => {
		const entryString = JSON.stringify(entry);
		if (seen.has(entryString)) {
			duplicates.add(rowIndex + 1);
		}
		seen.add(entryString);
	});

	return {
		hasDuplicates: duplicates.size > 0,
		duplicateRows: Array.from(duplicates),
	};
};
