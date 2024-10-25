import { z } from "zod";

export const usernameValidation = z.string().trim().min(4, "Username must be atleast 4 characters").max(10, "Username should be no more than 10 characters").regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(8, { message: "Password must be atleast 8 characters" })
})