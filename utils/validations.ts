import { TaskFormData } from "@/types";

export const validateTaskForm = (formData: TaskFormData): string | null => {
  if (!formData.title.trim()) return "Title is required";
  if (formData.checklistItems.some((item) => !item.content.trim())) {
    return "All checklist items must have content";
  }
  return null;
};
