import { RepeatPeriod } from '~/types';

export default function getRepeatPeriodLabel(
  period: RepeatPeriod | null,
): string | null | undefined {
  switch (period) {
    case 'Daily':
      return 'days';
    case 'Weekly':
      return 'weeks';
    case 'Monthly':
      return 'months';
    case 'Yearly':
      return 'year';
    case null:
      return null;
    default:
      console.error('Unhandled RepeatPeriod value');
  }
}
