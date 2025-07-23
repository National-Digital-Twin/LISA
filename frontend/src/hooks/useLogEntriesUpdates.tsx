// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { type LogEntry } from 'common/LogEntry';

import { get } from '../api';

const POLLING_INTERVAL_SECONDS = 10;
const POLLING_INTERVAL_MS = POLLING_INTERVAL_SECONDS * 1000;

let globalQueryClient: QueryClient | null = null;

export function useLogEntriesUpdates(incidentId: string) {
  const queryClient = useQueryClient();
  globalQueryClient = queryClient;
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncEntries = useCallback(async () => {
    try {
      const entries: LogEntry[] = await get<LogEntry[]>(`/incident/${incidentId}/logEntries`);
      const cachedEntries: LogEntry[] | undefined = queryClient.getQueryData<LogEntry[]>([
        `incident/${incidentId}/logEntries`
      ]);
      const matchedEntries: LogEntry[] = [];
      let unmatchedEntries: LogEntry[] = [];

      if (cachedEntries) {
        cachedEntries?.forEach((cachedEntry) => {
          const matchedEntry = entries.find((entry) => entry.id === cachedEntry.id);

          if (matchedEntry) {
            matchedEntries.push(matchedEntry);
          } else {
            unmatchedEntries.push(cachedEntry);
          }
        });
      } else {
        unmatchedEntries = entries;
      }

      queryClient.setQueryData<LogEntry[]>(
        [`incident/${incidentId}/logEntries`],
        [...matchedEntries, ...unmatchedEntries]
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error occured: ${error}. Unable to poll for updates!`);
    }
  }, [incidentId, queryClient]);

  const startPolling = useCallback(() => {
    pollingIntervalRef.current = setInterval(syncEntries, POLLING_INTERVAL_MS);
  }, [syncEntries]);

  const clearPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  return { startPolling, clearPolling };
}

export const addOptimisticLogEntry = (incidentId: string, logEntry: LogEntry) => {
  if (!globalQueryClient || !incidentId) {
    throw new Error('QueryClient or incidentId not available');
  }

  const previousEntries = globalQueryClient.getQueryData<LogEntry[]>([
    `incident/${incidentId}/logEntries`
  ]);

  const offlineCount = previousEntries?.filter((entry: LogEntry) => entry.offline).length ?? 0;
  const optimisticEntry: LogEntry = {
    ...logEntry,
    sequence: `${offlineCount + 1}`,
    offline: true
  };

  globalQueryClient.setQueryData<LogEntry[]>(
    [`incident/${incidentId}/logEntries`],
    (oldData) => oldData?.concat(optimisticEntry) || [optimisticEntry]
  );
  const updatedEntries = previousEntries?.concat(optimisticEntry) || [optimisticEntry];

  return { previousEntries, updatedEntries };
};
