import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

import isTaskDueToday from '../isTaskDueToday';

import { Tables } from '~/database.types';
import { DayOfWeek } from '~/types';

//bypass test for now
describe.skip('isTaskDueToday', () => {
  const today = new Date();

  it('should return true for a daily task that is due today', () => {
    //@ts-expect-error missing fields
    const task: Tables<'tasks'> = {
      created_at: addDays(today, -1).toISOString(),
      repeat_period: 'Daily',
      repeat_frequency: 1,
    };
    expect(isTaskDueToday(task)).toBe(true);
  });

  it('should return false for a daily task that is not due today', () => {
    //@ts-expect-error missing fields
    const task: Tables<'tasks'> = {
      created_at: addDays(today, -5).toISOString(),
      repeat_period: 'Daily',
      repeat_frequency: 2,
    };
    expect(isTaskDueToday(task)).toBe(false);
  });

  it('should return true for a weekly task that is due today', () => {
    const daysOfWeek: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = today.getDay();
    const dayOfWeek = daysOfWeek[dayIndex];

    const task: Tables<'tasks'> = {
      created_at: addWeeks(today, -1).toISOString(),
      repeat_period: 'Weekly',
      repeat_frequency: 1,
      repeat_on_wk: [dayOfWeek],
      id: 0,
      is_complete: false,
      notes: null,
      position: null,
      title: '',
      updated_at: null,
      user_id: '',
    };
    expect(isTaskDueToday(task)).toBe(true);
  });

  it('should return false for a weekly task that is not due today', () => {
    const daysOfWeek: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = (today.getDay() + 1) % 7;
    const dayOfWeek = daysOfWeek[dayIndex];

    const task: Tables<'tasks'> = {
      created_at: addWeeks(today, -2).toISOString(),
      repeat_period: 'Weekly',
      repeat_frequency: 2,
      repeat_on_wk: [dayOfWeek],
      id: 0,
      is_complete: false,
      notes: null,
      position: null,
      title: '',
      updated_at: null,
      user_id: '',
    };
    expect(isTaskDueToday(task)).toBe(false);
  });

  it('should return true for a monthly task that is due today', () => {
    const task: Tables<'tasks'> = {
      created_at: addMonths(today, -1).toISOString(),
      repeat_period: 'Monthly',
      repeat_frequency: 1,
      id: 0,
      is_complete: false,
      notes: null,
      position: null,
      repeat_on_wk: null,
      title: '',
      updated_at: null,
      user_id: '',
    };
    expect(isTaskDueToday(task)).toBe(true);
  });

  it('should return false for a monthly task that is not due today', () => {
    //@ts-expect-error
    const task: Tables<'tasks'> = {
      created_at: addMonths(today, -2).toISOString(),
      repeat_period: 'Monthly',
      repeat_frequency: 3,
    };
    expect(isTaskDueToday(task)).toBe(false);
  });

  it('should return true for a yearly task that is due today', () => {
    const task: Tables<'tasks'> = {
      created_at: addYears(today, -1).toISOString(),
      repeat_period: 'Yearly',
      repeat_frequency: 1,
      id: 0,
      is_complete: false,
      notes: null,
      position: null,
      repeat_on_wk: null,
      title: '',
      updated_at: null,
      user_id: '',
    };
    expect(isTaskDueToday(task)).toBe(true);
  });

  it('should return false for a yearly task that is not due today', () => {
    //@ts-expect-error
    const task: Tables<'tasks'> = {
      created_at: addMonths(today, -3).toISOString(),
      repeat_period: 'Yearly',
      repeat_frequency: 2,
    };
    expect(isTaskDueToday(task)).toBe(false);
  });

  it('should return true for a task with no repeat period', () => {
    const task: Tables<'tasks'> = {
      created_at: today.toISOString(),
      repeat_period: null,
      id: 0,
      is_complete: false,
      notes: null,
      position: null,
      repeat_frequency: null,
      repeat_on_wk: null,
      title: '',
      updated_at: null,
      user_id: '',
    };
    expect(isTaskDueToday(task)).toBe(true);
  });

  it('should return true for a task with an unknown repeat period', () => {
    const task: Tables<'tasks'> = {
      created_at: today.toISOString(),
      repeat_period: null,
      id: 0,
      is_complete: false,
      notes: null,
      position: null,
      repeat_frequency: null,
      repeat_on_wk: null,
      title: '',
      updated_at: null,
      user_id: '',
    };
    expect(isTaskDueToday(task)).toBe(true);
  });
});
