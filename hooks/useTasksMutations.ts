import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Tables } from '~/database.types';
import { TaskFormData } from '~/types';
import { supabase } from '~/utils/supabase';
function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: Readonly<TaskFormData>) => {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: formData.title.trim(),
          notes: formData.notes.trim() || null,
          created_at: (formData.customStartDate || new Date()).toISOString(),
          repeat_on_wk: formData.repeatOnWk.length > 0 ? formData.repeatOnWk : null,
          repeat_frequency: formData.repeatFrequency || null,
          repeat_period: formData.repeatPeriod || null,
        })
        .select()
        .single();

      if (taskError) throw new Error('Failed to create task. Please try again.');
      if (!taskData) throw new Error('Failed to create task. No data returned.');

      if (formData.checklistItems.length > 0) {
        const { error: checklistError } = await supabase.from('checklistitems').insert(
          formData.checklistItems.map((item, index) => ({
            task_id: taskData.id,
            content: item.content.trim(),
            position: index,
            is_complete: false,
          })),
        );

        if (checklistError) {
          console.error('Checklist error:', checklistError);
          throw new Error('Failed to create checklist items. Please try again.');
        }
      }

      return taskData;
    },
    onSuccess: () => {
      // Invalidate and refetch the tasks query to update the list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      // Handle error appropriately, possibly with a toast or alert
    },
  });
}

function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedTask: Readonly<Tables<'tasks'>>) => {
      const { error, data } = await supabase // Capture 'data'
        .from('tasks')
        .update(updatedTask)
        .eq('id', updatedTask.id)
        .select()
        .single();

      if (error) throw new Error('Failed to update task. Please try again.');
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.setQueryData(['tasks', data.id], data);
      }
    },
    onError: (error) => {
      console.error('Error updating task:', error);
    },
  });
}

function useToggleComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: Readonly<{ taskID: number; isComplete: boolean }>) => {
      if (typeof params.isComplete === 'undefined') {
        console.error('Cannot toggle completion - isComplete is undefined');
        return;
      }

      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          is_complete: params.isComplete,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.taskID);

      if (updateError) {
        console.error('Task update failed:', updateError.message);
        return;
      }

      if (params.isComplete) {
        const { error: logError } = await supabase
          .from('task_completion_history')
          .insert([{ task_id: params.taskID }]);

        if (logError) {
          console.error('Completion logging failed:', logError.message);
        }
      }
    },
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Tables<'tasks'>[]>(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Tables<'tasks'>[] | undefined) =>
        (old || []).map((task) =>
          task.id === params.taskID
            ? { ...task, is_complete: params.isComplete, updated_at: new Date().toISOString() }
            : old,
        ),
      );
      return { previousTasks };
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      console.error('Error toggling task completion:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskID: number | string) => {
      if (!taskID) return;

      const { error } = await supabase.from('tasks').delete().eq('id', +taskID);
    },
    onMutate: async (params) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
    },
    onSuccess: () => {
      // Invalidate the query cache for the tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error, variables, context) => {
      console.error('Error toggling task completion:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
export { useToggleComplete, useUpdateTask, useDeleteTask, useCreateTask };
