import { use$ } from "@legendapp/state/react";
import { useMutation } from "@tanstack/react-query";
import {
  tasks$,
  createTask,
  updateTask,
  deleteTask,
  queryClient, // Import the shared queryClient from observables
} from "~/data/observables";
import { TaskFilter, TaskFormData } from "~/types";
import { Tables } from "~/database.types";

// --- Query Hook (Reading Data) ---

export function useTasks(filter: TaskFilter = "not-completed") {
  // Simply subscribe to the observable from observables.ts
  return use$(tasks$(filter));
}

// --- Mutation Hooks (Writing Data) ---

export function useCreateTask() {
  return useMutation({
    mutationFn: (formData: Readonly<TaskFormData>) => createTask(formData),
    onSuccess: () => {
      // Invalidate the tasks query to refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    // You can add onError, onMutate, etc. callbacks here if needed
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: (updatedTask: Readonly<Tables<"tasks">>) =>
      updateTask(updatedTask),
    onSuccess: (data) => {
      // Invalidate both the list and the specific task queries
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["task", data.id] });
      }
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: (taskID: number | string) => deleteTask(taskID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
