# Story 1.4: Implement Push Sync for NEW Record Creations

## Status: Draft

## Story

- As the system,
- I want to push newly created local records to Supabase,
- so that data created offline is securely backed up when a network connection is available.

## Acceptance Criteria (ACs)

1.  The `syncService` can identify locally created records that need to be pushed (e.g., by a status of `created`).
2.  The service sends a new record to the appropriate Supabase table.
3.  Upon a successful response from Supabase, the service updates the local record with the `supabase_id` returned by the server.
4.  The local record is then marked as "synced" (e.g., by updating its status from `created` to `synced`) and is no longer included in subsequent push attempts.
5.  The Neverthrow library is used to handle any potential network or server errors gracefully during the push operation.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1): In `syncService.ts`, implement a function to fetch all records from a WatermelonDB collection where `_status` is `created`.
- [ ] Task 2 (AC: #2): Implement the API call logic using the Supabase client to insert a record into the corresponding remote table.
- [ ] Task 3 (AC: #3, 4): In the success callback of the API call, update the local WatermelonDB record.
    - [ ] Set its `supabase_id` to the ID returned by Supabase.
    - [ ] Update its `_status` property to `synced`.
    - [ ] Wrap these database updates in a single `database.write()` block.
- [ ] Task 4 (AC: #5): Wrap the entire push operation for a single record in a `ResultAsync` block from Neverthrow to handle potential errors without crashing the entire sync process.
- [ ] Task 5: Create a temporary debug button in the UI to manually trigger the push sync process for testing.

## Dev Notes

**Prerequisite**: This story depends on the successful completion of **Story 1.3**. The application must be able to create records locally for this story to be testable.

**Architectural Goal**: This story implements the first half of the "push" functionality. It specifically and only targets newly created records. It should not attempt to handle updates or deletions, which will be covered in subsequent stories. This isolates the logic and reduces risk.

**Relevant files to be modified**:
* `src/services/syncService.ts`
* A temporary button will need to be added to a UI component for testing.

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `false`, location: `tests/unit/syncService.test.ts`), coverage requirement: 80%
    -   *Unit test the `syncService` functions. Mock the Supabase client and WatermelonDB queries. Verify that for a given "created" record, the service calls the Supabase `insert()` method and then updates the local record.*
- [x] Jest with in memory db Integration Test (Test Location): location: `tests/integration/push-create-sync.test.ts`
    -   *Create an integration test that: 1. Creates a new record in a mock WatermelonDB instance. 2. Runs the push sync function. 3. Mocks a successful Supabase API response. 4. Asserts that the local record was updated with the new `supabase_id` and `synced` status.*
- [ ] Cypress E2E: location: `N/A`

Manual Test Steps:
1.  Enable airplane mode on the Android emulator.
2.  Create 2-3 new tasks.
3.  Disable airplane mode to re-establish a network connection.
4.  Press the temporary "Manual Sync" debug button.
5.  **Verify (Remote)**: Open the Supabase dashboard and confirm that the new tasks now exist in the remote `tasks` table.
6.  **Verify (Local)**: Use a debug method to inspect the local WatermelonDB. Confirm that the tasks you created now have a valid `supabase_id` (no longer null/empty) and their `_status` property is `synced`.

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