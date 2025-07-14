---
id: STORY-002
epic: Epic 1 - Offline-First Task Management CRUD
title: Offline Task Viewing
status: Approved
priority: High
story_points: 3
acceptance_criteria: [AC3]
---

# Story 002: Offline Task Viewing

## User Story
**As a** mobile app user  
**I want** to view all my tasks while offline  
**So that** I can access my task list anytime without internet connectivity  

## Acceptance Criteria
- [ ] All tasks are visible when offline
- [ ] Task list loads from local storage when no internet
- [ ] Tasks display with title, notes, and completion status
- [ ] Loading states handle offline scenarios gracefully
- [ ] Empty state shown when no tasks exist

## Technical Notes
- Use `useTasks` query hook from `hooks/useTasks.ts`
- Load from Legend-State observable `tasks$` in `data/observables.ts`
- Implement in `app/(drawer)/index.tsx` for main task list
- Handle offline loading states appropriately

## Definition of Done
- [ ] Task list displays without internet connection
- [ ] All task data shows correctly offline
- [ ] Loading states don't hang when offline
- [ ] Empty state handled appropriately
- [ ] Unit tests written and passing