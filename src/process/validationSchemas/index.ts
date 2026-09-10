import { z } from "zod";

const signUpSchema = z
  .object({
    confirmPassword: z.string(),
    email: z.email("invalidEmail"),
    password: z.string(),
    username: z.string().min(5, "min5Chars"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsWontMatch",
    path: ["confirmPassword"],
  });

const signInSchema = z.object({
  password: z.string(),
  username: z.string().min(5, "min5Chars"),
});

export { signInSchema, signUpSchema };
