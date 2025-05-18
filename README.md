# RoutineTrace

A multi-platform to-do list application focused on daily, weekly, and monthly task management with success percentage tracking for routine tasks.

## Features

- **Task Management**: Create, update, and track tasks with due dates and recurrence.
- **Checklists**: Break tasks into smaller checklist items.
- **Health & Happiness Tracking**: Monitor well-being metrics.
- **Task Completion History**: Track task completion over time.
- **Cross-Platform**: Built with React Native for iOS and Android.

## Tech Stack

- **Frontend**: React Native + Expo
- **Navigation**: Expo Router (Drawer + Tabs)
- **UI Components**: React Native Elements
- **State Management**: TanStack Query, Context API
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Forms**: TanStack Form
- **Error Handling**: Neverthrow + Sentry

sentry email: cemkaan@inbox.ru


Do not forget to add the following environment variables to your `.env` file
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_TEST_USER_EMAIL
EXPO_PUBLIC_TEST_USER_PASSWORD
EXPO_PUBLIC_SENTRY_DSN
NODE_OPTIONS=--max-old-space-size=9216
