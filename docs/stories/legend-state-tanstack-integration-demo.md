# Legend State + Tanstack Query Integration Demo

This document showcases how to use Legend State with Tanstack Query for state synchronization and data fetching. The following example demonstrates a basic integration setup.

```tsx
import React, { useCallback } from 'react';
import { useObservableSyncedQuery } from '@legendapp/state/sync-plugins/tanstack-react-query';
import { useQueryClient } from '@tanstack/react-query';
import { use, observable } from '@legendapp/state/react';
import { Button, View, Text } from 'react-native';
import { ok, err } from 'neverthrow';

// Define the initial state structure
const initialFormData = observable({
  title: "",
  notes: "",
  repeatPeriod: "",
  repeatFrequency: 1,
  repeatOnWk: [],
  customStartDate: null,
  isCustomStartDateEnabled: false,
  checklistItems: [],
});

export const CreateTaskWithLegendState: React.FC = () => {
  // Setup a new QueryClient using Tanstack Query
  const queryClient = useQueryClient();

  // Define the mutation in the synchronized query
  const taskFormState$ = useObservableSyncedQuery(
    // Configure the query parameters
    {
      queryKey: ['createTaskExample'],
      mutation: {
        mutationFn: async (formData) => {
          try {
            // Simulate an API call (replace with actual fetch call)
            const response = await new Promise((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    data: { message: 'Task created successfully' },
                    status: 201,
                  }),
                1000
              )
            );
            if (response.status === 201) {
              return ok(response.data.message);
            } else {
              throw new Error('Failed to create task');
            }
          } catch (error) {
            return err(new Error('Task creation failed'));
          }
        },
      },
    },
    initialFormData
  );

  // Effect to cleanup observable subscriptions
  useEffect(() => {
    return unsubscribe;
  }, [taskFormState$]);

  const unsubscribe = use$(useObservableSyncedQuery.useSubscribe(taskFormState$));

  // Handler using useCallback to submit the form
  const handleCreateTask = useCallback(() => {
    // Trigger the mutation from state
    taskFormState$.mutation.trigger(taskFormState$.peek());
  }, [taskFormState$]);

  console.log('----',taskFormState$.value)

  // Example UI
  return (
    <View>
      <Text>{'Title: ' + taskFormState$.title.get()}</Text>
      <Text>{'Repeat Frequency: ' + taskFormState$.repeatFrequency.get()}</Text>
      <Button title="Create Task" onPress={handleCreateTask} />
    </View>
  );
};

export default CreateTaskWithLegendState;
```

## Explanation

- **QueryClient Configuration**: Tanstack Query's `queryClient`.
- **useObservableSyncedQuery**: Syncs state and queries.
- **Observable State**: Wraps state in Legend's `observable` for reactivity.
- **MutationFn**: Handles async API calls; integrates Error handling via `ok`/`err`.
- **Mutation Trigger**: Mutation is invoked via `trigger`.
- **Subscription Cleanup**: Ensures subscriptions clear on unmount via `useEffect`.

This setup provides a reactive and state-managed form, enhancing UI updates through Legend State's reactivity system with Tanstack Query for asynchronous data management.
# Legend State + Tanstack Query Integration Demo

This document showcases how to use Legend State with Tanstack Query for state synchronization and data fetching. It follows the official documentation and provides an example of integrating state into a React component using the useObservableSyncedQuery hook.

## Prerequisites

Before starting, ensure these key parts of the stack are configured:
1. Tanstack Query configured globally in your React context (eg: DataSyncProvider)
2. Legend State observables available throughout the app
3. @legendapp/state/sync-plugins/tanstack-react-query package installed

## Example: Query + Mutations

```tsx
// Important imports:
import { useObservableSyncedQuery, Result, ok, err } from '@legendapp/state/sync-plugins/tanstack-react-query';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { use$, unsubscribable } from '@legendapp/state/react';
import React, { FunctionComponent } from 'react';
import { Button, TextInput, Text, View } from 'react-native';

// Note: These imports should map correctly to your specific package configurations

export const LegendStateTanstackComponent: FunctionComponent = () => {
    const queryClient = useQueryClient();
    const initialState$ = useObservableSyncedQuery({
        query: {
            queryKey: ['tasks'],
            queryFn: async () => {
                // Simulate data fetching - replace with real API calls
                // Consider error handling with 'ok' and 'err' from 'neverthrow'
                return fetch('https://your-api/tasks').then(v => v.json());
            },
            refetchOnWindowFocus: false, // Adjust as needed
            staleTime: 1000 * 10
        },
        mutation: {
            mutationFn: async (variables) => {
                // Replace with real backend calls
                // Could handle results as 'Result' type to mirror main app error handling
                return fetch('https://your-api/tasks', {
                    method: 'POST',
                    body: JSON.stringify(variables),
                    headers: { 'Content-Type': 'application/json' }
                }).then(r => r.json());
            }
        }
    });

    // Track subscription to cleanup
    const unsubscribe = use$(initialState$, { immediate: true });

    // Example reactivity - convert tasks to list items
    const getItems = (state) =>
        state?.data?.tasks?.map(task => <Text key={task.id}>{task.title}</Text>) || [];

    // Use Legend $state syntax to observe state changes
    const tasksList = unsubscribable(unsubscribe).get();

    return (
        <View style={{ padding: 20 }}>
            <TextInput 
                placeholder="New task description" 
                // Bind state via legend-state:
                value={tasksList.newTaskDescription} 
                onChangeText={v => tasksList.newTaskDescription.set(v)} 
            />
            <Button 
                title="Add"
                onPress={() => {
                    tasksList.mutate.mutations.addTask({
                        variables: {
                            description: tasksList.newTaskDescription.get()
                        },
                    }).then(result => {
                        // Replace with mutate callback logic if needed
                        if (result.isOk()) { 
                            tasksList.newTaskDescription.set('');
                        }
                    });
                }}
            />
            {getItems(tasksList)}
        </View>
    );
};
```

