# Story 1.9: Implement UI Feedback for Network and Sync Status

## Status: Draft

## Story

- As a user,
- I want to be aware of the app's connectivity and synchronization status,
- so that I have confidence in the state of my data.

## Acceptance Criteria (ACs)

1.  A UI indicator (e.g., a banner or icon) is displayed when the device is offline.
2.  A UI indicator is displayed when the synchronization service is actively pushing or pulling data.
3.  A toast message or notification is displayed in case of a critical sync failure.
4.  The UI components are sourced from React Native Elements for consistency.

## Tasks / Subtasks

- [ ] Task 1 (AC: #1, 4): Create a `NetworkStatusIndicator` component.
    - [ ] This component will use the `useNetworkStatus` hook to determine if the app is online or offline.
    - [ ] It should conditionally render a non-intrusive banner or icon (e.g., at the top or bottom of the screen) when offline.
    - [ ] Add this component to the root application layout so it is visible on all screens.
- [ ] Task 2 (AC: #2): Implement a global state or context for the sync status (e.g., `isSyncing`).
    - [ ] The `syncService` must update this state to `true` when it begins a sync cycle and `false` when it completes.
    - [ ] Create a `SyncStatusIndicator` component that subscribes to this state and displays a "Syncing..." message or spinner when `isSyncing` is true.
- [ ] Task 3 (AC: #3): Integrate a toast/notification system.
    - [ ] If not already present, add a simple toast notification library to the project.
    - [ ] The `syncService` should trigger a notification with an appropriate error message upon a critical, unrecoverable sync failure.

## Dev Notes

**Prerequisite**: This story depends on the `useNetworkStatus` hook (planned in the architecture) and the `syncService` (Stories 1.4-1.8). The `syncService` will need to be refactored slightly to report its status to a global context or state manager.

**Architectural Goal**: This story is entirely about user experience. It makes the background processes of the offline-first system transparent to the user, which builds trust. It reassures them when things are working correctly and informs them when action might be needed.

**Relevant files to be modified**:
* `app/_layout.tsx` (to include the new indicator components)
* `src/services/syncService.ts` (to report its status)
* **New Files**: `src/components/NetworkStatusIndicator.tsx`, `src/components/SyncStatusIndicator.tsx`, `src/context/SyncStatusProvider.tsx` (or similar state management file).

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `true`), coverage requirement: 80%
    -   *Unit test the new indicator components. Provide mock values for network and sync status and assert that they render the correct text or icons.*
- [ ] Jest with in memory db Integration Test (Test Location): location: `N/A`
- [x] Cypress E2E: location: `e2e/status-indicators.test.ts`
    -   *Create an E2E test that simulates toggling the device's network connection and asserts that the offline indicator appears and disappears correctly.*

Manual Test Steps:
1.  Launch the application while online. **Verify**: No indicators are visible.
2.  Enable airplane mode on the device. **Verify**: An "Offline" banner or icon appears.
3.  Disable airplane mode. **Verify**: The "Offline" indicator vanishes.
4.  Press the temporary "Manual Sync" debug button.
5.  **Verify**: A "Syncing..." indicator appears while the sync runs and disappears once it is complete.
6.  (Optional) Manually introduce an error in the `syncService` to test the failure notification. **Verify**: A toast message appears.

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