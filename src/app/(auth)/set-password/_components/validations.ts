import * as z from "zod";

export const setPasswordSchema = z
  .object({
    password: z.string().min(1, {
      message: "Please enter the password",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SetPasswordSchemaType = z.infer<typeof setPasswordSchema>;
