// Global imports
import { format } from 'date-fns';

export function time(dateStr: string): string {
  if (dateStr) {
    return format(dateStr, 'HH:mm');
  }
  return '';
}
