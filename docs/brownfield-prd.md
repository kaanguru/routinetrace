# RoutineTrace Brownfield Enhancement PRD

## 2. Goals and Background Context

### Goals

* **Implement a robust "local-first" architecture** to ensure the RoutineTrace application is fully functional, responsive, and reliable, even when the user's device is offline.
* **Enhance User Experience** by providing immediate UI feedback for all data operations (creations, updates, deletions) through optimistic updates, eliminating network latency from the user's critical path.
* **Ensure Data Integrity** by implementing a reliable synchronization service that handles two-way data flow and conflict resolution between the local WatermelonDB database and the remote Supabase backend.

### Background Context

The current "online-first" architecture presents a significant risk to the core value proposition of RoutineTrace, which is consistent routine tracking. Users without a stable internet connection would be unable to manage their tasks, leading to frustration and potential abandonment of their routines.

This architectural enhancement to a **local-first** model directly addresses this problem. By making the local WatermelonDB database the primary source of truth for the application, all user interactions become instantaneous and independent of network connectivity. A background synchronization service will manage data consistency with Supabase, ensuring the user's data is safely backed up and available across devices without compromising the seamless offline experience. This change is critical for creating a resilient and user-friendly application.

## 3. Requirements

### Functional Requirements

* **FR1:** The application **must** be fully functional for all core CRUD (Create, Read, Update, Delete) operations on tasks and checklist items while the device is offline.
* **FR2:** Local data changes **must** be automatically tracked and queued for synchronization when a network connection becomes available.
* **FR3:** The UI **must** update immediately in response to local data changes, providing an "optimistic UI" without waiting for server confirmation.
* **FR4:** A synchronization service **must** be implemented to handle two-way data flow: pushing local changes to Supabase and pulling remote changes to the local database.
* **FR5:** The system **must** handle data conflicts between local and remote versions, initially using a "Last-write-wins" strategy based on `updated_at` timestamps.
* **FR6:** The UI **must** provide clear visual feedback to the user regarding the current network status (e.g., "Offline Mode") and synchronization activity (e.g., "Syncing...").
* **FR7:** The synchronization service **must** perform an incremental pull of data from Supabase, fetching only records that have changed since the last successful sync.

### Non-Functional Requirements

* **NFR1:** Synchronization operations **must not** block or degrade the performance of the user interface.
* **NFR2:** The synchronization service **must** implement a retry mechanism (e.g., exponential backoff) for failed network operations to improve reliability.
* **NFR3:** The application **must** actively monitor the device's network status and automatically trigger the synchronization process when transitioning from offline to online.
* **NFR4:** The initial data sync for a new user **must** be optimized to handle large datasets without causing excessive wait times, potentially using background loading strategies.

### Compatibility Requirements

* **CR1:** The WatermelonDB schema **must** mirror the existing Supabase table structure, including a `supabase_id` column on each local table to map records between the local and remote databases.
* **CR2:** Existing data fetching hooks (e.g., `useTasksQueries`) built with TanStack Query **must** be refactored to source data from the local WatermelonDB instance using its observable queries instead of directly from Supabase.
* **CR3:** Existing mutation hooks **must** be refactored to perform write operations directly against the local WatermelonDB instance.
* **CR4:** All data synchronization logic **must** use the Supabase JavaScript Client (`@supabase/supabase-js`) for backend communication.

## 5. Epic and Story Structure

### Epic Approach

For this brownfield enhancement, we will use a **single, comprehensive epic**. This approach is ideal because the entire task—implementing a local-first architecture—is one cohesive unit of work. Every story is tightly related and builds directly upon the previous one to achieve the final architectural goal.

### Epic 1: Implement Offline-First Architecture with WatermelonDB

* **Epic Goal**: To refactor the application's data layer to be "local-first," using WatermelonDB as the primary data store. This involves implementing a background synchronization service with Supabase to enable full offline functionality and improve UI responsiveness.
* **Integration Requirements**: This epic will touch nearly every part of the data flow. Key integration points include refactoring all existing data-fetching hooks (TanStack Query) to source from WatermelonDB, adapting UI components to be driven by local data observables, and creating a new synchronization service that is the sole communication layer with the Supabase backend.

