import { z } from "zod";

export const loginBodyDTO = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const loginSchema = z.object({
  body: loginBodyDTO,
});
