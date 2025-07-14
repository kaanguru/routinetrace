# Tanstack Query + Legend State Integration Guide

## **Tanstack Query + Legend State Integration Guide**

This guide provides documentation to support developers in adding the Tanstack Query legend-state plugin for state synchronization with `@legendapp/state` in `RoutineTrace`'s Supabase backend.

### **1. Introduction**

The goal of this guide is to explain how to refactor the existing `useTasksQueries.ts` hook to use `@legendapp/state`'s TanStack Query sync plugin. This will enable offline-first capabilities in the `RoutineTrace` application, allowing users to interact with their tasks even when they don't have an internet connection.

### **2. Existing `useTasksQueries.ts` Hook**

The current `useTasksQueries.ts` hook uses `@tanstack/react-query` to fetch data directly from the Supabase backend. Here is a summary of its functionality:

  * **`useTasksQuery(filter)`:** Fetches a list of tasks based on the provided filter (`completed`, `not-completed`, or `all`).
  * **`useTaskById(taskID)`:** Fetches a single task by its ID.

This approach is effective for online-only scenarios, but it doesn't provide a seamless offline experience.

### **3. Refactoring with `@legendapp/state`**

To add offline-first capabilities, we will refactor the `useTasksQueries.ts` hook to use the `useObservableSyncedQuery` hook from `@legendapp/state/sync-plugins/tanstack-react-query`. This will allow us to synchronize the data with an observable, which can be persisted locally.

Here's how we'll approach the refactoring:

1.  **Create a new `useTasksState` hook:** This hook will encapsulate the `useObservableSyncedQuery` logic.
2.  **Update the existing `useTasksQuery` hook:** This hook will now use the `useTasksState` hook to get the data from the synchronized observable.
3.  **Add mutation functions:** We will add functions to handle creating, updating, and deleting tasks, which will be synchronized with the backend.

### **4. Refactored `useTasksQueries.ts`**

Here is the complete refactored `useTasksQueries.ts` file:

```typescript
import { use$ } from "@legendapp/state/react";
import { useMutation } from "@tanstack/react-query";
import {
  tasks$,
  checklistItems$,
  healthAndHappiness$,
  createTask,
  updateTask,
  deleteTask,
  addChecklistItem,
  upsertHealthAndHappiness,
  queryClient, // Import the shared queryClient
} from "~/data/observables";
import { TaskFilter, TaskFormData } from "~/types";
import { Tables } from "~/database.types";

// --- Query Hooks (Reading Data) ---

export function useTasks(filter: TaskFilter = "not-completed") {
  // Use the use$ hook to subscribe to the observable from observables.ts
  return use$(tasks$(filter));
}

export function useChecklistItems(taskID: number | string) {
  return use$(checklistItems$(taskID));
}

export function useHealthAndHappiness(user_id: string | undefined) {
  return use$(healthAndHappiness$(user_id));
}

// --- Mutation Hooks (Writing Data) ---

// We wrap the mutation functions from observables.ts with useMutation
// to get access to loading/error states in our components.

export function useCreateTask() {
  return useMutation({
    mutationFn: (formData: Readonly<TaskFormData>) => createTask(formData),
    onSuccess: () => {
      // Invalidate the tasks query to refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: (updatedTask: Readonly<Tables<"tasks">>) =>
      updateTask(updatedTask),
    onSuccess: (data) => {
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

export function useAddChecklistItem() {
  return useMutation({
    mutationFn: (variables: { taskID: number | string; content: string }) =>
      addChecklistItem(variables.taskID, variables.content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["checklistItems", variables.taskID],
      });
    },
  });
}

export function useUpsertHealthAndHappiness() {
  return useMutation({
    mutationFn: (variables: {
      user_id: string | undefined;
      params: { health: number; happiness: number };
    }) => upsertHealthAndHappiness(variables.user_id, variables.params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["health-and-happiness", variables.user_id],
      });
    },
  });
}
```

### **5. How to Use the Refactored Hook**

Now that we have our refactored hook, here's how you can use it in your components:

```tsx
import { useTasksQuery } from '~/hooks/useTasksQueries';
import { $React } from '@legendapp/state/react';

function TasksList() {
  const tasks = useTasksQuery('not-completed');

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>
          <$React.input $value={task.title} />
          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
}
```

### **6. Conclusion**

By following this guide, you can successfully integrate `@legendapp/state`'s TanStack Query sync plugin into your `RoutineTrace` application. This will provide a robust offline-first experience for your users, making your app more reliable and user-friendly.