---
id: STORY-005
epic: Epic 1 - Offline-First Task Management CRUD
title: Automatic Sync When Online
status: Approved
priority: High
story_points: 5
acceptance_criteria: [AC7]
---

# Story 005: Automatic Sync When Online

## User Story
**As a** mobile app user  
**I want** my offline changes to sync automatically when I come back online  
**So that** my data stays consistent across devices  

## Acceptance Criteria
- [ ] App detects when device comes back online
- [ ] Offline changes are automatically synced to Supabase
- [ ] Sync progress is shown to user
- [ ] Conflicts are handled gracefully
- [ ] No data loss during sync process

## Technical Notes
- Use NetInfo library for network status detection
- Implement sync queue in `data/observables.ts`
- Use TanStack Query sync plugin for Legend State
- Handle conflicts using last-write-wins strategy
- Show sync status in UI (e.g., toast notifications)

## Definition of Done
- [ ] Network detection implemented
- [ ] Automatic sync triggered on online status
- [ ] Sync progress indicator shown
- [ ] Conflict resolution working
- [ ] Integration tests passing