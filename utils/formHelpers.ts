import { TaskFormData } from "@/types";

export const getUpdatedFormData = (
  prevData: TaskFormData,
  updates: Partial<TaskFormData>,
) => ({
  ...prevData,
  ...updates,
});

export const getUpdatedChecklistItem = (
  items: TaskFormData["checklistItems"],
  index: number,
  content: string,
) =>
  items.toSpliced(index, 1, {
    ...items[index],
    content,
  });
