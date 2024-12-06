// Local imports
import { type LogEntry } from 'common/LogEntry';

export function categoryMatches(e: LogEntry, categories: Array<string>): boolean {
  if (categories.length > 0) {
    return categories.includes(e.type);
  }
  return true;
}
