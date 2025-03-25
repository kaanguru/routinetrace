import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Tables } from '~/database.types';
import { supabase } from '~/utils/supabase';

export default function useUpdateTaskPositions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reorderedTasks: readonly Tables<'tasks'>[]) => {
      const updates = reorderedTasks.map((task, index) =>
        supabase.from('tasks').update({ position: index }).eq('id', task.id),
      );
      const results = await Promise.all(updates);
      const errors = results.flatMap((result) => (result.error ? [result.error] : []));
      if (errors.length > 0)
        return Promise.reject(new Error(`Failed to update ${errors.length} tasks`));
    },
    onMutate: async (reorderedTasks) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Tables<'tasks'>[]>(['tasks']);
      queryClient.setQueryData(['tasks'], reorderedTasks);
      return { previousTasks };
    },
    onError: (err, _, context) => {
      if (context?.previousTasks) queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
