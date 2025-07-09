# Tanstack Query + Legend State Integration Guide

This directory provides documentation to support developers adding the Tanstack Query Library for state synchronization with @legendapp/state in `RoutineTrace`'s backend. The library facilitates synchronizing state with remote API's, such as our Supabase backend. Using legendState and Tanstack Query is a two-step process: initial setup, followed by implementation inside our React components. 

## Setup Guide

### Step 1: Environment Setup

1. Ensure you have installed the `@tanstack/react-query` library as a dependency
    ```
    npm i @tanstack/react-query
    ```
   or (for ReactNative applications):
    ```
    npm i @tanstack/react-native-query
    ```
2. Next, initialize the package by initializing the QueryClient, which you can configure once at application bootup. For the `RoutineTrace` project, the client initialization will be located in our `context` folder, in a new file: `DataSyncProvider.tsx`

    ```jsx
   // DataSyncProvider.tsx

    import React, { memo } from "react";
    import { QueryClient, QueryClientProvider } from "@tanstack/react-native-query";

    // Initialize the query client
    const queryClient = new QueryClient({
        defaultOptions: {
            // set up mutation/query defaults
            mutations: {
                retry: false
            },
            queries: {
                retry: 2
            }
        }
    });

    // DataSyncProvider component
    export const DataSyncProvider = ({children}) : React.FC => (
       <QueryClientProvider client={queryClient}>
           {children}
       </QueryClientProvider>
    );
    ```

3. Legendstate is configured separately. This guide explains how to integrate legend states with `tanstack-query` library. For the `RoutineTrace` project, the `legendStateConfig.ts` configuration file is stored in the `data` directory.

    ```jsx
    // legendStateConfig.ts

    import { observe, unsubscribable } from '@legendapp/state/react';
    import { observable } from '@legendapp/state';

    // Initialize the globalstate
    const globalState$ = observable({
        currentUser: { id: null, email: "", name: "" },
        userTasks: {
            overdueTasks: [],
            todayTasks: [],
            upcomingTasks: [],
            completedTasks: []
        },
        loading: false,
        error: null
    });

    // Note: Our ReactNative application uses AsyncStorage as the main global state management library (in combination with context)
    // LegendstateConfig.ts allows us to persist changes across sessions, through our backend's syncing of observables with remote updates, queries/mutations
    ```

### Step 2: Component Implementation

In our React application, in each component where we need to initialize the Legend QuerySync and mutation, we will use the `useObservableSyncedQuery` hook, and `useMutation` and `useQuery` hooks. In addition, we will use `use$` to start the sync and return the updated state of the `legendState` hook. Finally, we will bind the value to our hook when using forms, checkboxes or inputs.

```jsx
// In component
function CreateNewUser() {

    // Initialize the query state
    const userQuery = useObservableSyncedQuery({
        observableState$: global.currentUser$, // initialized with legend observable, in our legendStateConfig file
        query: {
            queryKey: ["new-user"],
            queryFunction: async () => {
                const response = await axios.get("url to backend/new")
               return response.data
            }
        },
        mutation: {
            mutationFn: async (variables) => {
                const response = await axios.post("url to backend/create-new-user", variables)
                return response.data
            }
        }
    });

    // Start the sync and return the updated state
    const state = use$(userQuery);

    // Example state updates 
    const handleSubmit = (variables) => {
        state.mutate.mutations.createNewUser({
            variables: variables
        });
        state.currentUser$.name = variables.username;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" 
                    value={state.currentUser.name}
                    onChange={(e) => state.currentUser$.name = e.target.value} />
               <button type="submit">Submit</button>
            </form>
        </div>
    )
}
```

## Full Example

For a working implementation example of the `RoutineTrace` application's `legendState` and Tanstack Query setup, as well as it's integration with our backend, see the `legend-state-tanstack-integration-demo.md` and `legend-state-tanstack-setup-config.md` files within this directory.