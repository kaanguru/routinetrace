import { Href, router } from 'expo-router';
import { Alert } from 'react-native';

import genRandomInt from './genRandomInt';
import { isFirstLaunchToday } from './isFirstLaunchToday';
import resetRecurringTasks from './tasks/resetRecurringTasks';

import { useUpdateHealthAndHappiness } from '~/hooks/useHealthAndHappinessMutations';
import useHealthAndHappinessQuery from '~/hooks/useHealthAndHappinessQueries';
import useTasksQuery from '~/hooks/useTasksQueries';
import useUser from '~/hooks/useUser';
import { Task } from '~/types';
import wasTaskDueYesterday from '~/utils/tasks/wasTaskDueYesterday';

export default async function initializeDailyTasks() {
  try {
    const isFirstLaunchTodayResult = await isFirstLaunchToday();
    if (!isFirstLaunchTodayResult) return;
    const incompleteTasksFromYesterday = getIncompleteTasksFromYesterday();
    handleTaskOutcome(incompleteTasksFromYesterday);
    await resetRecurringTasks();
  } catch (error) {
    console.error('Error initializing tasks:', error);
  }
}

function getIncompleteTasksFromYesterday() {
  const { data: notCompletedTasks } = useTasksQuery();

  return notCompletedTasks?.filter(wasTaskDueYesterday) || [];
}

function handleTaskOutcome(tasks: Task[]) {
  const { mutate: updateHealthAndHappiness } = useUpdateHealthAndHappiness();
  const { data: user } = useUser();
  const { data: healthAndHappiness } = useHealthAndHappinessQuery(user?.id);

  if (tasks.length === 0) {
    Alert.alert('Well done, no tasks from yesterday!');
    return;
  }
  // punish user
  updateHealthAndHappiness({
    user_id: user?.id,
    health: (healthAndHappiness?.health ?? 0) - genRandomInt(16, 24) * tasks.length,
    happiness: (healthAndHappiness?.happiness ?? 0) - genRandomInt(16, 24) * tasks.length,
  });
  router.push('/(tasks)/tasks-of-yesterday' as Href);
}
