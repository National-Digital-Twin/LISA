// Global imports
import { format } from 'date-fns';

export function date(dateStr: string): string {
  if (dateStr) {
    return format(dateStr, 'd MMM yyyy');
  }
  return '';
}
