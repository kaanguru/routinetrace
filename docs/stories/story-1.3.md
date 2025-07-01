# Story 1.3: Refactor Core Write Operations to Target WatermelonDB

## Status: Draft

## Story

- As a user,
- I want to create, update, and delete my tasks and checklists while offline,
- so that I can manage my routines anytime, anywhere.

## Acceptance Criteria (ACs)

1.  Existing mutation hooks (e.g., `useTasksMutations`) are refactored to perform writes directly against the WatermelonDB instance.
2.  Creating a new task locally works correctly and the UI updates immediately.
3.  Updating an existing task locally works correctly and the UI updates immediately.
4.  Deleting a task locally works correctly and the UI updates immediately.
5.  WatermelonDB's change tracking mechanism correctly marks these records as needing synchronization.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1): Refactor all mutation hooks (`useTasksMutations`, `useChecklistMutations`, etc.).
    - [ ] Remove all Supabase client logic for create, update, and delete operations.
    - [ ] Implement the new logic to perform writes inside a `database.write(async () => { ... })` block.
    - [ ] Ensure the mutation functions accept the necessary data and correctly map it to the WatermelonDB model fields for creation and updates.
- [ ] Task 2 (AC: #2, 3, 4): Verify optimistic UI updates.
    - [ ] After refactoring, confirm that when a user creates a task, the UI (already reading from WatermelonDB via observables from Story 1.2) updates instantly.
    - [ ] Confirm that updating a task's properties (e.g., title, `is_complete`) is reflected in the UI immediately.
    - [ ] Confirm that deleting a task causes it to be removed from the UI immediately.
- [ ] Task 3 (AC: #5): Verify WatermelonDB's change tracking.
    - [ ] After each type of write operation (create, update, delete), use a debug method to inspect the local database and confirm that the `_status` of the relevant records is appropriately marked as `created`, `updated`, or `deleted`.

## Dev Notes

**Prerequisite**: This story is critically dependent on the successful completion of **Story 1.2**. The UI must already be reading data reactively from WatermelonDB for the optimistic updates in this story to be visible.

The architectural goal here is to complete the client-side loop, making the application fully functional offline. After this story, the user will be able to perform all data management tasks without a network connection, and those changes will persist across app restarts. The data is not yet synced with the backend.

**Relevant files to be modified**:
* `src/hooks/useTasksMutations.ts` (and other mutation hooks)
* Any UI component that calls these mutation hooks.

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `true`), coverage requirement: 80%
    -   *Unit test the refactored mutation hooks. Mock the WatermelonDB `write` method and verify it is called with the correct data.*
- [x] Jest with in memory db Integration Test (Test Location): location: `tests/integration/write-operations.test.ts`
    -   *Create an integration test that renders a component, simulates a user action (e.g., clicking 'Add Task'), and then queries the mock DB instance to assert that the new record was created correctly.*
- [ ] Maestro E2E: location: `N/A`

Manual Test Steps:
1.  Enable airplane mode on the Android emulator to ensure the app is offline.
2.  Create a new task. **Verify**: The task appears in the list instantly.
3.  Edit the title of an existing task. **Verify**: The title updates in the list instantly.
4.  Mark a task as complete. **Verify**: The task's visual state updates instantly.
5.  Delete a task. **Verify**: The task is removed from the list instantly.
6.  Close and restart the application completely (while still in airplane mode).
7.  **Verify**: All changes made in steps 2-5 have been persisted and the UI reflects the correct state.

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