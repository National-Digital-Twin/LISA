// File: sortEntries.ts
import type { LogEntry } from 'common/LogEntry';

/**
 * Returns a new array of log entries with offline entries displayed above online entries.
 *
 * Offline entries:
 *  - Are sorted based on their numeric 'displaySequence' property.
 *  - Their displaySequence is re-assigned to reflect visual order:
 *      • If sortAsc is true, the top offline entry gets 1, then 2, 3, etc.
 *      • If sortAsc is false (default), the offline entries are sorted descending and the top entry
 *        gets the highest displaySequence (equal to the offline group length), decreasing for
 *        subsequent entries.
 *
 * Online entries:
 *  - Are sorted by createdAt.
 *  - Their displaySequence is also re-assigned:
 *      • In ascending order, the top online entry gets 1, then 2, 3, etc.
 *      • In descending order, the top online entry gets the highest number (equal to the online
 *      list length), etc.
 *
 * The offline group is always placed before the online group.
 *
 * @param sortAsc - Determines whether to sort in ascending order (true) or descending order (false,
 *        default).
 * @param entries - The array of log entries to sort.
 */
export const getSortedEntriesWithDisplaySequence = (
  sortAsc: boolean,
  entries: LogEntry[]
): LogEntry[] => {
  // Partition entries into offline and online groups.
  const offlineEntries = entries.filter((entry) => entry.offline);
  const onlineEntries = entries.filter((entry) => !entry.offline);

  // Sort offline entries using their numeric 'displaySequence' property.
  const sortedOffline = offlineEntries.toSorted((a, b) => {
    const seqA = Number(a.displaySequence);
    const seqB = Number(b.displaySequence);
    return sortAsc ? seqB - seqA : seqA - seqB;
  });

  // Assign displaySequence for offline entries based on visual order.
  const offlineWithSequence = sortedOffline.map((entry, index, arr) => {
    const newDisplaySequence = sortAsc ? index + 1 : arr.length - index;
    return {
      ...entry,
      displaySequence: newDisplaySequence,
    };
  });

  // Sort online entries by createdAt timestamp.
  const sortedOnline = onlineEntries.toSorted((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return sortAsc ? aTime - bTime : bTime - aTime;
  });

  // Assign displaySequence for online entries based on visual order.
  const onlineWithSequence = sortedOnline.map((entry, index, arr) => {
    const newDisplaySequence = sortAsc ? index + 1 : arr.length - index;
    return {
      ...entry,
      displaySequence: newDisplaySequence,
    };
  });

  // Combine the groups: offline entries come first, followed by online entries.
  return [...offlineWithSequence, ...onlineWithSequence];
};
