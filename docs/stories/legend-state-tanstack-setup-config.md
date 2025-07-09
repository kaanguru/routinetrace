# Legend State + Tanstack Query Setup Configuration

This document provides detailed setup instructions for integrating Legend State with Tanstack Query in your project, focusing on configuration specifics not covered in the demonstration examples.

## Project-Wide Configuration

### Legend State Integration

Ensure Legend State is properly initialized in your project. Create a `legendStateConfig.ts` entry point that sets up global state management:

```tsx
// src/data/legendStateConfig.ts
import { observe, unsubscribable } from '@legendapp/state/react';
import { ResultAsync } from 'neverthrow';

const globalState$ = observable({
  currentUser: { id: null, email: '', name: '' },
  tasks: [],
  loading: false,
  error: null
});

// Consider exposing getters and setters safely
// For read-only aspects like user info:
export const currentUser$ = globalState$.currentUser;

// For complex mutations, wrap in ResultAsync:
export async function updateUserName(newName: string): Promise<ResultAsync<void, Error>> {
  // Handle API logic here
  try {
    // Simulate success case
    // await api.updateProfile({ name: newName });
    globalState$.currentUser.name.set(newName);
    return okAsync(undefined);
  } catch (e) {
    return errAsync(e);
  }
};
```

### Tanstack Query Configuration

Initialize the Tanstack Query client in your React Native context. Ensure proper network caching for Expo:

1. **Add required packages (already added)**:
   ```sh
   pnpm add @tanstack/react-query
   ```

2. **Configure QueryClient in a dedicated provider**:
```tsx
// src/context/DataSyncProvider.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Expose globally if needed for LegendState
export const queryClient = new QueryClient({
  defaultOptions: {
    // Handle server clock discrepancies in Expo projects
    queries: {
      staleTime: 1000 * 5, // 5s
      cacheTime: 1000 * 60 * 15, //15 mins
      refetchOnWindowFocus: false, // ReactNative doesn't have windows
      retry: false // Use global handlers instead
    }
  }
});

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

### Database Integration

Ensure proper async storage configuration for global state persistence via AsyncStorage/MMKV:

1. **Install required packages**:
   ```sh
   pnpm add @react-native-async-storage/async-storage
   ```

2. **Configure state persistence at app startup**:
```ts
// src/data/persistentState.ts
import { globalState$, currentUser$ } from './legendStateConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initializeGlobalState = () => {
  AsyncStorage.getItem('currentUser')
    .then(data => {
      if (data) {
        const parsedData = JSON.parse(data);
        currentUser$.id.set(parsedData.id);
        globalState$.currentUser.set(parsedData);
      }
    }).catch(err => {
      console.error('Failed to initialize app state:', err);
    });
};
```

## Exposing to Components

### Legend Integration

Ensure access to Legend State through React Context or direct imports, using hooks like `use$` and proper cleanup:

Example component setup:

```tsx
import { currentUser$, globalState$, updateUserName } from '../data/legendStateConfig';
import { use$ } from '@legendapp/state/react';

export function UserNameEditor() {
  const user = use$(currentUser$);
  const [userName, setUserName] = React.useState(user.name.get());

  const saveUserName = async () => {
    const result = await updateUserName(userName);
    if (result.isOk()) {
      // Handle success
    } else {
      console.error('Error updating name');
    }
  };

  return (
    <View>
      <TextInput value={userName} onChangeText={setUserName} />
      <Button title="Update" onPress={saveUserName} />
    </View>
  );
};
```



---

This configuration documentation provides the essential setup patterns needed to establish Legend State integration alongside Tanstack Query when building cross-platform applications with Expo/React Native. Adapt to your project's backend architecture, database connections (like Supabase), and UI component structure as needed.