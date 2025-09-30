import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const reqOtpSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
});

export type RequestOTPSchemaType = z.infer<typeof reqOtpSchema>;

export const resetPassSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    "new-password": z.string().min(6, "Password must be at least 6 characters"),
    "confirm-password": z.string(),
  })
  .refine((data) => data["new-password"] === data["confirm-password"], {
    message: "Passwords do not match",
    path: ["confirm-password"],
  });

export type ResetPassSchemaType = z.infer<typeof resetPassSchema>;
