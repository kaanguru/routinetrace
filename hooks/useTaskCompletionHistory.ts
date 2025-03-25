import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useUser from './useUser';

import { supabase } from '~/utils/supabase';
import getTaskCompletionHistory from '~/utils/tasks/getTaskCompletionHistory';
import resetTaskCompletionHistory from '~/utils/tasks/resetTaskCompletionHistory';

export default function useTaskCompletionHistory(taskID: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getTaskCompletionHistory(taskID),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['taskCompletionHistory', taskID] });
      const previousHistory = queryClient.getQueryData(['taskCompletionHistory', taskID]);
      queryClient.setQueryData(['taskCompletionHistory', taskID], (old: unknown) => [
        ...(old as unknown[]),
        { task_id: taskID, completed_at: new Date() },
      ]);
      return { previousHistory };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['taskCompletionHistory', taskID], context?.previousHistory);
      console.error('Error logging task completion:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taskCompletionHistory', taskID] });
    },
  });
}

export function useResetCompletionHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetTaskCompletionHistory,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['taskCompletionHistory'] });
      const previousHistory = queryClient.getQueryData(['taskCompletionHistory']);
      queryClient.setQueryData(['taskCompletionHistory'], []);
      return { previousHistory };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['taskCompletionHistory'], context?.previousHistory);
      console.error('Error resetting completion history:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['taskCompletionHistory'],
        refetchType: 'active',
      });
    },
  });
}
export function useTaskCompletionCount() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['completedTasksHistory'],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is not available');
      }

      // Fetch all completed tasks for the user
      const { data: completedTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_complete', true);

      if (tasksError) {
        throw new Error(tasksError.message);
      }

      // Extract task IDs from the completed tasks
      const taskIds = completedTasks.map((task) => task.id);

      // Fetch the completion history for these tasks
      const { data: completionHistory, error: historyError } = await supabase
        .from('task_completion_history')
        .select('*')
        .in('task_id', taskIds);

      if (historyError) {
        throw new Error(historyError.message);
      }

      return completionHistory;
    },
    enabled: !!user?.id, // Ensure the query is only enabled when user ID is available
  });
}
