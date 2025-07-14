# Epic 1: Offline Task CRUD

## Status
Approved

## Story
**As a** user,
**I want** to create, view, modify, and delete my tasks seamlessly,
**so that** I can manage my routines effectively whether I have an internet connection or not.

## Acceptance Criteria
### Create (Offline-First)
1.  The application allows users to create new tasks with a title and notes while offline.
2.  Newly created tasks are immediately visible locally.

### Read (Offline-First)
3.  Users can view a list of their created tasks while offline.
4.  The task list accurately reflects all locally stored tasks.

### Update (Offline-First)
5.  Users can modify existing tasks (e.g., edit title, notes, mark complete) while offline.
6.  Modifications are immediately reflected locally.

### Delete (Offline-First)
7.  Users can delete tasks while offline.
8.  Deleted tasks are immediately removed from the local view.

### Synchronization (for all CRUD operations)
9.  All offline-made changes (create, update, delete) are stored locally using Legend-State.
10. All local offline changes are automatically synchronized with the Supabase backend when an internet connection becomes available.
11. The application provides clear feedback on synchronization status (e.g., pending sync, synced).

## Refactoring Plan

## Tasks / Subtasks
- [ ] **Task 1**: Refactor Data Hooks
    - [ ] Consolidate hooks/useTasksQueries.ts and hooks/useTasksMutations.ts into a single hooks/useTasks.ts file.
    - [ ]  Refactor the new useTasks.ts to use the tasks$ observable from data/observables.ts.
    - [ ]  Create and export new mutation hooks (useCreateTask, useUpdateTask, useDeleteTask) from hooks/useTasks.ts.
    - [ ]  Repeat the consolidation process for checklist and health-and-happiness hooks into hooks/useChecklist.ts and hooks/useHealthAndHappiness.ts respectively.
- [ ]  **Task 2**: Implement Offline Task Creation (AC: 1, 2, 9, 10)
    - [ ]  Update the task creation form in app/(tasks)/create-task.tsx to use the new useCreateTask mutation hook.
    - [ ]  Ensure the createTask mutation function in data/observables.ts optimistically updates the local tasks$ observable upon mutation.
    - [ ]  Verify that a newly created task is immediately visible in the task list on app/(drawer)/index.tsx even when offline.

- [ ] **Task 3** : Implement Offline Task Reading/Viewing (AC: 3, 4)
    - [ ]  Ensure all components displaying task data, like app/(drawer)/index.tsx, use the useTasks hook to subscribe to the tasks$ observable.
    - [ ]  Verify that the UI reactively updates when the local data in tasks$ changes.
- [ ]  **Task 4**: Implement Offline Task Updating (AC: 5, 6, 9, 10)
    - [ ]  Update the task editing form in app/(tasks)/edit/[id].tsx to use the new useUpdateTask mutation hook.
    - [ ]  Ensure the updateTask mutation function in data/observables.ts optimistically updates the local tasks$ observable.
    - [ ]  Verify that any modifications to a task are immediately reflected in the UI.
- [ ]  **Task 5**: Implement Offline Task Deletion (AC: 7, 8, 9, 10)
    - [ ]  Add the UI elements (e.g., a delete button) for task deletion.
    - [ ]  Connect the delete functionality to the useDeleteTask mutation hook.
    - [ ]  Ensure the deleteTask mutation function in data/observables.ts optimistically removes the task from the local tasks$ observable.
    - [ ]  Verify that a deleted task is immediately removed from the task list view.
- [ ]  **Task 6**: Implement Synchronization Status Feedback (AC: 11)
    - [ ]  Create a new reusable UI component to display synchronization status (e.g., a sync icon, a toast notification).
    - [ ]  Integrate this component into the main task list view.
    - [ ]  Use the status flags provided by the useMutation hooks (isPending, isSuccess, isError) to drive the display of the sync status component.
- [ ]  **Task 7**: Update Component Integrations
    - [ ]  Audit the codebase and update all components that were using the old query and mutation hooks to use the new consolidated hooks (useTasks, useChecklist, useHealthAndHappiness).
