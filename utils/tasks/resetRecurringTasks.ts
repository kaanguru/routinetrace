import { supabase } from "../supabase";

async function resetRecurringTasks() {
  const { error } = await supabase
    .from("tasks")
    .update({ is_complete: false })
    .not("repeat_period", "is", null); // Check for IS NOT NULL

  if (error) {
    console.error("Error resetting recurring tasks:", error);
  }
}
export default resetRecurringTasks;
