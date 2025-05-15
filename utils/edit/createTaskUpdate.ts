// Helper function to create the task object for updates
import { Tables } from "~/database.types";
import { Task, TaskFormData } from "~/types";

export default function createTaskUpdate(
  formData: Readonly<TaskFormData>,
  theTask: Readonly<Task>,
  taskID: string,
): Task {
  return {
    id: +taskID,
    user_id: theTask.user_id,
    is_complete: theTask.is_complete,
    position: theTask.position,
    title: formData.title,
    notes: formData.notes,
    updated_at: new Date().toISOString(),
    repeat_period: formData.repeatPeriod || null,
    repeat_frequency: formData.repeatPeriod ? formData.repeatFrequency : null,
    repeat_on_wk: formData.repeatPeriod
      ? (formData.repeatOnWk as Tables<"tasks">["repeat_on_wk"])
      : null,
    created_at: formData.customStartDate?.toISOString() || theTask.created_at,
  };
}
