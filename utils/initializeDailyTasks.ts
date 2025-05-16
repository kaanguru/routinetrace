import { isFirstLaunchToday } from "./isFirstLaunchToday";
import resetRecurringTasks from "./tasks/resetRecurringTasks";

export default async function initializeDailyTasks() {
  try {
    const isFirstLaunchTodayResult = await isFirstLaunchToday();
    if (!isFirstLaunchTodayResult) return;
    await resetRecurringTasks();
  } catch (error) {
    console.error("Error initializing tasks:", error);
  }
}
