import { TaskFormData } from "@/types";

/**
 * Updates the content of a checklist item at a specific index. (Pure Function)
 */
export default function updateChecklistItemContentAtIndex(
  currentState: Readonly<TaskFormData>,
  index: number,
  content: string,
): TaskFormData {
  const updatedItems = currentState.checklistItems.map((item, i) =>
    i === index ? { ...item, content } : item,
  );
  return {
    ...currentState,
    checklistItems: updatedItems,
  };
}
