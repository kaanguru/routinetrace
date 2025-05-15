import {
  addMonths,
  addYears,
  isSameDay,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

import { Tables } from "~/database.types";
import { DayOfWeek } from "~/types";
import getCurrentDayOfWeek from "~/utils/dates/getCurrentDayOfWeek";

const today = new Date();

function isTaskDueToday(task: Readonly<Tables<"tasks">>): boolean {
  const createdAtDate = new Date(task.created_at);
  const daysSinceCreation = differenceInDays(today, createdAtDate);

  switch (task.repeat_period) {
    case "Daily":
      return isDailyTaskDueToday(daysSinceCreation, task.repeat_frequency);

    case "Weekly":
      return isWeeklyTaskDueToday(task, createdAtDate);

    case "Monthly":
      return isMonthlyTaskDueToday(task, createdAtDate);

    case "Yearly":
      return isYearlyTaskDueToday(task, createdAtDate);

    case null:
      return true;

    default:
      console.error("Task with unknown repeat_period:", task);
      return true;
  }
}

function isDailyTaskDueToday(
  daysSinceCreation: number,
  repeatFrequency: number | null,
): boolean {
  const frequency = repeatFrequency ?? 1;
  return daysSinceCreation >= 0 && daysSinceCreation % frequency === 0;
}

function isWeeklyTaskDueToday(
  task: Readonly<Tables<"tasks">>,
  createdAtDate: Date,
): boolean {
  if (!task.repeat_on_wk) return false;
  const currentDayOfWeek = getCurrentDayOfWeek();
  if (!task.repeat_on_wk.includes(currentDayOfWeek as unknown as DayOfWeek))
    return false;
  const repeatFrequency = task.repeat_frequency ?? 1;
  return differenceInWeeks(today, createdAtDate) % repeatFrequency === 0;
}

function isMonthlyTaskDueToday(
  task: Readonly<Tables<"tasks">>,
  createdAtDate: Date,
): boolean {
  const monthsDiff = differenceInMonths(today, createdAtDate);
  if (monthsDiff <= 0) return false;
  const repeatFrequency = task.repeat_frequency ?? 1;
  if (monthsDiff % repeatFrequency !== 0) return false;
  const expectedDate = addMonths(createdAtDate, monthsDiff);
  return isSameDay(expectedDate, today);
}

function isYearlyTaskDueToday(
  task: Readonly<Tables<"tasks">>,
  createdAtDate: Date,
): boolean {
  const yearsDiff = differenceInYears(today, createdAtDate);
  if (yearsDiff < 0) return false;
  const expectedDate = addYears(createdAtDate, yearsDiff);
  return isSameDay(expectedDate, today);
}
export default isTaskDueToday;
