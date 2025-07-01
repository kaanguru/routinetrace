# Story 1.7: Implement Incremental Pull of Remote Changes

## Status: Draft

## Story

- As the system,
- I want to fetch only the most recent changes from Supabase,
- so that synchronization is fast and efficient.

## Acceptance Criteria (ACs)

1.  The last successful sync timestamp is stored locally using AsyncStorage.
2.  The `syncService` sends a request to Supabase to fetch only records with an `updated_at` timestamp greater than the last synced timestamp.
3.  The service correctly inserts new remote records or updates existing local records based on the pulled data.
4.  The last successful sync timestamp is updated in AsyncStorage after a successful pull.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1, 4): Create helper functions to get and set the `lastSyncedAt` timestamp from AsyncStorage.
- [ ] Task 2 (AC: #2): In `syncService.ts`, implement the pull logic.
    - [ ] Before fetching, retrieve the `lastSyncedAt` timestamp. If it doesn't exist, use a default value (e.g., the epoch).
    - [ ] Construct a Supabase query that uses `.gt('updated_at', lastSyncedAt)` to fetch only new or updated records.
- [ ] Task 3 (AC: #3): Process the records returned from the Supabase query.
    - [ ] For each incoming record, query the local WatermelonDB to see if a record with a matching `supabase_id` already exists.
    - [ ] If a local record exists, update its fields to match the incoming remote record.
    - [ ] If no local record exists, create a new record in WatermelonDB with the data from the incoming remote record.
    - [ ] Batch all local database updates and creations into a single `database.write()` block for performance.
- [ ] Task 4 (AC: #4): After successfully processing all pulled records, update the `lastSyncedAt` timestamp in AsyncStorage to the `updated_at` value of the most recent record processed.

## Dev Notes

**Prerequisite**: This story depends on the foundational setup from **Story 1.1**. It can be developed in parallel with the "push" stories (1.4-1.6).

**Architectural Goal**: This story implements the "pull" mechanism, which is essential for multi-device consistency and for retrieving any changes made directly on the backend. The use of an incremental, timestamp-based approach is key for efficiency, avoiding the need to download the entire dataset on every sync.

**Relevant files to be modified**:
* `src/services/syncService.ts`
* A new helper module for AsyncStorage might be beneficial (e.g., `src/utils/storage.ts`).

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `false`, location: `tests/unit/syncService.test.ts`), coverage requirement: 80%
    -   *Add unit tests for the pull logic. Mock AsyncStorage and the Supabase `select()` and `gt()` methods. Verify that the service calls the Supabase client with the correct timestamp filter.*
- [x] Jest with in memory db Integration Test (Test Location): location: `tests/integration/pull-sync.test.ts`
    -   *Create an integration test that: 1. Mocks the Supabase API to return an array of new/updated records. 2. Runs the pull sync function. 3. Asserts that the new records were correctly created or updated in the local mock WatermelonDB instance.*
- [ ] Maestro E2E: location: `N/A`

Manual Test Steps:
1.  Ensure the app is running and you are online. Let an initial sync (if any) complete.
2.  Using the Supabase Studio dashboard, manually **update the title of an existing task**.
3.  In a separate action, manually **insert a new task** directly into the Supabase `tasks` table.
4.  On the device, press the temporary "Manual Sync" debug button.
5.  **Verify**: The title of the existing task in the app updates to match the change you made in the dashboard.
6.  **Verify**: The new task you created in the dashboard now appears in the task list in the app.
7.  **Verify**: Check the value of `lastSyncedAt` in AsyncStorage (via debug logs) to confirm it has been updated to the timestamp of one of the records you just pulled.

## Dev Agent Record

### Agent Model Used: [[LLM: (Dev Agent) When Drafting Story, leave next prompt in place for dev agent to remove and update]]

### Debug Log References

[[LLM: (Dev Agent) If the debug is logged to during the current story progress, create a table with the debug log and the specific task section in the debug log - do not repeat all the details in the story]]

### Completion Notes List

[[LLM: (Dev Agent) Anything the SM needs to know that deviated from the story that might impact drafting the next story.]]

### Change Log

[[LLM: (Dev Agent) Track document versions and changes during development that deviate from story dev start]]

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |