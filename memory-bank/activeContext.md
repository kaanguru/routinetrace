# Active Context: RoutineTrace

## Current Work Focus

- **Initial Setup of Memory Bank:** The primary focus is to establish the foundational Memory Bank documents (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`). This involves populating them with information derived from `.clinerules` and the overall project understanding.

## Recent Changes

- Created `memory-bank/projectbrief.md`.
- Created `memory-bank/productContext.md`.
- Created `memory-bank/systemPatterns.md`.
- Created `memory-bank/techContext.md`.
- Currently creating `memory-bank/activeContext.md`.

## Next Steps

1.  Create `memory-bank/progress.md`.
2.  Once all core Memory Bank files are created, review them to ensure consistency and completeness.
3.  Await further instructions or tasks from the user.

## Active Decisions and Considerations

- **Information Source:** The `.clinerules` file is the primary source of truth for bootstrapping the Memory Bank.
- **File Structure:** Adhering to the Memory Bank structure outlined in the initial task (core files, optional context files).
- **Content Derivation:** Information for each Memory Bank file is being logically derived from the available project context, primarily `.clinerules`.

## Important Patterns and Preferences (from `.clinerules`)

- **Functional Programming:** Emphasize pure functions, immutability.
- **Error Handling:** Use Neverthrow (`Result`, `ResultAsync`).
- **State Management:** TanStack Query for server state, AsyncStorage for global, Context/useState for local.
- **UI:** React Native Elements (`@rneui/themed`).
- **Database Types:** Use Supabase generated types (`database.types.ts`).
- **No `utils/supabase.ts` Modification:** This file is considered stable.

## Learnings and Project Insights (Initial)

- The project is well-defined in `.clinerules`, providing a strong foundation.
- The tech stack is modern and leverages established libraries for common mobile app development challenges (state, forms, UI).
- A clear emphasis is placed on specific coding patterns and best practices (immutability, functional paradigm).
- The database schema is provided, which is crucial for understanding data relationships and backend interactions.