### Story 1.1: Foundational Setup for WatermelonDB and Local Schema

*As a developer,*
*I want to integrate the WatermelonDB library and define a local schema,*
*so that the application has the foundational persistence layer required for all subsequent offline-first features.*

#### Acceptance Criteria

1.  The `@nozbe/watermelondb` and `@nozbe/watermelondb/adapters/sqlite` dependencies are successfully added to the project.
2.  A new directory structure `src/database/` is created to house all database-related code.
3.  A `src/database/schema.ts` file is created, defining the application schema with tables (`tasks`, `checklistitems`, etc.) that mirror the Supabase schema.
4.  Each table schema includes a `supabase_id` column, indexed for performance.
5.  Model files (e.g., `Task.ts`, `ChecklistItem.ts`) are created in `src/database/models/`.
6.  The WatermelonDB instance is initialized in `src/database/index.ts` and successfully provided to the entire application via a new `DatabaseProvider` React Context.
7.  A strategy for simulating offline conditions in the development and CI environment is defined and documented.

#### Integration Verification

* **IV1:** The application successfully builds and launches on an Android emulator without errors after the new dependencies and context provider are added.
* **IV2:** Existing application startup logic remains unaffected.

### Story 1.2: Refactor Core Read Operations to Use WatermelonDB

*As a user,*
*I want the application to load and display my tasks and checklists from a local database,*
*so that data is displayed instantly, even when I'm offline.*

#### Acceptance Criteria

1.  Existing TanStack Query hooks responsible for fetching data (e.g., `useTasksQueries`) are refactored.
2.  The refactored hooks now query the local WatermelonDB instance instead of making a direct Supabase API call.
3.  WatermelonDB's observable queries are used to ensure the UI is reactive to data changes.
4.  The main task list and checklist detail views correctly display data sourced from WatermelonDB.

#### Integration Verification

* **IV1:** The UI correctly displays mock or seeded data from the local WatermelonDB.
* **IV2:** The performance of the views is equal to or better than the previous direct-query implementation.
* **IV3:** There are no breaking changes to the props or data structures expected by the UI components.

### Story 1.3: Refactor Core Write Operations to Target WatermelonDB

*As a user,*
*I want to create, update, and delete my tasks and checklists while offline,*
*so that I can manage my routines anytime, anywhere.*

#### Acceptance Criteria

1.  Existing mutation hooks (e.g., `useTasksMutations`) are refactored to perform writes directly against the WatermelonDB instance.
2.  Creating a new task locally works correctly and the UI updates immediately.
3.  Updating an existing task locally works correctly and the UI updates immediately.
4.  Deleting a task locally works correctly and the UI updates immediately.
5.  WatermelonDB's change tracking mechanism correctly marks these records as needing synchronization.

#### Integration Verification

* **IV1:** All local write operations are persisted correctly in the SQLite database after an app restart.
* **IV2:** The "optimistic UI" updates are instant and correctly reflect the state of the local database.

### Story 1.4: Implement Push Sync for NEW Record Creations

*As the system,*
*I want to push newly created local records to Supabase,*
*so that data created offline is securely backed up when a network connection is available.*

#### Acceptance Criteria

1.  The `syncService` can identify locally created records that need to be pushed.
2.  The service sends a new record to the appropriate Supabase table.
3.  Upon a successful response from Supabase, the service updates the local record with the `supabase_id` returned by the server.
4.  The local record is then marked as "synced" and is no longer included in subsequent push attempts.
5.  The Neverthrow library is used to handle any potential network or server errors gracefully.

#### Integration Verification

* **IV1:** A task created on the device while offline appears in the Supabase database table after the device goes online and the sync is complete.
* **IV2:** The local record's `supabase_id` field is correctly populated post-sync.

### Story 1.5: Implement Push Sync for EXISTING Record Updates

*As the system,*
*I want to push local updates of existing records to Supabase,*
*so that changes made offline are reflected in the remote backend.*

#### Acceptance Criteria

