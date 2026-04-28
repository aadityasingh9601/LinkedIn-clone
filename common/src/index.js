import * as z from "zod";

export const LoginDataSchema = z.object({
  email: z.email("Please enter a valid email!"),
  password: z
    .string()
    .min(6, "Must be atleast 8 characters")
    .max(12, "Must be atmost 16 characters"),
});
