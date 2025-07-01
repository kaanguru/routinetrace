# Story 1.6: Implement Push Sync for Record Deletions

## Status: Draft

## Story

- As the system,
- I want to delete records from Supabase that have been deleted locally,
- so that the remote and local data stores remain consistent.

## Acceptance Criteria (ACs)

1.  The `syncService` can identify records marked for deletion locally (e.g., by a status of `deleted`).
2.  The service sends a delete request to Supabase for the corresponding record, identified by `supabase_id`.
3.  The local record is permanently removed from the device after a successful remote deletion.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1): In `syncService.ts`, implement a function to fetch all records from a WatermelonDB collection where `_status` is `deleted`.
- [ ] Task 2 (AC: #2): Implement the API call logic using the Supabase client's `.delete()` method, filtered with `.eq('id', supabase_id)`.
- [ ] Task 3 (AC: #3): Upon a successful deletion response from Supabase, permanently destroy the local record using the `record.destroyPermanently()` method within a `database.write()` block.
- [ ] Task 4: Ensure the error handling logic accounts for cases where the record might have already been deleted on the server, and handle this gracefully (e.g., log it and proceed).

## Dev Notes

**Prerequisite**: This story depends on a fully functional push sync for creates and updates (Stories 1.4 & 1.5). A record must have a `supabase_id` to be deleted remotely.

**Architectural Goal**: This completes the "push" part of our synchronization logic. It's crucial to differentiate between the local "mark for deletion" action (which sets `_status: 'deleted'`) and the final `destroyPermanently()` action, which only occurs after the backend confirms the deletion. This ensures data isn't lost if the remote deletion fails.

**Relevant files to be modified**:
* `src/services/syncService.ts`

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `false`, location: `tests/unit/syncService.test.ts`), coverage requirement: 80%
    -   *Add unit tests for the delete logic. Mock the Supabase `delete()` method and verify it is called with the correct ID. Verify the local `record.destroyPermanently()` method is called on success.*
- [x] Jest with in memory db Integration Test (Test Location): location: `tests/integration/push-delete-sync.test.ts`
    -   *Create an integration test that: 1. Creates and syncs a record. 2. Marks it as deleted locally. 3. Runs the push sync function for deletions. 4. Mocks a successful Supabase API response. 5. Asserts that the record no longer exists in the local mock DB.*
- [ ] Maestro E2E: location: `N/A`

Manual Test Steps:
1.  Ensure you have at least one task that is already synced with Supabase.
2.  Enable airplane mode on the Android emulator.
3.  Delete the synced task from the UI.
4.  Disable airplane mode to re-establish a network connection.
5.  Press the temporary "Manual Sync" debug button.
6.  **Verify (Remote)**: Open the Supabase dashboard and confirm the task has been permanently removed from the remote `tasks` table.
7.  **Verify (Local)**: Restart the application and confirm the task no longer appears. Inspect the local DB (if possible) to confirm the record is gone.

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