1.  The `syncService` can identify locally updated records.
2.  The service sends the update payload to the correct record in Supabase, identified by its `supabase_id`.
3.  The local record is marked as "synced" after a successful update.
4.  Error handling is in place for cases where the remote record might not exist or an update conflict occurs.

#### Integration Verification

* **IV1:** A task updated on the device (e.g., title changed) is reflected in the corresponding record in the Supabase database after sync.
* **IV2:** The sync logic correctly handles updates for multiple records within a single sync cycle.

### Story 1.6: Implement Push Sync for Record Deletions

*As the system,*
*I want to delete records from Supabase that have been deleted locally,*
*so that the remote and local data stores remain consistent.*

#### Acceptance Criteria

1.  The `syncService` can identify records marked for deletion locally.
2.  The service sends a delete request to Supabase for the corresponding record, identified by `supabase_id`.
3.  The local record is permanently removed from the device after a successful remote deletion.

#### Integration Verification

* **IV1:** A task deleted on the device is removed from the Supabase database table after sync.
* **IV2:** The local database is cleaned of the deleted record post-sync.

### Story 1.7: Implement Incremental Pull of Remote Changes

*As the system,*
*I want to fetch only the most recent changes from Supabase,*
*so that synchronization is fast and efficient.*

#### Acceptance Criteria

1.  The last successful sync timestamp is stored locally using AsyncStorage.
2.  The `syncService` sends a request to Supabase to fetch only records with an `updated_at` timestamp greater than the last synced timestamp.
3.  The service correctly inserts new remote records or updates existing local records based on the pulled data.
4.  The last successful sync timestamp is updated in AsyncStorage after a successful pull.

#### Integration Verification

* **IV1:** If a change is made directly in the Supabase database, it correctly appears on the device after the next sync cycle.
* **IV2:** The sync process only fetches new/updated records, as verified by network request analysis.

### Story 1.8: Implement 'Last-Write-Wins' Conflict Resolution

*As the system,*
*I want to intelligently handle data conflicts during synchronization,*
*so that data integrity is maintained.*

#### Acceptance Criteria

1.  During a pull sync, if a remote record conflicts with a local record (same `supabase_id`), their `updated_at` timestamps are compared.
2.  If the local record's timestamp is more recent, the remote change is ignored (the local version "wins" and will be pushed on the next cycle).
3.  If the remote record's timestamp is more recent, the local record is overwritten with the remote data.

#### Integration Verification

* **IV1:** A test case where a record is updated locally, then updated remotely with an older timestamp, results in the local change being preserved.
* **IV2:** A test case where a record is updated locally, then updated remotely with a newer timestamp, results in the local record being overwritten by the remote data.

### Story 1.9: Implement UI Feedback for Network and Sync Status

*As a user,*
*I want to be aware of the app's connectivity and synchronization status,*
*so that I have confidence in the state of my data.*

#### Acceptance Criteria

1.  A UI indicator (e.g., a banner or icon) is displayed when the device is offline.
2.  A UI indicator is displayed when the synchronization service is actively pushing or pulling data.
3.  A toast message or notification is displayed in case of a critical sync failure.
4.  The UI components are sourced from React Native Elements for consistency.

#### Integration Verification

* **IV1:** Toggling WiFi/cellular data on the device correctly triggers the "Offline Mode" indicator in the UI.
* **IV2:** The "Syncing..." indicator appears during a manual or automated sync process.

### Story 1.10: Implement Automated Sync Triggers

*As the system,*
*I want to synchronize data automatically at appropriate times,*
*so that the user's data is kept up-to-date with minimal manual intervention.*

#### Acceptance Criteria

1.  The `syncService` is automatically triggered when the application is launched or resumed from the background.
2.  The `syncService` is automatically triggered when the device's network status changes from offline to online.
3.  A manual "Sync Now" button is available somewhere in the settings for the user to trigger the process on demand.

#### Integration Verification

* **IV1:** Bringing the app from the background to the foreground while online triggers a sync.
* **IV2:** Turning on WiFi after being offline triggers a sync.
* **IV3:** The manual sync button successfully initiates the entire sync process.