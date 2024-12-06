// Global imports
import { format } from 'date-fns';

export function isoDate(dateStr: string): string {
  if (dateStr) {
    return format(dateStr, 'yyyy-MM-dd');
  }
  return '';
}
