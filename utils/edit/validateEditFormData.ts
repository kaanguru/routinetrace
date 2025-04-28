import { TaskFormData } from "@/types";
import { err, ok, Result } from "neverthrow";

/**
 * Validates the TaskFormData. (Pure Function)
 * Returns Ok(void) if valid, Err(Error) if invalid.
 */
export default function validateEditFormData(
  formData: Readonly<TaskFormData>
): Result<void, Error> {
  if (!formData.title.trim()) {
    return err(new Error("Task title cannot be empty"));
  }
  // Add other validation rules as needed (e.g., repeatOnWk if Weekly)
  if (formData.repeatPeriod === "Weekly" && formData.repeatOnWk.length === 0) {
    return err(
      new Error("Please select at least one day to repeat on for weekly tasks.")
    );
  }
  return ok(undefined);
}
