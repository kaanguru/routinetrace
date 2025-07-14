---
id: STORY-004
epic: Epic 1 - Offline-First Task Management CRUD
title: Offline Task Deletion
status: Approved
priority: High
story_points: 3
acceptance_criteria: [AC6]
---

# Story 004: Offline Task Deletion

## User Story
**As a** mobile app user  
**I want** to delete tasks while offline  
**So that** I can remove unwanted tasks without internet connectivity  

## Acceptance Criteria
- [ ] Can delete tasks while offline
- [ ] Deleted tasks are removed from local storage immediately
- [ ] Deleted tasks no longer appear in task list
- [ ] Confirmation dialog prevents accidental deletion
- [ ] Undo option available for recent deletions

## Technical Notes
- Use `deleteTask` mutation from `hooks/useTasks.ts`
- Update Legend-State observable `tasks$` in `data/observables.ts`
- Implement swipe-to-delete or delete button in `app/(drawer)/index.tsx`
- Use React Native Alert for confirmation dialog
- Consider implementing undo with local state management

## Definition of Done
- [ ] Delete functionality works offline
- [ ] Tasks removed from local storage
- [ ] Confirmation dialog implemented
- [ ] Task list updates immediately
- [ ] Unit tests written and passing