import { z } from "zod";

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string(),
});

export default taskFormSchema;
