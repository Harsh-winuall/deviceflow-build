// utils.ts
import { Employee } from './data';


export const mapEmployeeToRawNodeDatum: any = (
	employee: Employee,
	level = 0,
	maxInitialLevel = 1,
) => ({
	name: employee.name,
	image: employee.image,
	gender: employee.gender,
	attributes: {
		designation: employee.designation,
		childrenCount: employee.children?.length || 0,
	},
	children:
		level < maxInitialLevel
			? employee.children?.map((child) =>
					mapEmployeeToRawNodeDatum(child, level + 1, maxInitialLevel),
			  )
			: undefined,
});

export const countTotalEmployees = (employee: Employee): number => {
	if (!employee.children || employee.children.length === 0) return 0;

	return employee.children.reduce(
		(total, child) => total + 1 + countTotalEmployees(child),
		0,
	);
};

export const findOriginalNode = (node: any, name: string): any => {
	if (node.name === name) return node;
	if (node.children) {
		for (const child of node.children) {
			const found = findOriginalNode(child, name);
			if (found) return found;
		}
	}
	return null;
};


export const nodeStyles = {
	links: {
		stroke: '#D7D7D7', // Set the branch color  // Adjust branch thickness if needed
	},
};

