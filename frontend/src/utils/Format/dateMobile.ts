import { format } from 'date-fns';

export function dateMobile(dateStr: string): string {
  if (dateStr) {
    return `${format(dateStr, 'd MMM yyyy')} @ ${format(dateStr, 'HH:mm')}`;
  }
  return '';
}
