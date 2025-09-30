import { HierarchyUser } from "@/server/userActions";

export interface Employee {
  name: string;
  image?: string;
  gender?: string;
  designation: string;
  children?: Employee[];
}

// Helper function to map HierarchyUser to Employee structure
export const mapEmployeeData = (employees: HierarchyUser[]): Employee[] => {
  return employees.map((employee) => ({
    name: `${employee.first_name?? "Default"} ${employee.last_name || ""}`, // Combine first name and last name if present
    image: employee.image ? employee.image:  employee?.gender === "Male"
    ? "https://api-files-connect-saas.s3.ap-south-1.amazonaws.com/uploads/1737012636473.png"
    : "https://api-files-connect-saas.s3.ap-south-1.amazonaws.com/uploads/1737012892650.png" , // Use email as profile or a default placeholder
    designation: employee.designation || "-", // Handle undefined designation
    gender: employee.gender,
    children: employee.reportees?.length
      ? mapEmployeeData(employee.reportees) // Recursively map reportees as children
      : [], // If no reportees, return an empty array
  }));
};
