import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';

import { Tables } from '~/database.types';

function calculateSuccessPercentage(
  task: Readonly<Tables<'tasks'>>,
  completionHistory: Tables<'task_completion_history'>[],
) {
  const createdAtDate = new Date(task.created_at);
  const daysSinceCreation = differenceInDays(Date.now(), createdAtDate);

  switch (task.repeat_period) {
    case 'Daily':
      if (daysSinceCreation === 0) {
        return 0; // or handle as needed
      }
      return (completionHistory.length / daysSinceCreation) * 100;

    case 'Weekly':
      const weeksSinceCreation = differenceInWeeks(Date.now(), createdAtDate);
      const expectedCompletionsWeekly = weeksSinceCreation / (task.repeat_frequency ?? 1);
      if (expectedCompletionsWeekly === 0) {
        return 0; // or handle as needed
      }
      return (completionHistory.length / expectedCompletionsWeekly) * 100;

    case 'Monthly':
      const monthsSinceCreation = differenceInMonths(Date.now(), createdAtDate);
      const expectedCompletionsMonthly = monthsSinceCreation / (task.repeat_frequency ?? 1);
      if (expectedCompletionsMonthly === 0) {
        return 0; // or handle as needed
      }
      return (completionHistory.length / expectedCompletionsMonthly) * 100;

    case 'Yearly':
      const yearsSinceCreation = differenceInYears(Date.now(), createdAtDate);
      const expectedCompletionsYearly = yearsSinceCreation / (task.repeat_frequency ?? 1);
      if (expectedCompletionsYearly === 0) {
        return 0; // or handle as needed
      }
      return (completionHistory.length / expectedCompletionsYearly) * 100;

    case null:
      return 0; // or handle as needed for non-repeating tasks
    default:
      return 0; // or handle as needed for unknown repeat_period
  }
}

export default calculateSuccessPercentage;
