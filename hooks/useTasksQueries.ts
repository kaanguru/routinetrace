import { useQuery } from "@tanstack/react-query";

import { Tables } from "~/database.types";
import { TaskFilter, Task } from "~/types";
import { supabase } from "~/utils/supabase";

export default function useTasksQuery(filter: TaskFilter = "not-completed") {
  return useQuery({
    queryKey: ["tasks", filter],
    queryFn: () => {
      if (filter === "completed") return fetchCompletedTasks();
      if (filter === "not-completed") return fetchNotCompletedTasks();
      return fetchAllTasks();
    },
  });
}
async function fetchNotCompletedTasks(): Promise<Tables<"tasks">[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("is_complete", false)
    .order("position", { ascending: true, nullsFirst: true });

  if (error) throw new Error(error.message);
  return data;
}

async function fetchCompletedTasks(): Promise<Tables<"tasks">[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("is_complete", true)
    .order("position", { ascending: true, nullsFirst: true })
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
async function fetchAllTasks(): Promise<Tables<"tasks">[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true, nullsFirst: true });

  if (error) throw new Error(error.message);
  return data;
}
export function useTaskById(taskID: string | number) {
  return useQuery<Task, Error>({
    queryKey: ["task", taskID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", +taskID)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!taskID, // Only run the query if taskID is truthy
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3, // Retry on failure up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with a max of 30 seconds
  });
}
