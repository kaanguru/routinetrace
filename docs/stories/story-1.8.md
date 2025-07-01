# Story 1.8: Implement 'Last-Write-Wins' Conflict Resolution

## Status: Draft

## Story

- As the system,
- I want to intelligently handle data conflicts during synchronization,
- so that data integrity is maintained.

## Acceptance Criteria (ACs)

1.  During a pull sync, if a remote record conflicts with a local record (same `supabase_id`), their `updated_at` timestamps are compared.
2.  If the local record's timestamp is more recent, the remote change is ignored (the local version "wins" and will be pushed on the next cycle).
3.  If the remote record's timestamp is more recent, the local record is overwritten with the remote data.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1): In `syncService.ts`, modify the pull sync logic. When a remote record is received, before updating the corresponding local record, fetch the local record by its `supabase_id`.
- [ ] Task 2 (AC: #1): Compare the `updated_at` timestamp of the local record with the `updated_at` timestamp of the incoming remote record.
- [ ] Task 3 (AC: #2): If the local `updated_at` is greater (more recent), skip the update for this record and log the "local wins" conflict resolution event for debugging purposes.
- [ ] Task 4 (AC: #3): If the remote `updated_at` is greater or equal, proceed with updating the local record's fields with the data from the remote record, as per the logic from Story 1.7.

## Dev Notes

**Prerequisite**: This story directly modifies and enhances the logic implemented in **Story 1.7 (Incremental Pull)**. That story must be completed before this one can begin.

**Architectural Goal**: This is a critical story for ensuring data integrity in a multi-device or intermittent-connectivity scenario. It implements our chosen conflict resolution strategy ("Last-Write-Wins") to prevent newer offline changes from being overwritten by stale data from the server. This ensures the user's most recent action is always preserved.

**Relevant files to be modified**:
* `src/services/syncService.ts`

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `false`, location: `tests/unit/syncService.test.ts`), coverage requirement: 80%
    -   *Add specific unit tests for the conflict resolution logic. Pass in mock local and remote records with different timestamps and assert that the correct outcome (update or skip) occurs.*
- [x] Jest with in memory db Integration Test (Test Location): location: `tests/integration/conflict-resolution.test.ts`
    -   *Create an integration test that: 1. Seeds a record in the mock DB. 2. Simulates a remote record with an older timestamp. 3. Runs the pull sync. 4. Asserts that the local record was NOT updated. 5. Repeat with a newer remote timestamp and assert the local record WAS updated.*
- [ ] Maestro E2E: location: `N/A`

Manual Test Steps:
This scenario is difficult to test manually but can be simulated:
1.  Ensure you have a task that is fully synced across the app and the Supabase backend.
2.  In the app, enable airplane mode to go offline.
3.  Edit the title of the synced task (e.g., from "Original Title" to "Local Offline Edit"). Note the time.
4.  A minute later, go to the Supabase dashboard and edit a different field on the *same record* (e.g., change the `notes`). This simulates a change from another device, but with an older timestamp than your local edit.
5.  In the app, disable airplane mode to reconnect.
6.  Trigger the manual sync.
7.  **Verify**: The title of the task in the app should remain "Local Offline Edit". The `notes` field should update to reflect the change from the dashboard, but your more recent title change should have "won" the conflict. The `syncService` should eventually push your title change back to the server.

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