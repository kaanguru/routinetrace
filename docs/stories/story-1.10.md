# Story 1.10: Implement Automated Sync Triggers

## Status: Draft

## Story

- As the system,
- I want to synchronize data automatically at appropriate times,
- so that the user's data is kept up-to-date with minimal manual intervention.

## Acceptance Criteria (ACs)

1.  The `syncService` is automatically triggered when the application is launched or resumed from the background.
2.  The `syncService` is automatically triggered when the device's network status changes from offline to online.
3.  A manual "Sync Now" button is available somewhere in the settings for the user to trigger the process on demand.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1): Hook into the application lifecycle.
    - [ ] In a top-level component (like `app/_layout.tsx`), use React Native's `AppState` API.
    - [ ] Add an event listener that calls the main `syncService` function whenever the app state changes to `active`.
- [ ] Task 2 (AC: #2): Implement network-change trigger.
    - [ ] In the same top-level component, use the `useNetworkStatus` hook.
    - [ ] Create a `useEffect` that tracks the `isOnline` status. When the status changes from `false` to `true`, call the `syncService` function.
- [ ] Task 3 (AC: #3): Create the manual sync button.
    - [ ] Add a "Sync Now" button to the application's settings screen.
    - [ ] The button's `onPress` handler should call the main `syncService` function.
    - [ ] The button should be disabled if a sync is already in progress.

## Dev Notes

**Prerequisite**: This story depends on a fully functional `syncService` (from stories 1.4-1.8) and the `useNetworkStatus` hook.

**Architectural Goal**: This final story makes the entire synchronization system "smart" and automated, removing the need for the user to think about it. It completes the vision of a seamless background synchronization process and provides a manual override for user peace of mind.

**Relevant files to be modified**:
* A top-level application component like `app/_layout.tsx` to host the listeners.
* The settings screen component.
* `src/services/syncService.ts` (to expose the main sync function).

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `true`), coverage requirement: 80%
    -   *Unit test the component containing the trigger logic. Mock the `AppState` and `useNetworkStatus` hook to verify that the `syncService` function is called under the correct conditions.*
- [ ] Jest with in memory db Integration Test (Test Location): location: `N/A`
- [x] Cypress E2E: location: `e2e/auto-sync.test.ts`
    -   *Create an E2E test that launches the app offline, creates data, then enables the network and asserts that the sync process runs automatically.*

Manual Test Steps:
1.  **Network Trigger**: Launch the app in airplane mode. Create a new task. Turn airplane mode off. **Verify**: The "Syncing..." indicator (from Story 1.9) appears automatically without any user interaction.
2.  **App Resume Trigger**: With the app online, push it to the background. In the Supabase dashboard, manually edit a task. Bring the app back to the foreground. **Verify**: The sync process triggers automatically, and the task reflects the change made in the dashboard.
3.  **Manual Trigger**: Go to the settings screen. **Verify**: A "Sync Now" button is present. Pressing it should trigger the "Syncing..." indicator.

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