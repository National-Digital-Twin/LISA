// Local imports
import { type LogEntry } from 'common/LogEntry';

export function authorMatches(e: LogEntry, authors: Array<string>): boolean {
  if (authors.length > 0 && e.author?.username) {
    return authors.includes(e.author.username);
  }
  return true;
}