- [ ]  **Task 8:** Implement Comprehensive Testing
    - [ ]  Write unit tests for the new hooks in hooks/useTasks.ts to ensure they correctly interact with the observables.
    - [ ]  Write unit tests for the mutation functions in data/observables.ts to verify optimistic updates.
    - [ ]  Create integration tests that simulate offline CRUD operations and verify that the UI updates correctly and that data is synced upon reconnection.

## Dev Notes
- **Data Models**: The core entity is `Task`, which will correspond to a `tasks` table in the Supabase PostgreSQL database. Type definitions for database interactions are in `database.types.ts`.
- **API Specifications**: All database interactions will use the Supabase JavaScript Client. 
- **Component Specifications**:
    - Task creation form: `app/(tasks)/create-task.tsx`.
    - Task list display: `app/(drawer)/index.tsx`.
    - Task editing form: `app/(tasks)/edit/[id].tsx`.
- **Current File Locations**:
    - Global state and observables: `data/observables.ts`.
    - Legend State configuration: `data/legendStateConfig.ts`.
    - Supabase client initialization: `utils/supabase.ts`.
    - Task-related mutations: `hooks/useTasksMutations.ts`.
    - Task-related queries: `hooks/useTasksQueries.ts`.
    - Error handling utility: `utils/errorHandler.ts`.
- **Testing Requirements**:
    - Unit tests are required for components and utility functions.
    - Integration tests should cover the full lifecycle of creating, viewing, and modifying tasks, including offline persistence and online synchronization.
    - Adhere to the functional programming paradigm and immutability.
    - Use `neverthrow` (Result, ResultAsync) for operational success/failure modeling.
- **Technical Constraints**:
    - React Native + Expo, TypeScript are mandatory.
    - UI components must use React Native Elements (`@rneui/themed`).
    - Legend-State is the primary client-side state management solution.
    - TanStack Query sync plugin for Legend State is crucial for offline synchronization.

Yes, you should refactor those files.

Just like we refactored `useTasksQueries.ts`, the custom hooks for checklists and health/happiness should also be updated to consume the observables from `observables.ts`. This will ensure your entire application's data layer is consistent, reactive, and ready for offline-first functionality.

### **Refactoring Plan**

Here's how you can refactor the remaining hooks:

#### 1\. `hooks/useCheckListQueries.ts` and `hooks/useCheckListMutations.ts`

These two files can be combined into a single, more streamlined `hooks/useChecklist.ts`.

**`hooks/useChecklist.ts` (Refactored)**

```typescript
import { use$ } from "@legendapp/state/react";
import { useMutation } from "@tanstack/react-query";
import {
  checklistItems$,
  addChecklistItem,
  // Assuming you create mutation functions for these in observables.ts
  // updateChecklistItem,
  // deleteChecklistItem,
  queryClient,
} from "~/data/observables";

// --- Query Hook ---
export function useChecklist(taskID: number | string) {
  return use$(checklistItems$(taskID));
}

// --- Mutation Hooks ---

export function useAddChecklistItem(taskID: number | string) {
  return useMutation({
    mutationFn: (content: string) => addChecklistItem(taskID, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistItems", taskID] });
    },
  });
}

/*
// Example for other mutations
export function useUpdateChecklistItem(taskID: number | string) {
  return useMutation({
    mutationFn: (item: { id: number; content: string; is_complete: boolean }) =>
      updateChecklistItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklistItems", taskID] });
    },
  });
}
*/
```

#### 2\. `hooks/useHealthAndHappinessQueries.ts` and `hooks/useHealthAndHappinessMutations.ts`

these can be merged into a single `hooks/useHealthAndHappiness.ts`.

**`hooks/useHealthAndHappiness.ts` (Refactored)**

```typescript
import { use$ } from "@legendapp/state/react";
import { useMutation } from "@tanstack/react-query";
import {
  healthAndHappiness$,
  upsertHealthAndHappiness,
  queryClient,
} from "~/data/observables";

// --- Query Hook ---
export function useHealthAndHappiness(user_id: string | undefined) {
  return use$(healthAndHappiness$(user_id));
}

// --- Mutation Hook ---
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
#### 3.useTasks.ts hook
hooks/useTasksQueries.ts and hooks/useTasksMutations.ts are already refactored into a single, consolidated hooks/useTasks.ts."


## Non-Functional Requirements
The local state should be persisted and survive an application restart.

