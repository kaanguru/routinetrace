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
- **UI:** React Native Elements (`@rn-vui/themed`)
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
