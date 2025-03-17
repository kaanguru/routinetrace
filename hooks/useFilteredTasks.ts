import { useMemo } from 'react';

import { Tables } from '~/database.types';
import isTaskDueToday from '~/utils/tasks/isTaskDueToday';

function useFilteredTasks(tasks: Tables<'tasks'>[], isFiltered: boolean) {
  return {
    filteredTasks: useMemo(
      () => (isFiltered ? tasks.filter(isTaskDueToday) : tasks),
      [isFiltered, tasks],
    ),
  };
}

export default useFilteredTasks;
