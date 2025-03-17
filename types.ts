// Types

import { Tables } from './database.types';

type RepeatPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface TaskFormData {
  title: string;
  notes: string;
  repeatPeriod: RepeatPeriod | '';
  repeatFrequency: number | null;
  repeatOnWk: DayOfWeek[];
  customStartDate: Date | null;
  isCustomStartDateEnabled: boolean;
  checklistItems: Array<{
    id: string;
    content: string;
    isComplete: boolean;
    position: number;
  }>;
}
type Task = Tables<'tasks'>;
type Item = Tables<'checklistitems'>;
type Success = {
  success: boolean;
  error?: string | null;
};
type Result<T> =
  | {
      data: T;
    }
  | {
      error: string;
    };

type TaskFilter = 'all' | 'completed' | 'not-completed';
interface FormInputProps {
  title: string;
  notes: string;
  setTitle: (title: string) => void;
  setNotes: (notes: string) => void;
}
export type {
  RepeatPeriod,
  FormInputProps,
  DayOfWeek,
  TaskFormData,
  Task,
  Success,
  Result,
  Item,
  TaskFilter,
};

export interface TaskItemProps {
  task: Readonly<Tables<'tasks'>>;
  index: number;
  onReorder: (from: number, to: number) => void;
  onToggleComplete: (params: Readonly<{ taskID: number; isComplete: boolean }>) => void;
  onPress: () => void;
  isFiltered: boolean; // Add isFiltered to the props
}
