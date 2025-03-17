import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '~/utils/supabase';

interface HealthAndHappiness {
  updated_at: string;
  happiness: number | null;
  health: number | null;
  id: number;
  user_id: string;
}

function useCreateHealthAndHappiness(user_id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<HealthAndHappiness, Error, void>({
    mutationFn: async () => {
      if (!user_id) {
        throw new Error('User ID is required to create health and happiness.');
      }

      const optimisticData: HealthAndHappiness = {
        id: Date.now(), // Use a temporary ID for optimistic update
        updated_at: new Date().toISOString(),
        happiness: null,
        health: null,
        user_id,
      };

      // Optimistically update the cache
      queryClient.setQueryData(['health-and-happiness', user_id], optimisticData);

      const { data, error } = await supabase
        .from('health_and_happiness')
        .insert({ user_id })
        .select()
        .single();

      if (error) {
        console.error('Error creating health and happiness:', error);
        throw new Error('Failed to create health and happiness. Please try again.');
      }

      return data as HealthAndHappiness;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['health-and-happiness', user_id], data);
      queryClient.invalidateQueries({ queryKey: ['health-and-happiness', user_id] });
    },
    onError: (error, variables, context) => {
      console.error('Error creating health and happiness:', error);
      queryClient.invalidateQueries({ queryKey: ['health-and-happiness', user_id] });
    },
  });
}

function useUpdateHealthAndHappiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      params: Readonly<{ user_id: string | undefined; health: number; happiness: number }>,
    ) => {
      if (!params.user_id) {
        throw new Error('User ID is required to update health and happiness.');
      }

      const optimisticData: HealthAndHappiness = {
        id: Date.now(), // Use a temporary ID for optimistic update
        updated_at: new Date().toISOString(),
        happiness: params.happiness,
        health: params.health,
        user_id: params.user_id,
      };

      // Optimistically update the cache
      queryClient.setQueryData(['health-and-happiness', params.user_id], optimisticData);

      const data = await upsertHealthAndHappiness(params.user_id, params.health, params.happiness);
      return data;
    },
    onSuccess: (data, params) => {
      queryClient.setQueryData(['health-and-happiness', params.user_id], data);
      queryClient.invalidateQueries({ queryKey: ['health-and-happiness', params.user_id] });
    },
    onError: (error, variables, context) => {
      console.error('Error updating health and happiness:', error);
      queryClient.invalidateQueries({ queryKey: ['health-and-happiness', variables.user_id] });
    },
  });
}

async function upsertHealthAndHappiness(
  user_id: string | undefined,
  health: number,
  happiness: number,
) {
  if (!user_id) {
    throw new Error('User ID is required to update health and happiness.');
  }

  const { data, error } = await supabase
    .from('health_and_happiness')
    .upsert(
      {
        updated_at: new Date().toISOString(),
        happiness: happiness,
        health: health,
        user_id: user_id,
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) {
    console.error('Error updating health and happiness:', error);
    throw new Error('Failed to update health and happiness. Please try again.');
  }

  return data;
}

export { useCreateHealthAndHappiness, useUpdateHealthAndHappiness };
