// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// File: sortEntries.ts
import type { LogEntry } from 'common/LogEntry';

/**
 * Returns a new array of log entries with offline entries displayed above online entries.
 *
 * Offline entries:
 *  - Are sorted based on their numeric 'sequence' property.
 *
 * Online entries:
 *  - Are sorted by createdAt.
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
    const seqA = Number(a.sequence);
    const seqB = Number(b.sequence);
    if (seqA === seqB) {
      return 0;
    }

    if (sortAsc) {
      return seqA < seqB ? -1 : 1;
    }
    return seqA > seqB ? -1 : 1;
  });

  // Sort online entries by createdAt timestamp.
  const sortedOnline = onlineEntries.toSorted((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return sortAsc ? aTime - bTime : bTime - aTime;
  });

  // Combine the groups: offline entries come first, followed by online entries.
  return [...sortedOffline, ...sortedOnline];
};
