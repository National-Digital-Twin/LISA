// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from 'common/LogEntry';
import { v4 as uuidV4 } from 'uuid';

import useMessaging from './useMessaging';
import { useToast } from './useToasts';

const POLLING_INTERVAL_SECONDS = 30;
const POLLING_INTERVAL_MS = POLLING_INTERVAL_SECONDS * 1000;

const pollingResetRef = { current: null as (() => void) | null };
const optimisticEntriesRef = { current: new Map<string, LogEntry>() };
let globalQueryClient: QueryClient | null = null;

type OptimisticEntryParams = Omit<LogEntry, 'id' | 'author'>;

export function useLogEntriesUpdates(incidentId: string) {
  const queryClient = useQueryClient();
  globalQueryClient = queryClient;
  const [hasNewLogEntries, resetNewLogEntries] = useMessaging('NewLogEntries', incidentId);
  const postToast = useToast();
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const invalidateQueries = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: [`incident/${incidentId}/logEntries`]
    });
    await queryClient.invalidateQueries({
      queryKey: [`incident/${incidentId}/attachments`]
    });
  }, [queryClient, incidentId]);

  const clearPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    clearPolling();
    pollingIntervalRef.current = setInterval(invalidateQueries, POLLING_INTERVAL_MS);
  }, [clearPolling, invalidateQueries]);

  const createOptimisticEntry = useCallback(
    (logEntry: OptimisticEntryParams) => {
      if (!incidentId) {
        throw new Error('incidentId is required for optimistic entry creation');
      }

      const previousEntries = queryClient.getQueryData<LogEntry[]>([
        `incident/${incidentId}/logEntries`
      ]);

      const offlineCount = previousEntries?.filter((entry: LogEntry) => entry.offline).length ?? 0;
      const optimisticEntry: LogEntry = {
        ...logEntry,
        id: uuidV4(),
        sequence: `${offlineCount + 1}`,
        offline: true
      };

      optimisticEntriesRef.current.set(optimisticEntry.id!, optimisticEntry);
      queryClient.setQueryData<LogEntry[]>([`incident/${incidentId}/logEntries`], (oldData) =>
        oldData!.concat(optimisticEntry)
      );

      return { optimisticEntry, previousEntries };
    },
    [queryClient, incidentId]
  );

  const removeOptimisticEntry = useCallback((entryId: string) => {
    optimisticEntriesRef.current.delete(entryId);
  }, []);

  const cleanConfirmedOptimisticEntries = useCallback(async () => {
    const currentEntries = queryClient.getQueryData<LogEntry[]>([
      `incident/${incidentId}/logEntries`
    ]);

    const optimisticEntries = Array.from(optimisticEntriesRef.current.entries());
    optimisticEntries.forEach(([optimisticId]) => {
      const confirmedEntry = currentEntries?.find((entry) => entry.id !== optimisticId);

      if (confirmedEntry) {
        optimisticEntriesRef.current.delete(optimisticId);
      }
    });
  }, [queryClient, incidentId]);

  const pollWithCleanup = useCallback(async () => {
    await invalidateQueries();
    await cleanConfirmedOptimisticEntries();
  }, [invalidateQueries, cleanConfirmedOptimisticEntries]);

  const resetPollingInterval = useCallback(() => {
    clearPolling();
    pollingIntervalRef.current = setInterval(pollWithCleanup, POLLING_INTERVAL_MS);
  }, [clearPolling, pollWithCleanup]);

  useEffect(() => {
    if (!incidentId) return;

    startPolling();
    pollingResetRef.current = resetPollingInterval;

    // eslint-disable-next-line consistent-return
    return () => {
      clearPolling();
      pollingResetRef.current = null;
    };
  }, [incidentId, startPolling, resetPollingInterval, clearPolling]);

  useEffect(() => {
    if (!hasNewLogEntries) return;

    postToast({
      type: 'Info',
      id: `NEW_LOG_ENTRIES:${incidentId}`,
      content: (
        <span>
          New log entries have been detected. Checking for updates every {POLLING_INTERVAL_SECONDS}{' '}
          seconds...
        </span>
      ),
      isDismissable: true
    });

    resetNewLogEntries();
  }, [incidentId, postToast, hasNewLogEntries, resetNewLogEntries]);

  return { addOptimisticEntry: createOptimisticEntry, removeOptimisticEntry };
}

export const resetPolling = () => {
  if (pollingResetRef.current) {
    pollingResetRef.current();
  }
};

export const addOptimisticLogEntry = (incidentId: string, logEntry: OptimisticEntryParams) => {
  if (!globalQueryClient || !incidentId) {
    throw new Error('QueryClient or incidentId not available');
  }

  const previousEntries = globalQueryClient.getQueryData<LogEntry[]>([
    `incident/${incidentId}/logEntries`
  ]);

  const offlineCount = previousEntries?.filter((entry: LogEntry) => entry.offline).length ?? 0;
  const optimisticEntry: LogEntry = {
    ...logEntry,
    id: uuidV4(),
    sequence: `${offlineCount + 1}`,
    offline: true
  };

  optimisticEntriesRef.current.set(optimisticEntry.id!, optimisticEntry);
  globalQueryClient.setQueryData<LogEntry[]>([`incident/${incidentId}/logEntries`], (oldData) =>
    oldData!.concat(optimisticEntry)
  );

  return { optimisticEntry, previousEntries };
};
