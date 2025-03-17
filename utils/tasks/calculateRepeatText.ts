import { RepeatPeriod } from '~/types';

export function calculateRepeatText(repeatPeriod: RepeatPeriod | '', repeatFrequency: number) {
  if (!repeatPeriod) return '';
  const period = {
    Daily: { singular: 'day', plural: 'days' },
    Weekly: { singular: 'week', plural: 'weeks' },
    Monthly: { singular: 'month', plural: 'months' },
    Yearly: { singular: 'year', plural: 'years' },
  }[repeatPeriod];
  return `${repeatFrequency} ${repeatFrequency > 1 ? period.plural : period.singular}`;
}
