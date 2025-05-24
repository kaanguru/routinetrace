import { z } from "zod";
import userSchema from "./userSchema";

const registrationSchema = userSchema
  .extend({
    confirm_password: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default registrationSchema;
