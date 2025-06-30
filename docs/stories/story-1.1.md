# Story 1.1: Foundational Setup for WatermelonDB and Local Schema

## Status: Draft

## Story

- As a developer,
- I want to integrate the WatermelonDB library and define a local schema,
- so that the application has the foundational persistence layer required for all subsequent offline-first features.

## Acceptance Criteria (ACs)

1.  The `@nozbe/watermelondb` and `@nozbe/watermelondb/adapters/sqlite` dependencies are successfully added to the project.
2.  A new directory structure `/database/` is created to house all database-related code.
3.  A `/database/schema.ts` file is created, defining the application schema with tables (`tasks`, `checklistitems`, etc.) that mirror the Supabase schema.
4.  Each table schema includes a `supabase_id` column, indexed for performance.
5.  Model files (e.g., `Task.ts`, `ChecklistItem.ts`) are created in `src/database/models/`.
6.  The WatermelonDB instance is initialized in `/database/index.ts` and successfully provided to the entire application via a new `DatabaseProvider` React Context.
7.  A strategy for simulating offline conditions in the development and CI environment is defined and documented.

## Tasks / Subtasks

- [x] Task 1 (AC: #1): Install WatermelonDB and SQLite adapter dependencies using pnpm.
- [ ] Task 2 (AC: #2, 3, 4, 5): Create the directory structure and schema files.
    - [ ] Create `/database/schema.ts` with table schemas mirroring Supabase types.
    - [ ] Create model files for each table inside `/database/models/`.
    - [ ] Create `/database/index.ts` to initialize the database instance.
- [ ] Task 3 (AC: #6): Create and implement the `DatabaseProvider.tsx` in `/context/` and wrap the root application layout.
- [ ] Task 4 (AC: #7): Create a `docs/TESTING_STRATEGY.md` file and document a plan for simulating offline mode for development and testing purposes.
- [ ] Task 5 (AC: All, IV: #1, 2): Verify the application builds and launches successfully on an Android emulator without errors.

## Dev Notes

This story is a foundational setup task. It lays the groundwork for the entire offline-first architecture by setting up the local database layer. No UI changes are expected upon completion of this story. The primary outcome is a stable app that has the database available via React Context.

**Relevant Source Tree changes:**
* **Create**: `src/database/`
* **Create**: `src/context/DatabaseProvider.tsx`
* **Create**: `docs/TESTING_STRATEGY.md`

### Testing

Dev Note: Story Requires the following tests:
- [x] Jest Unit Tests: (nextToFile: `false`, location: `tests/unit/database.test.ts`), coverage requirement: 80%
    -   *Verify that the database instance initializes without throwing errors.*
- [ ] Jest with in memory db Integration Test (Test Location): location: `N/A`
- [ ] Cypress E2E: location: `N/A`

Manual Test Steps:
- Run the application on an Android emulator.
- The app should launch and run without crashing. No visual or functional changes are expected.

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