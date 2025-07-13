# **5. Data and Component Architecture**

- **Client-Side Data Models**: We will use Legend-State **observables** (e.g., `tasks$`, `healthAndHappiness$`,`checkListItems$`, `taskCompletionHistory$`) that mirror the Supabase database schema. These client-side observables will be the single source of truth for the UI.
    
- **`DataSyncProvider` Component**: A high-level component will be created to wrap the application, responsible for initializing Legend-State, configuring the persistence and Supabase sync plugins, and handling the initial data load. context/DataSyncProvider.tsx
    
- **Custom Hooks (e.g., `useTasks`)**: This is a key pattern. We will create custom hooks to provide a clean API for UI components. These hooks will encapsulate all logic for interacting with the Legend-State observables (e.g., `addTask()`, `getTasksForToday()`), completely abstracting the data layer from the UI.

### **Custom Hook Example: useTasks**
In this hook, `tasks$` is bound with Legend-State's TanStack Query sync plugin. By using `useObservableSyncedQuery`, we leverage all the Query parameters and automatically update our observable. This hook fetches the tasks from the API.

```typescript
// hooks/useTasks.ts
import { useObservableSyncedQuery } from '@legendapp/state/sync-plugins/tanstack-react-query';
import { useQueryClient } from '@tanstack/react-query';
import { tasks$ } from '../data/observables';

export function useTasks() {
    const queryClient = useQueryClient();
    const tasks = useObservableSyncedQuery({
        queryClient, // Ensure we have the proper React Query client setup here
        query: {
            queryKey: ['tasks'],
            queryFn: async () => {
                const { data: tasks, error } = await supabase
                  .from('tasks')
                  .select('*')
                  .order('position', { ascending: true, nullsFirst: true });
                    
                if (error) throw new Error(`Error fetching tasks: ${error.message}`);
                return tasks;
            },
        },
        staleTime: 300000, // 5 minutes of caching
        gcTime: 259200000, // 3 days before garbage-collection
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 3, // Retry on failure up to 3 times
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with a max of 30 seconds
    });

    return tasks; // Return the observable to be used by components
}
```

**Component Interaction Diagram:**

```mermaid

graph TD
    subgraph Data Layer
        A[Supabase DB] <--> B(Legend-State Sync Engine);
        A --> C(Supabase JS SDK);
        B --> D(TanStack React-Query);
        B --> E(Legend-State Observables);
    end

    subgraph Application Layer
        F(UI Components) --> G(Custom Hooks);
        G --> B;
        G --> E;
        G --> A;
        F --> H(Legend-State Observables Subscription);
    end
