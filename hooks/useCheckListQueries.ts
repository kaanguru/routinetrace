import { useQuery } from '@tanstack/react-query';

import { Database } from '~/database.types';
import { supabase } from '~/utils/supabase';

type ChecklistItem = Database['public']['Tables']['checklistitems']['Row'];

export default function useChecklistItems(taskID: number | string) {
  const checklistItemsQuery = useQuery<ChecklistItem[], Error>({
    queryKey: ['checklistItems', taskID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checklistitems')
        .select('*')
        .eq('task_id', +taskID)
        .order('position', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!taskID, // Only run the query if taskID is truthy
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3, // Retry on failure up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with a max of 30 seconds
  });

  return {
    ...checklistItemsQuery,
    checkListItems: checklistItemsQuery.data,
    isCheckListItemsLoading: checklistItemsQuery.isLoading,
    isCheckListItemsError: checklistItemsQuery.isError,
    checkListItemsError: checklistItemsQuery.error,
    checkListItemsLength: checklistItemsQuery.data?.length || 0,
  };
}
