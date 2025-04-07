import { z } from "zod";

export const signupBodyDTO = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(3, "Username must be at least 3 characters"),
});

export const signupSchema = z.object({
  body: signupBodyDTO,
});
