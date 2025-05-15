import { Task } from "~/types";
import { supabase } from "~/utils/supabase";

export default async function postTask(
  task: Readonly<Omit<Task, "id" | "created_at" | "updated_at" | "position">>,
) {
  const { data, error } = await supabase.from("tasks").insert([task]).select();
  return data;
}
