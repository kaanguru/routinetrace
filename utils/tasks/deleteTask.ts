import { supabase } from '../supabase';

import { Task } from '~/types';

export default async function deleteTask(taskID: Task['id']) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskID);

  if (error) {
    console.error('Error deleting task:', error);
    return null; // Return null on error instead of throwing
  }

  return null; // Return null to indicate successful deletion
}
