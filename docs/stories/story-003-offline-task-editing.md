---
id: STORY-003
epic: Epic 1 - Offline-First Task Management CRUD
title: Offline Task Editing
status: Approved
priority: High
story_points: 5
acceptance_criteria: [AC4, AC5]
---

# Story 003: Offline Task Editing

## User Story
**As a** mobile app user  
**I want** to edit existing tasks while offline  
**So that** I can update task details without internet connectivity  

## Acceptance Criteria
- [ ] Can edit task title and notes while offline
- [ ] Changes are saved to local storage immediately
- [ ] Edited tasks show updated content in task list
- [ ] Edit form pre-fills with existing task data
- [ ] Cancel editing returns to task list without changes

## Technical Notes
- Use `updateTask` mutation from `hooks/useTasks.ts`
- Update Legend-State observable `tasks$` in `data/observables.ts`
- Implement in `app/(tasks)/edit/[id].tsx`
- Use `useLocalSearchParams` to get task ID
- Pre-populate form with existing task data

## Definition of Done
- [ ] Edit form loads existing task data
- [ ] Changes save to local storage offline
- [ ] Updated tasks display correctly in list
- [ ] Cancel functionality works properly
- [ ] Unit tests written and passing