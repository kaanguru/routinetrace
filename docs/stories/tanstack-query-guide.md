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
import { useObservableSyncedQuery } from '@legendapp/state/sync-plugins/tanstack-react-query';
import { useQueryClient } from '@tanstack/react-query';
import { use$ } from '@legendapp/state/react';

import { Tables } from '~/database.types';
import { TaskFilter, Task } from '~/types';
import { supabase } from '~/utils/supabase';

// The new useTasksState hook
export function useTasksState(filter: TaskFilter = 'not-completed') {
  const queryClient = useQueryClient();

  const state$ = useObservableSyncedQuery<Tables<'tasks'>[]>({
    queryClient,
    query: {
      queryKey: ['tasks', filter],
      queryFn: async () => {
        if (filter === 'completed') return fetchCompletedTasks();
        if (filter === 'not-completed') return fetchNotCompletedTasks();
        return fetchAllTasks();
      },
    },
    mutation: {
      mutationFn: async (variables: Partial<Task> & { id: number }) => {
        const { error } = await supabase
          .from('tasks')
          .update(variables)
          .eq('id', variables.id);

        if (error) throw new Error(error.message);
        return variables;
      },
    },
  });

  return state$;
}

// The updated useTasksQuery hook
export default function useTasksQuery(filter: TaskFilter = 'not-completed') {
  const state$ = useTasksState(filter);
  return use$(state$);
}

// The rest of the functions remain the same
async function fetchNotCompletedTasks(): Promise<Tables<'tasks'>[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('is_complete', false)
    .order('position', { ascending: true, nullsFirst: true });

  if (error) throw new Error(error.message);
  return data;
}

async function fetchCompletedTasks(): Promise<Tables<'tasks'>[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('is_complete', true)
    .order('position', { ascending: true, nullsFirst: true })
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

async function fetchAllTasks(): Promise<Tables<'tasks'>[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('position', { ascending: true, nullsFirst: true });

  if (error) throw new Error(error.message);
  return data;
}

export function useTaskById(taskID: string | number) {
  // This hook can also be refactored to use useObservableSyncedQuery
  // for offline support of individual tasks.
  const state$ = useObservableSyncedQuery<Task>({
    queryKey: ['task', taskID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', +taskID)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!taskID,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return use$(state$);
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