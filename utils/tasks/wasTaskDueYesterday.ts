import {
  addMonths,
  addYears,
  isSameDay,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  subDays,
} from 'date-fns';

import { Tables } from '~/database.types';
import { DayOfWeek } from '~/types';
import getCurrentDayOfWeek from '~/utils/dates/getCurrentDayOfWeek';

const yesterday = subDays(new Date(), 1);

function wasTaskDueYesterday(task: Readonly<Tables<'tasks'>>): boolean {
  const createdAtDate = new Date(task.created_at);
  const daysSinceCreation = differenceInDays(yesterday, createdAtDate);

  switch (task.repeat_period) {
    case 'Daily':
      return wasDailyTaskDueYesterday(daysSinceCreation, task.repeat_frequency);

    case 'Weekly':
      return wasWeeklyTaskDueYesterday(task, createdAtDate);

    case 'Monthly':
      return wasMonthlyTaskDueYesterday(task, createdAtDate);

    case 'Yearly':
      return wasYearlyTaskDueYesterday(task, createdAtDate);

    case null:
      return true;

    default:
      console.error('Task with unknown repeat_period:', task);
      return true;
  }
}

function wasDailyTaskDueYesterday(
  daysSinceCreation: number,
  repeatFrequency: number | null,
): boolean {
  const frequency = repeatFrequency ?? 1;
  return daysSinceCreation >= 0 && daysSinceCreation % frequency === 0;
}

function wasWeeklyTaskDueYesterday(task: Readonly<Tables<'tasks'>>, createdAtDate: Date): boolean {
  if (!task.repeat_on_wk) return false;
  const currentDayOfWeek = getCurrentDayOfWeek();
  if (!task.repeat_on_wk.includes(currentDayOfWeek as unknown as DayOfWeek)) return false;
  const repeatFrequency = task.repeat_frequency ?? 1;
  return differenceInWeeks(yesterday, createdAtDate) % repeatFrequency === 0;
}

function wasMonthlyTaskDueYesterday(task: Readonly<Tables<'tasks'>>, createdAtDate: Date): boolean {
  const monthsDiff = differenceInMonths(yesterday, createdAtDate);
  if (monthsDiff <= 0) return false;
  const repeatFrequency = task.repeat_frequency ?? 1;
  if (monthsDiff % repeatFrequency !== 0) return false;
  const expectedDate = addMonths(createdAtDate, monthsDiff);
  return isSameDay(expectedDate, yesterday);
}

function wasYearlyTaskDueYesterday(task: Readonly<Tables<'tasks'>>, createdAtDate: Date): boolean {
  const yearsDiff = differenceInYears(yesterday, createdAtDate);
  if (yearsDiff < 0) return false;
  const expectedDate = addYears(createdAtDate, yearsDiff);
  return isSameDay(expectedDate, yesterday);
}
export default wasTaskDueYesterday;
