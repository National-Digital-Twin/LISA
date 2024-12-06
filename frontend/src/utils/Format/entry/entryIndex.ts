// Local imports
import { type LogEntry } from 'common/LogEntry';

const MIN_PAD_LENGTH = 3;
function padIndex(index: string, entryCount: number) {
  // eslint-disable-next-line no-bitwise
  const padLength = Math.max(MIN_PAD_LENGTH, (Math.log(entryCount) * Math.LOG10E + 1) | 0);
  return index.padStart(padLength, '0');
}

export function entryIndex(entry: LogEntry): string {
  if (entry?.offline) {
    return entry.sequence ?? '-0';
  }
  if (entry?.sequence) {
    return padIndex(entry.sequence, 4);
  }
  return '0000';
}
