import { z } from "zod";

// Define validation schema using Zod
const passSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .min(1, "Password is required")
    .regex(/[A-Za-z][0-9]|[0-9][A-Za-z]/, {
      message: "Password must contain both letters and numbers",
    }),
});

export default passSchema;