## Explanation:

### Query Setup
- The `queryKey` should follow your application's naming conventions
- Adjust caching behaviors with `staleTime` / `refetchOnWindowFocus` to match app specs

### Mutations
- Shows basic mutation creation and state reactivity
- Replace with actual API paths and handling logic using the same pattern

### State Observable
- Observes a synchronized collection of tasks that automatically refreshes
- Uses `.mutate.mutations` to directly access available mutation actions from the Legend structure

### Note on Real Implementation:
- Real components would likely connect to existing state nodes
- Legend State should be configured with proper error handling (using `neverthrow` types)
- Subscription cleanup might depend on specific app lifecycle methods
- Make sure to adapt to global hooks (useAuth, useTasks) where authentication state might affect API calls

### Legend State Gotchas:
- Double-check you have the latest version of @legendapp/state packages installed
- Ensure proper reactivity checks in components where state is dynamically updated

This documentation provides a working example to refer to for the development team and future project contributors.
# Legend State + Tanstack Query Integration Demo

This document showcases how to use Legend State with Tanstack Query for state synchronization and data fetching in ReactNative Expo. We'll create an example component that allows users to create a task and manage its properties using the combination of Legend State and Tanstack Query. This pattern includes:
1. Synchronizing and managing state with Legend State
2. Handling server communication with Tanstack Query
3. Combining both for a performant, reactive, and manageable state and fetching logic
   
```tsx
import React, { useCallback } from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import { observable, use$ } from '@legendapp/state/react';
import { ok, err } from 'neverthrow';
import { useObservableSyncedQuery } from '@legendapp/state/sync-plugins/tanstack-react-query';
import { useQueryClient } from '@tanstack/react-query';

// Define the initial state structure
const initialFormData = observable({
  title: "",
  notes: "",
  repeatPeriod: "",
  repeatFrequency: 1,
  repeatOnWk: [],
  customStartDate: null,
  isCustomStartDateEnabled: false,
  checklistItems: [],
});

export const CreateTaskWithLegendState: React.FC = () => {
  const queryClient = useQueryClient();
  const taskFormState$ = useObservableSyncedQuery(
    {
      queryKey: ['createTaskExample'],
      mutation: {
        mutationFn: async (formData: typeof initialFormData) => {
          try {
            // Simulate an API call (replace this with your real API call)
            const response = await new Promise((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    data: { message: 'Task created successfully' },
                    status: 201,
                  }),
                1000
              )
            );
            if (response.status === 201) {
              return ok(response.data.message);
            } else {
              throw new Error('Failed to create task');
            }
          } catch (error) {
            return err(new Error('Task creation failed'));
          }
        },
      },
    },
    initialFormData
  );

  const unsubscribe = use$(useObservableSyncedQuery.useSubscribe(taskFormState$));
  
  useEffect(() => {
    return unsubscribe;
  }, [taskFormState$]);

  const handleCreateTask = useCallback(() => {
    // Trigger the mutation with the current state
    taskFormState$.mutation.trigger(taskFormState$.peek());
  }, [taskFormState$]);

  console.log('----', taskFormState$.value)

  return (
    <View>
      <Text>{'Title: ' + taskFormState$.title.get()}</Text>
      <Text>{'Repeat Frequency: ' + taskFormState$.repeatFrequency.get()}</Text>
      <Button title="Create Task" onPress={handleCreateTask} />
      <TextInput
        value={taskFormState$.title.get()}
        placeholder="Title"
        onChangeText={(value) => {
          taskFormState$.title.set(value);
        }}
      />
      {/* Add any other UI necessary for form inputs */}
    </View>
  );
};

export default CreateTaskWithLegendState;
```

## Explanation

### QueryClient Configuration
This example demonstrates a form for the create task page in RoutineTrace, integrating Legend State and Tanstack Query:
- **Legend State**: Using observable state for the task's properties.
- **Tanstack Query**: Using the sync-plugin to synchronize state changes and handle mutations via the backend.
- **Combined Logic**: The mutation allows for state synchronization and updating the backend simultaneously.

### Example UI
- Demonstrates a simple UI showcasing the current state.
- You can bind individual form elements by utilizing Legend's observability, e.g., `taskFormState$.title.get()` and setting values through the `set`.
  
This setup provides a reactive and state-managed form that uses Legend State for reactive state management and Tanstack Query for server communication.

Please run `npx context7 'docs/stories/legend-state-tanstack-integration-demo.md'` to generate the final implementation in create-task.tsx.