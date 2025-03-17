import calculateSuccessPercentage from '../calculateSuccessPercentage';

import { Tables } from '~/database.types';
import { Task } from '~/types';

describe('calculateSuccessPercentage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Daily repeat period', () => {
    it('calculates percentage correctly for multiple days', () => {
      const currentDate = new Date('2025-02-05T12:00:00Z');
      const createdAt = new Date('2025-01-31T12:00:00Z');
      jest.spyOn(Date, 'now').mockImplementation(() => currentDate.getTime());

      const task: Tables<'tasks'> = {
        created_at: createdAt.toISOString(),
        repeat_period: 'Daily',
        repeat_frequency: 1,
      } as Tables<'tasks'>;

      const completionHistory = [...Array(3)].map(() => ({}) as Tables<'task_completion_history'>);
      expect(calculateSuccessPercentage(task, completionHistory)).toBe(60);
    });

    it('returns 0 when created today', () => {
      const currentDate = new Date('2025-01-31T12:00:00Z');
      jest.spyOn(Date, 'now').mockImplementation(() => currentDate.getTime());

      const task: Tables<'tasks'> = {
        created_at: currentDate.toISOString(),
        repeat_period: 'Daily',
        repeat_frequency: 1,
      } as Tables<'tasks'>;

      expect(calculateSuccessPercentage(task, [])).toBe(0);
    });
  });

  describe('Weekly repeat period', () => {
    it('calculates percentage with frequency divisor', () => {
      const currentDate = new Date('2025-03-01T12:00:00Z');
      const createdAt = new Date('2025-02-01T12:00:00Z');
      jest.spyOn(Date, 'now').mockImplementation(() => currentDate.getTime());

      const task: Tables<'tasks'> = {
        created_at: createdAt.toISOString(),
        repeat_period: 'Weekly',
        repeat_frequency: 2,
      } as Tables<'tasks'>;

      const completionHistory = [...Array(1)].map(() => ({}) as Tables<'task_completion_history'>);
      expect(calculateSuccessPercentage(task, completionHistory)).toBe(50);
    });

    it('handles zero expected completions', () => {
      const currentDate = new Date('2025-02-03T12:00:00Z');
      const createdAt = new Date('2025-02-01T12:00:00Z');
      jest.spyOn(Date, 'now').mockImplementation(() => currentDate.getTime());

      const task: Tables<'tasks'> = {
        created_at: createdAt.toISOString(),
        repeat_period: 'Weekly',
        repeat_frequency: 1,
      } as Tables<'tasks'>;

      expect(calculateSuccessPercentage(task, [])).toBe(0);
    });
  });

  describe('Monthly repeat period', () => {
    it('calculates percentage for monthly frequency', () => {
      const currentDate = new Date('2025-05-01T12:00:00Z');
      const createdAt = new Date('2025-02-01T12:00:00Z');
      jest.spyOn(Date, 'now').mockImplementation(() => currentDate.getTime());

      const task: Tables<'tasks'> = {
        created_at: createdAt.toISOString(),
        repeat_period: 'Monthly',
        repeat_frequency: 3,
      } as Tables<'tasks'>;

      const completionHistory = [...Array(1)].map(() => ({}) as Tables<'task_completion_history'>);
      expect(calculateSuccessPercentage(task, completionHistory)).toBe(100);
    });
  });

  describe('Yearly repeat period', () => {
    it('calculates percentage for yearly frequency', () => {
      const currentDate = new Date('2027-01-31T12:00:00Z');
      const createdAt = new Date('2025-01-31T12:00:00Z');
      jest.spyOn(Date, 'now').mockImplementation(() => currentDate.getTime());

      const task: Tables<'tasks'> = {
        created_at: createdAt.toISOString(),
        repeat_period: 'Yearly',
        repeat_frequency: 1,
      } as Tables<'tasks'>;

      const completionHistory = [...Array(1)].map(() => ({}) as Tables<'task_completion_history'>);
      expect(calculateSuccessPercentage(task, completionHistory)).toBe(50);
    });
  });

  describe('Edge cases', () => {
    it('returns 0 for unknown repeat period', () => {
      const task = {
        created_at: new Date().toISOString(),
        repeat_period: 'Invalid',
      } as unknown as Tables<'tasks'>;

      expect(calculateSuccessPercentage(task, [])).toBe(0);
    });

    it('uses default frequency when not provided', () => {
      const currentDate = new Date('2025-02-07T12:00:00Z');
      const createdAt = new Date('2025-01-31T12:00:00Z');
      jest.spyOn(Date, 'now').mockImplementation(() => currentDate.getTime());

      const task: Tables<'tasks'> = {
        created_at: createdAt.toISOString(),
        repeat_period: 'Weekly',
        repeat_frequency: null,
      } as Tables<'tasks'>;

      const completionHistory = [...Array(1)].map(() => ({}) as Tables<'task_completion_history'>);
      expect(calculateSuccessPercentage(task, completionHistory)).toBe(100);
    });
  });
});
