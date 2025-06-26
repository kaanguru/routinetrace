# System Patterns: RoutineTrace

## System Architecture Overview

RoutineTrace is a mobile application built with ReactNative Expo, targeting Android. It follows a client-server architecture where the mobile app is the client and Supabase provides the backend services (database and authentication).

```mermaid
graph TD
    User[User] -- Interacts with --> MobileApp[ReactNative Expo App]
    MobileApp -- API Calls --> Supabase[Supabase Backend]
    Supabase -- Stores/Retrieves Data --> DB[(Supabase PostgreSQL DB)]
    Supabase -- Manages Auth --> Auth[Supabase Auth]

    subgraph MobileApp
        direction LR
        UI[UI Layer (React Native Elements)]
        Logic[App Logic (React Components, Hooks)]
        State[State Management (TanStack Query, AsyncStorage, Context)]
        Nav[Navigation (Expo Router)]
    end

    UI --> Logic
    Logic --> State
    State --> Nav
    Logic -- Uses --> SupabaseJS[Supabase JS Client]
    SupabaseJS --> Supabase
```

## Key Technical Decisions & Design Patterns

1.  **Functional Paradigm:**

    - All components and hooks are to be implemented as functions.
    - Emphasis on pure functions where possible (use `function` keyword). Helper pure functions should be at the end of the file.
    - Avoid side effects in rendering logic; manage side effects with `useEffect` or TanStack Query's mechanisms.

2.  **Immutability:**

    - Data structures (objects, arrays) should not be mutated directly.
    - Use `Readonly` for function parameters where appropriate (e.g., `Readonly<{ children: React.ReactNode }>`).
    - Prefer `const` over `let`.
    - Utilize patterns that create new instances of objects/arrays instead of modifying existing ones (e.g., spread syntax for updates).

3.  **State Management Strategy:**

    - **Server State:** TanStack Query (FKA React Query) is the primary tool for fetching, caching, synchronizing, and updating data from Supabase. This includes managing loading states, errors, and optimistic updates.
    - **Global Client State:** `react-native-async-storage/async-storage` will be used for persistent global state that is not server-derived (e.g., user preferences, first launch flags).
    - **Local Component State:** React's `useState` and `useReducer` for component-level state.
    - **Shared Local State (Context):** React's `useContext` for sharing state among a tree of components when prop-drilling becomes cumbersome and TanStack Query is not applicable.
    - **`utils/supabase.ts`:** This file is critical for Supabase client initialization and should not be changed.

4.  **Error Handling:**

    - **Neverthrow:** Use `Result` (`Ok`, `Err`) and `ResultAsync` (`okAsync`, `errAsync`) for robust error handling in functions that can fail. This promotes explicit error management over try-catch blocks in business logic.
    - **Sentry:** (Assumed from `.clinerules`, though not explicitly detailed for setup) For remote error reporting and monitoring.
    - **`utils/reportError.ts`:** A utility function likely exists or will be created to standardize how `Result` objects (especially `Err` variants) are processed, potentially logging to Sentry or console.

5.  **Database Interaction:**

    - Utilize Supabase's JavaScript client library for all database operations.
    - Leverage Supabase's generated types (`database.types.ts`) for type safety when interacting with tables (e.g., `Tables<'tasks'>`).
    - Employ PostgreSQL Row Level Security (RLS) policies (managed via Supabase) to enforce data access rules.

6.  **Navigation:**

    - Expo Router is used for file-system based routing.
    - The application will feature a drawer and tab-based navigation structure.

7.  **UI Components:**

    - React Native Elements (`@rn-vui/themed`) is the chosen component library for building the UI.

8.  **Forms:**
    - TanStack Form will be used for managing form state, validation, and submission.

## Component Relationships (High-Level Examples)

- **Screen Components (`app/(drawer)/index.tsx`, `app/(tasks)/[id].tsx`):**
  - Responsible for fetching data using TanStack Query hooks.
  - Pass data down to presentational components.
  - Handle user interactions and trigger mutations (via TanStack Query).
- **Form Components (`app/(tasks)/create-task.tsx`):**
  - Utilize TanStack Form for managing form state and validation.
  - On submission, interact with TanStack Query mutation hooks.
- **Custom Hooks (`hooks/useTasksQueries.ts`):**
  - Encapsulate TanStack Query logic (queries, mutations) related to specific data entities (e.g., tasks).
  - Provide a clean API for screen components to interact with data.
- **UI Components (`components/TaskListDisplay.tsx`):**
  - Primarily presentational, receiving data and callbacks via props.
  - Built using React Native Elements.

## Critical Implementation Paths

1.  **Authentication Flow:**
    - Splash screen -> Onboarding (if first launch) -> Login/Register -> Main App (Drawer/Tabs).
    - Securely handling user sessions using Supabase Auth and `useSession` hook.
2.  **Task CRUD Operations:**
    - Implementing forms for creating/editing tasks using TanStack Form.
    - Using TanStack Query for all interactions with the `tasks` and `checklistitems` tables.
    - Ensuring data consistency and proper error handling with Neverthrow.
3.  **Recurring Task Logic:**
    - Correctly interpreting `repeat_on_wk`, `repeat_frequency`, and `repeat_period` to determine task visibility and reset behavior.
    - Calculating task success percentages based on completion history.
4.  **State Synchronization:**
    - Ensuring TanStack Query effectively caches and updates data, providing a responsive UI.
    - Managing offline capabilities if considered (though not explicitly stated as a requirement yet).

## Database Schema Integration Points

- All database interactions must align with the schema defined in `projectbrief.md` and `.clinerules`.
- Foreign key relationships (e.g., `checklistitems_task_id_fkey`) imply that operations on parent entities (e.g., deleting a task) must consider child entities (e.g., its checklist items). Supabase cascade rules will handle some of this.
- Use of enumerated types (`days_of_week`, `repeat_period`) requires mapping UI selections to these specific values.
