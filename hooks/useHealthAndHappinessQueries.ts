import { useQuery } from '@tanstack/react-query';

import { Tables } from '~/database.types';
import { supabase } from '~/utils/supabase';

export default function useHealthAndHappinessQuery(user_id: string | undefined) {
  return useQuery({
    queryKey: ['health-and-happiness', user_id],
    queryFn: () => fetchLastHealthAndHappiness(user_id),
    enabled: !!user_id, // Only run the query if user_id is truthy
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3, // Retry on failure up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with a max of 30 seconds
  });
}
async function fetchLastHealthAndHappiness(
  user_id: string | undefined,
): Promise<Tables<'health_and_happiness'> | null> {
  if (!user_id) {
    return null;
  }

  const { data, error } = await supabase
    .from('health_and_happiness')
    .select('*')
    .eq('user_id', user_id)
    .order('updated_at', { ascending: false }) // Order by creation time descending
    .limit(1) // Only get the most recent record
    .maybeSingle(); // Changed from .single()

  if (error) {
    console.error('Error fetching health and happiness:', error);
    return null;
  }

  return data;
}
