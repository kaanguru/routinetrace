import { observable } from "@legendapp/state";
import { syncedQuery } from "@legendapp/state/sync-plugins/tanstack-query";
import { QueryClient, QueryFunctionContext } from "@tanstack/react-query";
import { supabase } from "~/utils/supabase";
import { TaskFilter, TaskFormData } from "~/types";
import { Tables } from "~/database.types";

// 1. Initialize a single QueryClient to be used throughout the app
export const queryClient = new QueryClient();

// --- Query Functions ---

async function fetchTasksByFilter(
  context: QueryFunctionContext<[string, TaskFilter]>,
) {
  const [, filter] = context.queryKey;
  let query = supabase.from("tasks").select("*");

  if (filter === "completed") {
    query = query
      .eq("is_complete", true)
      .order("updated_at", { ascending: false });
  } else if (filter === "not-completed") {
    query = query.eq("is_complete", false);
  }

  const { data, error } = await query.order("position", {
    ascending: true,
    nullsFirst: true,
  });

  if (error) throw new Error(error.message);
  return data || [];
}

async function fetchChecklistItems(
  context: QueryFunctionContext<[string, number | string]>,
) {
  const [, taskID] = context.queryKey;
  if (!taskID) return [];
  const { data, error } = await supabase
    .from("checklistitems")
    .select("*")
    .eq("task_id", +taskID)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

async function fetchLastHealthAndHappiness(
  context: QueryFunctionContext<[string, string | undefined]>,
) {
  const [, user_id] = context.queryKey;
  if (!user_id) return null;

  const { data, error } = await supabase
    .from("health_and_happiness")
    .select("*")
    .eq("user_id", user_id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

// --- Synced Observables (for Queries) ---

export const tasks$ = (filter: TaskFilter = "not-completed") =>
  observable(
    syncedQuery({
      queryClient,
      query: {
        queryKey: ["tasks", filter],
        queryFn: fetchTasksByFilter,
      },
    }),
  );

export const checklistItems$ = (taskID: number | string) =>
  observable(
    syncedQuery({
      queryClient,
      query: {
        queryKey: ["checklistItems", taskID],
        queryFn: fetchChecklistItems,
        enabled: !!taskID,
      },
    }),
  );

export const healthAndHappiness$ = (user_id: string | undefined) =>
  observable(
    syncedQuery({
      queryClient,
      query: {
        queryKey: ["health-and-happiness", user_id],
        queryFn: fetchLastHealthAndHappiness,
        enabled: !!user_id,
      },
      persist: {
        name: "healthAndHappiness", // Add the missing name property
      },
    }),
  );

// --- Mutation Functions ---

// Task Mutations
export async function createTask(formData: Readonly<TaskFormData>) {
  // Generate a temporary ID for optimistic update
  const tempId = Date.now();
  const nowForCreation = new Date().toISOString();
  const newTask = {
    id: tempId,
    title: formData.title.trim(),
    notes: formData.notes.trim() || null,
    is_complete: false,
    pendingSync: true,
    position: null,
    created_at: nowForCreation,
    updated_at: nowForCreation,
  };

  // Optimistically update local state
  const filter = "not-completed";
  const tasksObservable = tasks$(filter);
  tasksObservable.set((prevTasks: any) => [...prevTasks, newTask]);

  try {
    // Attempt to sync with Supabase
    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .insert({
        title: newTask.title,
        notes: newTask.notes,
      })
      .select()
      .single();

    if (taskError) throw new Error("Failed to create task.");
    if (!taskData) throw new Error("No data returned after creating task.");

    // Update local task with real ID and remove pendingSync flag
    tasksObservable.set((prevTasks) =>
      prevTasks.map((task) =>
        task.id === tempId ? { ...taskData, pendingSync: false } : task,
      ),
    );

    // Handle checklist items if any
    if (formData.checklistItems.length > 0) {
      const checklistItems = formData.checklistItems.map((item, index) => ({
        task_id: taskData.id,
        content: item.content.trim(),
        position: index,
        is_complete: false,
      }));
      const { error: checklistError } = await supabase
        .from("checklistitems")
        .insert(checklistItems);
      if (checklistError) throw new Error("Failed to create checklist items.");
    }

    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    return taskData;
  } catch (error) {
    console.error("Task will be synced when online:", error);
    // Task remains in local state with pendingSync: true
    return newTask;
  }
}

export async function updateTask(updatedTask: Readonly<Tables<"tasks">>) {
  const { data, error } = await supabase
    .from("tasks")
    .update(updatedTask)
    .eq("id", updatedTask.id)
    .select()
    .single();
  if (error) throw new Error("Failed to update task.");
  await queryClient.invalidateQueries({ queryKey: ["tasks"] });
  if (data) {
    await queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    queryClient.setQueryData(["tasks", data.id], data);
  }
  return data;
}

export async function deleteTask(taskID: number | string) {
  const { error } = await supabase.from("tasks").delete().eq("id", +taskID);
  if (error) throw new Error("Failed to delete task.");
  await queryClient.invalidateQueries({ queryKey: ["tasks"] });
}

// Checklist Item Mutations
export async function addChecklistItem(
  taskID: number | string,
  content: string,
) {
  const { data, error } = await supabase
    .from("checklistitems")
    .insert({ content, task_id: +taskID })
    .select()
    .single();
  if (error) throw new Error(error.message);
  await queryClient.invalidateQueries({ queryKey: ["checklistItems", taskID] });
  return data;
}

// Health and Happiness Mutations
export async function upsertHealthAndHappiness(
  user_id: string | undefined,
  params: { health: number; happiness: number },
) {
  if (!user_id) throw new Error("User ID is required.");
  const { data, error } = await supabase
    .from("health_and_happiness")
    .upsert(
      {
        user_id: user_id,
        health: params.health,
        happiness: params.happiness,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) throw new Error("Failed to update health and happiness.");

  await queryClient.invalidateQueries({
    queryKey: ["health-and-happiness", user_id],
  });
  queryClient.setQueryData(["health-and-happiness", user_id], data);
  return data;
}
