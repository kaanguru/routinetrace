# Story 1.2: Refactor Core Read Operations to Use WatermelonDB

## Status: Draft

## Story

- As a user,
- I want the application to load and display my tasks and checklists from a local database,
- so that data is displayed instantly, even when I'm offline.

## Acceptance Criteria (ACs)

1.  Existing TanStack Query hooks responsible for fetching data (e.g., `useTasksQueries`) are refactored.
2.  The refactored hooks now query the local WatermelonDB instance instead of making a direct Supabase API call.
3.  WatermelonDB's observable queries are used to ensure the UI is reactive to data changes.
4.  The main task list and checklist detail views correctly display data sourced from WatermelonDB.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1, 2): Refactor `useTasksQueries` and any other data-fetching hooks.
    - [ ] Remove the Supabase client logic from the hooks.
    - [ ] Implement the new logic to query the `tasks` collection from the WatermelonDB instance provided by the `DatabaseProvider` context.
    - [ ] Ensure the data returned by the refactored hooks maintains the same shape and type signature to avoid breaking UI components.
- [ ] Task 2 (AC: #3): Integrate WatermelonDB observables for reactivity.
    - [ ] Wrap the relevant UI components that display data with the `withObservables` HOC or use the `useObservable` hook.
    - [ ] Verify that the components re-render automatically when the underlying data in WatermelonDB changes.
- [ ] Task 3 (AC: #4): Manually test and verify all UI views that display data.
    - [ ] Seed the local database with sample data for testing purposes.
    - [ ] Confirm the main task list screen correctly renders the seeded data.
    - [ ] Confirm the task detail screen correctly renders its associated checklist items.

## Dev Notes

**Prerequisite**: This story is dependent on the successful completion of **Story 1.1**. The developer must have access to the initialized WatermelonDB instance via the `DatabaseProvider` context.

The primary architectural goal of this story is to completely decouple the application's read operations from the network. After this story is complete, the app should be able to display all user data without an internet connection.

**Relevant files to be modified**:
* `src/hooks/useTasksQueries.ts` (and other query hooks)
* UI components responsible for rendering task/checklist data.

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `true`), coverage requirement: 80%
    -   *Unit test the refactored hooks to ensure they call WatermelonDB query methods correctly and return data in the expected format.*
- [x] Jest with in memory db Integration Test (Test Location): location: `tests/integration/read-operations.test.ts`
    -   *Create an integration test that seeds a mock WatermelonDB instance, renders the relevant components, and asserts that the seeded data is displayed correctly.*
- [ ] Cypress E2E: location: `N/A`

Manual Test Steps:
1.  Implement a temporary method to seed the local WatermelonDB with 2-3 mock tasks and their corresponding checklist items.
2.  Enable airplane mode on the Android emulator to ensure the app is offline.
3.  Launch the application.
4.  **Verify**: The main task list correctly displays the seeded mock tasks.
5.  **Verify**: Tapping on a task navigates to the detail screen and correctly displays its associated checklist items.

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