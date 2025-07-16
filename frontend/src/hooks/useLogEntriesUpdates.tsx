// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

import useMessaging from './useMessaging';
import { useToast } from './useToasts';

const POLLING_INTERVAL_SECONDS = 10;
const POLLING_INTERVAL_MS = POLLING_INTERVAL_SECONDS * 1000;

const pollingResetRef = { current: null as (() => void) | null };

export function useLogEntriesUpdates(incidentId: string) {
  const queryClient = useQueryClient();
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

  const resetPollingInterval = useCallback(() => {
    clearPolling();
    pollingIntervalRef.current = setInterval(invalidateQueries, POLLING_INTERVAL_MS);
  }, [clearPolling, invalidateQueries]);

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
}

export const resetPolling = () => {
  if (pollingResetRef.current) {
    pollingResetRef.current();
  }
};
