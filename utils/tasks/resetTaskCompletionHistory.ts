import { Tables } from '~/database.types';
import { supabase } from '~/utils/supabase';

export default async function resetTaskCompletionHistory(): Promise<{
  data: Tables<'task_completion_history'>[] | null;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('task_completion_history')
    .delete()
    .neq('task_id', -1);

  if (error) {
    console.error('Supabase deletion error:', error);
    return { data: null, error: new Error('Failed to reset completion history') };
  }

  return { data, error: null };
}
