import { z } from "zod";

// Define validation schema using Zod
const userSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .min(1, "Password is required")
    .regex(/[A-Za-z][0-9]|[0-9][A-Za-z]/, {
      message: "Password must contain both letters and numbers",
    }),
});

export default userSchema;
