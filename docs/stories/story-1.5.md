# Story 1.5: Implement Push Sync for EXISTING Record Updates

## Status: Draft

## Story

- As the system,
- I want to push local updates of existing records to Supabase,
- so that changes made offline are reflected in the remote backend.

## Acceptance Criteria (ACs)

1.  The `syncService` can identify locally updated records (e.g., by a status of `updated`).
2.  The service sends the update payload to the correct record in Supabase, identified by its `supabase_id`.
3.  The local record is marked as "synced" after a successful update.
4.  Error handling is in place for cases where the remote record might not exist (e.g., it was deleted on another device) or an update conflict occurs.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1): In `syncService.ts`, implement a function to fetch all records from a WatermelonDB collection where `_status` is `updated`.
- [ ] Task 2 (AC: #2): Implement the API call logic using the Supabase client's `.update()` method.
    - [ ] The payload should only contain the fields that have changed.
    - [ ] Use the local record's `supabase_id` in the `.eq()` filter to target the correct remote record.
- [ ] Task 3 (AC: #3): Upon a successful update response from Supabase, update the local WatermelonDB record's `_status` property back to `synced` inside a `database.write()` block.
- [ ] Task 4 (AC: #4): Enhance the error handling within the `ResultAsync` block to specifically check for update errors, such as a "404 Not Found" if the record was deleted remotely. Log these cases for future reconciliation logic.

## Dev Notes

**Prerequisite**: This story depends on **Story 1.4**. The sync service must already be able to push new records, as updates can only happen on records that have a `supabase_id` from a previous sync.

**Architectural Goal**: This story adds the "update" capability to our push-sync logic. It's a critical piece for ensuring that modifications users make to their tasks are not lost. The logic must be careful to only target records that already exist remotely.

**Relevant files to be modified**:
* `src/services/syncService.ts`

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `false`, location: `tests/unit/syncService.test.ts`), coverage requirement: 80%
    -   *Add unit tests for the update logic. Mock the Supabase `update()` and `eq()` methods and verify they are called with the correct payload and ID.*
- [x] Jest with in memory db Integration Test (Test Location): location: `tests/integration/push-update-sync.test.ts`
    -   *Create an integration test that: 1. Creates and syncs a record (simulating story 1.4). 2. Updates the record locally. 3. Runs the push sync function for updates. 4. Mocks a successful Supabase API response. 5. Asserts that the local record's `_status` is `synced`.*
- [ ] Maestro E2E: location: `N/A`

Manual Test Steps:
1.  Ensure you have at least one task that is already synced with Supabase (it has a `supabase_id`).
2.  Enable airplane mode on the Android emulator.
3.  Edit the title of the synced task.
4.  Disable airplane mode to re-establish a network connection.
5.  Press the temporary "Manual Sync" debug button.
6.  **Verify (Remote)**: Open the Supabase dashboard and confirm the title of the corresponding task has been updated.
7.  **Verify (Local)**: Inspect the local WatermelonDB to confirm the task's `_status` property is `synced`.

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