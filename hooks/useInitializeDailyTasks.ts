// useInitializeDailyTasks.ts
import { Href, router } from "expo-router";
import { useEffect, useState } from "react";

import { useUpdateHealthAndHappiness } from "./useHealthAndHappinessMutations";
import useHealthAndHappinessQuery from "./useHealthAndHappinessQueries";
import useUser from "./useUser";

import useTasksQuery from "~/hooks/useTasksQueries";
import genRandomInt from "~/utils/genRandomInt";
import { isFirstLaunchToday } from "~/utils/isFirstLaunchToday";
import resetRecurringTasks from "~/utils/tasks/resetRecurringTasks";
import wasTaskDueYesterday from "~/utils/tasks/wasTaskDueYesterday";

function useInitializeDailyTasks() {
  const { data: notCompletedTasks } = useTasksQuery();
  const { mutate: updateHealthAndHappiness } = useUpdateHealthAndHappiness();
  const { data: user } = useUser();
  const { data: healthAndHappiness } = useHealthAndHappinessQuery(user?.id);
  const [hasTasksFromYesterday, setHasTasksFromYesterday] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (initialized) return;

      try {
        const isFirstLaunchTodayResult = await isFirstLaunchToday();
        if (!isFirstLaunchTodayResult) return;

        const incompleteTasksFromYesterday =
          notCompletedTasks?.filter(wasTaskDueYesterday) || [];
        setHasTasksFromYesterday(incompleteTasksFromYesterday.length > 0);
        if (hasTasksFromYesterday) {
          // punish user
          updateHealthAndHappiness({
            user_id: user?.id,
            health:
              (healthAndHappiness?.health ?? 0) -
              genRandomInt(16, 24) * incompleteTasksFromYesterday.length,
            happiness:
              (healthAndHappiness?.happiness ?? 0) -
              genRandomInt(16, 24) * incompleteTasksFromYesterday.length,
          });
        }

        await resetRecurringTasks();
      } catch (error) {
        console.error("Error initializing tasks:", error);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate some asynchronous task
        setInitialized(true);
        if (hasTasksFromYesterday) {
          router.push("/(tasks)/tasks-of-yesterday" as Href);
        }
      }
    };

    initialize();
  }, [
    notCompletedTasks,
    updateHealthAndHappiness,
    user,
    initialized,
    healthAndHappiness,
    hasTasksFromYesterday,
  ]);

  return { initialized, hasTasksFromYesterday };
}

export default useInitializeDailyTasks;
