import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { TaskFormData } from "~/types";
import { supabase } from "~/utils/supabase";

export default function useChecklistItemMutations(taskID: number | string) {
  const queryClient = useQueryClient();

  const addChecklistItemMutation = useMutation({
    async mutationFn(content: string) {
      const { data, error } = await supabase
        .from("checklistitems")
        .insert({ content, task_id: +taskID })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["checklistItems", taskID],
      });
    },
    onError(error) {
      Alert.alert("Error", error.message);
    },
  });

  const upsertChecklistItemMutation = useMutation({
    async mutationFn(content: string) {
      const { data, error } = await supabase
        .from("checklistitems")
        .upsert({ content, task_id: +taskID })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["checklistItems", taskID],
      });
    },
    onError(error) {
      Alert.alert("Error", error.message);
    },
  });

  const updateChecklistItemMutation = useMutation({
    mutationFn: async (formData: Readonly<TaskFormData>) => {
      if (!taskID) throw new Error("No task ID");

      const { error: deleteError } = await supabase
        .from("checklistitems")
        .delete()
        .eq("task_id", +taskID);

      if (deleteError)
        throw new Error("Failed to clear existing checklist items");

      if (formData.checklistItems.length > 0) {
        const checklistItemsToInsert = formData.checklistItems.map(
          (item, index) => ({
            task_id: +taskID,
            content: item.content.trim(),
            position: index,
            is_complete: item.isComplete || false,
          }),
        );

        const { error: insertError } = await supabase
          .from("checklistitems")
          .insert(checklistItemsToInsert);

        if (insertError) throw new Error("Failed to update checklist items");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["checklistItems", taskID], // Keep this
      });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Add this
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      Alert.alert("Error", error.message || "Failed to update task");
    },
  });

  const deleteChecklistItemMutation = useMutation({
    async mutationFn(checklistItemId: number) {
      const { error } = await supabase
        .from("checklistitems")
        .delete()
        .eq("id", checklistItemId);

      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["checklistItems", taskID],
      });
    },
    onError(error) {
      Alert.alert("Error", error.message);
    },
  });

  const updateChecklistItemCompletionMutation = useMutation({
    async mutationFn({
      id,
      is_complete,
    }: {
      id: number;
      is_complete: boolean;
    }) {
      const { data, error } = await supabase
        .from("checklistitems")
        .update({ is_complete, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["checklistItems", taskID],
      });
    },
    onError(error) {
      Alert.alert("Error", error.message);
    },
  });

  return {
    addChecklistItem: addChecklistItemMutation.mutate,
    upsertChecklistItem: upsertChecklistItemMutation.mutate,
    updateChecklistItem: updateChecklistItemMutation.mutate,
    deleteChecklistItem: deleteChecklistItemMutation.mutate,
    updateChecklistItemCompletion: updateChecklistItemCompletionMutation.mutate,
  };
}
