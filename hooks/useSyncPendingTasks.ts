import { useEffect } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { use$ } from "@legendapp/state/react";
import { tasks$, queryClient } from "~/data/observables";
import { supabase } from "~/utils/supabase";
import { ExtendedTask, TaskFormData } from "~/types";

export default function useSyncPendingTasks() {
  const netInfo = useNetInfo();
  const tasks = use$(tasks$("not-completed")) as ExtendedTask[];

  useEffect(() => {
    if (netInfo.isConnected && tasks.some((task) => task.pendingSync)) {
      tasks.forEach(async (task) => {
        if (task.pendingSync) {
          try {
            const { data, error } = await supabase
              .from("tasks")
              .insert({
                title: task.title,
                notes: task.notes,
              })
              .select()
              .single();

            if (error) throw new Error(error.message);

            // Update local task with real ID and remove pendingSync flag
            const filter = "not-completed";
            const tasksObservable = tasks$(filter);
            tasksObservable.set((prevTasks: ExtendedTask[]) =>
              prevTasks.map((t) =>
                t.id === task.id ? { ...data, pendingSync: false } : t,
              ),
            );

            // Sync checklist items if any
            const checklistItems =
              (task as unknown as TaskFormData).checklistItems || [];
            if (checklistItems.length > 0) {
              const itemsToSync = checklistItems.map((item, index) => ({
                task_id: data.id,
                content: item.content.trim(),
                position: index,
                is_complete: false,
              }));
              const { error: checklistError } = await supabase
                .from("checklistitems")
                .insert(itemsToSync);
              if (checklistError) {
                throw new Error("Failed to sync checklist items.");
              }
            }

            await queryClient.invalidateQueries({ queryKey: ["tasks"] });
          } catch (err) {
            console.error("Failed to sync task:", err);
          }
        }
      });
    }
  }, [netInfo.isConnected, tasks]);
}
