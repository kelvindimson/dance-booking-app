import { object, string, z } from "zod"
 
export const signInSchema = object({
  email: string({ required_error: "Email is required" }),
    // .min(1, "Email is required")
    // .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    // .min(1, "Password is required")
    // .min(8, "Password must be more than 8 characters")
    // .max(32, "Password must be less than 32 characters"),
})

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
  name: z.string() 
  // username: z.string().min(2, "Name must be at least 2 characters"),
})