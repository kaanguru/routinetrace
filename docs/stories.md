Story 1.1: Foundational Setup for WatermelonDB and Local Schema
As a developer,
I want to integrate the WatermelonDB library and define a local schema,
so that the application has the foundational persistence layer required for all subsequent offline-first features.

Acceptance Criteria
The @nozbe/watermelondb and @nozbe/watermelondb/adapters/sqlite dependencies are successfully added to the project.

A new directory structure src/database/ is created to house all database-related code.

A src/database/schema.ts file is created, defining the application schema with tables (tasks, checklistitems, etc.) that mirror the Supabase schema.

Each table schema includes a supabase_id column, indexed for performance.

Model files (e.g., Task.ts, ChecklistItem.ts) are created in src/database/models/.

The WatermelonDB instance is initialized in src/database/index.ts and successfully provided to the entire application via a new DatabaseProvider React Context.

Integration Verification
IV1: The application successfully builds and launches on an Android emulator without errors after the new dependencies and context provider are added.

IV2: Existing application startup logic remains unaffected.

Story 1.2: Refactor Core Read Operations to Use WatermelonDB
As a user,
I want the application to load and display my tasks and checklists from a local database,
so that data is displayed instantly, even when I'm offline.

Acceptance Criteria
Existing TanStack Query hooks responsible for fetching data (e.g., useTasksQueries) are refactored.

The refactored hooks now query the local WatermelonDB instance instead of making a direct Supabase API call.

WatermelonDB's observable queries are used to ensure the UI is reactive to data changes.

The main task list and checklist detail views correctly display data sourced from WatermelonDB.

Integration Verification
IV1: The UI correctly displays mock or seeded data from the local WatermelonDB.

IV2: The performance of the views is equal to or better than the previous direct-query implementation.

IV3: There are no breaking changes to the props or data structures expected by the UI components.

Story 1.3: Refactor Core Write Operations to Target WatermelonDB
As a user,
I want to create, update, and delete my tasks and checklists while offline,
so that I can manage my routines anytime, anywhere.

Acceptance Criteria
Existing mutation hooks (e.g., useTasksMutations) are refactored to perform writes directly against the WatermelonDB instance.

Creating a new task locally works correctly and the UI updates immediately.

Updating an existing task locally works correctly and the UI updates immediately.

Deleting a task locally works correctly and the UI updates immediately.

WatermelonDB's change tracking mechanism correctly marks these records as needing synchronization.

Integration Verification
IV1: All local write operations are persisted correctly in the SQLite database after an app restart.

IV2: The "optimistic UI" updates are instant and correctly reflect the state of the local database.

Story 1.4: Implement Push Sync for NEW Record Creations
As the system,
I want to push newly created local records to Supabase,
so that data created offline is securely backed up when a network connection is available.

Acceptance Criteria
The syncService can identify locally created records that need to be pushed.

The service sends a new record to the appropriate Supabase table.

Upon a successful response from Supabase, the service updates the local record with the supabase_id returned by the server.

The local record is then marked as "synced" and is no longer included in subsequent push attempts.

The Neverthrow library is used to handle any potential network or server errors gracefully.

Integration Verification
IV1: A task created on the device while offline appears in the Supabase database table after the device goes online and the sync is complete.

IV2: The local record's supabase_id field is correctly populated post-sync.

Story 1.5: Implement Push Sync for EXISTING Record Updates
As the system,
I want to push local updates of existing records to Supabase,
so that changes made offline are reflected in the remote backend.

Acceptance Criteria
The syncService can identify locally updated records.

The service sends the update payload to the correct record in Supabase, identified by its supabase_id.

The local record is marked as "synced" after a successful update.

Error handling is in place for cases where the remote record might not exist or an update conflict occurs.

Integration Verification
IV1: A task updated on the device (e.g., title changed) is reflected in the corresponding record in the Supabase database after sync.

IV2: The sync logic correctly handles updates for multiple records within a single sync cycle.

Story 1.6: Implement Push Sync for Record Deletions
As the system,
I want to delete records from Supabase that have been deleted locally,
so that the remote and local data stores remain consistent.

Acceptance Criteria
The syncService can identify records marked for deletion locally.

The service sends a delete request to Supabase for the corresponding record, identified by supabase_id.

The local record is permanently removed from the device after a successful remote deletion.

Integration Verification
IV1: A task deleted on the device is removed from the Supabase database table after sync.

IV2: The local database is cleaned of the deleted record post-sync.

Story 1.7: Implement Incremental Pull of Remote Changes
As the system,
I want to fetch only the most recent changes from Supabase,
so that synchronization is fast and efficient.

Acceptance Criteria
The last successful sync timestamp is stored locally using AsyncStorage.

The syncService sends a request to Supabase to fetch only records with an updated_at timestamp greater than the last synced timestamp.

The service correctly inserts new remote records or updates existing local records based on the pulled data.

The last successful sync timestamp is updated in AsyncStorage after a successful pull.

Integration Verification
IV1: If a change is made directly in the Supabase database, it correctly appears on the device after the next sync cycle.

IV2: The sync process only fetches new/updated records, as verified by network request analysis.

Story 1.8: Implement 'Last-Write-Wins' Conflict Resolution
As the system,
I want to intelligently handle data conflicts during synchronization,
so that data integrity is maintained.

Acceptance Criteria
During a pull sync, if a remote record conflicts with a local record (same supabase_id), their updated_at timestamps are compared.

If the local record's timestamp is more recent, the remote change is ignored (the local version "wins" and will be pushed on the next cycle).

If the remote record's timestamp is more recent, the local record is overwritten with the remote data.

Integration Verification
IV1: A test case where a record is updated locally, then updated remotely with an older timestamp, results in the local change being preserved.

IV2: A test case where a record is updated locally, then updated remotely with a newer timestamp, results in the local record being overwritten by the remote data.

Story 1.9: Implement UI Feedback for Network and Sync Status
As a user,
I want to be aware of the app's connectivity and synchronization status,
so that I have confidence in the state of my data.

Acceptance Criteria
A UI indicator (e.g., a banner or icon) is displayed when the device is offline.

A UI indicator is displayed when the synchronization service is actively pushing or pulling data.

A toast message or notification is displayed in case of a critical sync failure.

The UI components are sourced from React Native Elements for consistency.

Integration Verification
IV1: Toggling WiFi/cellular data on the device correctly triggers the "Offline Mode" indicator in the UI.

IV2: The "Syncing..." indicator appears during a manual or automated sync process.

Story 1.10: Implement Automated Sync Triggers
As the system,
I want to synchronize data automatically at appropriate times,
so that the user's data is kept up-to-date with minimal manual intervention.

Acceptance Criteria
The syncService is automatically triggered when the application is launched or resumed from the background.

The syncService is automatically triggered when the device's network status changes from offline to online.

A manual "Sync Now" button is available somewhere in the settings for the user to trigger the process on demand.

Integration Verification
IV1: Bringing the app from the background to the foreground while online triggers a sync.

IV2: Turning on WiFi after being offline triggers a sync.

IV3: The manual sync button successfully initiates the entire sync process.