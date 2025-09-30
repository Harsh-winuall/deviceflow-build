import * as z from "zod";

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

export const userFormOneSchema = z.object({
  first_name: z.string().min(1, "Full Name required"),
  email: z.string().email().min(1, "Email is required"),
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),
  dob: z.date({ required_error: "Date of Birth is required" }).optional(),

  gender: z.string().min(1, "Gender is required").optional(),
});

export type UserFormOneType = z.infer<typeof userFormOneSchema>;

export const userFormTwoSchema = z.object({
  designation: z.string().min(1, "Designation required").optional(),
  emp_id: z.string().optional(),
  onboarding_date: z
    .date({ required_error: "Joining date is required" })
    .optional(),
  employment_type: z
    .string({ required_error: "Employment Type is required" })
    .min(1, "Employment Type is required"),
  reporting_manager: z.string().optional(),
  reporting_manager_id: z.string().optional(),
  asset: z.string().optional(),
  asset_id: z.string().optional(),
  team: z.string().optional(),
  team_id: z.string().optional(),
});

export type UserFormTwoType = z.infer<typeof userFormTwoSchema>;
