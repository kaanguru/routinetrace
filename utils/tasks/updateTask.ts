import { supabase } from "../supabase";

import { Task } from "~/types";

export default async function updateTask(
  taskID: Task["id"],
  updates: Readonly<Partial<Task>>,
) {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskID)
    .select();

  if (error) {
    console.error("Error updating task:", error);
    return null; // Return null on error instead of throwing
  }

  return data?.[0] || null; // Handle potential null or undefined data
}
