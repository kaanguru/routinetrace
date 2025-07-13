# Project Brief: RoutineTrace

## Core Purpose

RoutineTrace is a multi-platform to-do list application focused on daily, weekly, and monthly task management. The primary goal is to help users track and improve the success percentage of their routine, recurring tasks.

## Main Objective

The main objective of this project is to create a "routine to-do list" Android application using ReactNative Expo.

## Key Features (derived from Database Schema)

- **Task Management:**
  - Create, read, update, and delete tasks.
  - Tasks have a title, optional notes, completion status, and position for ordering.
  - Tasks are associated with a user.
- **Recurring Tasks:**
  - Tasks can be set to repeat on specific days of the week (`repeat_on_wk`).
  - Tasks can have a repeat frequency (e.g., every 2 days, every 3 weeks).
  - Tasks can have a repeat period (Daily, Weekly, Monthly, Yearly).
- **Checklist Items:**
  - Tasks can have sub-items (checklist items).
  - Checklist items have content, completion status, and position.
- **Health and Happiness Tracking:**
  - Users can track their health and happiness levels (defaulting to 100).
  - This data is associated with a user and updated over time.
- **Task Completion History:**
  - A history of when tasks are completed is maintained.

## Target Platform

- Android (primary focus, using ReactNative Expo)

## Technical Stack Overview

- **Frontend:** ReactNative Expo
- **UI:** React Native Elements (`@rneui/themed`)
- **Navigation:** Expo Router (with drawer + tabs)
- **State Management:**
  - TanStack Query (React Query) for server state.
  - `react-native-async-storage/async-storage` for global state if needed.
  - `useContext` for local state.
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Form Handling:** TanStack Form
- **Package Manager:** pnpm
- **Error Handling:** Neverthrow, Sentry
- **Documentation Lookup:** Context7

## High-Level Goals

1.  Develop a functional Android application for managing routine to-do lists.
2.  Implement features for creating, tracking, and managing recurring tasks.
3.  Provide users with insights into their task completion consistency (success percentage).
4.  Ensure a clean, user-friendly interface using React Native Elements.
5.  Utilize Supabase for backend services (database and authentication).
6.  Adhere to specified coding standards and patterns (functional paradigm, immutability, Neverthrow for error handling).

## Target Audience and Pain Points

-   **Target Audience:** Students or young adults looking to build better habits and track their progress in a motivational way.
-   **Key Pain Points Addressed:** Struggling with consistency in daily habits and recurring tasks, often forgetting or procrastinating; needing motivation and a clear way to track progress.

## User Experience and Interface Principles

-   **Core Principle:** Incorporate gamification elements and motivational feedback to keep users engaged and encourage consistent task completion. This includes visual rewards, progress tracking, and supportive notifications.

## Monetization Strategy

-   **Initial Approach:** No direct monetization initially; the focus will be on user base growth and engagement. Future monetization strategies will be explored once a substantial user base is established.

## Competitive Landscape and Differentiators

-   **Primary Differentiator:** RoutineTrace will differentiate itself by its specific focus on the "success percentage of routine, recurring tasks" combined with engaging gamification tailored for young adults. While standard to-do apps (e.g., Todoist, Microsoft To Do) and habit trackers (e.g., Habitica) exist, RoutineTrace integrates these aspects with a strong emphasis on motivation through quantifiable success.

## Key Success Metrics (KPIs)

-   User retention rates (e.g., 7-day, 30-day retention).
-   Daily Active Users (DAU) and Weekly Active Users (WAU).
-   Average session duration.

## Future Features/Roadmap (Potential)

-   Social features like sharing progress, leaderboards, or group challenges to foster a community and increase engagement.
-   **Notifications & Reminders**
-   Login with Google
-  if "task notes" has URL they will be clickable link.