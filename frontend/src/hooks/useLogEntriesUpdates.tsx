// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import useMessaging from './useMessaging';
import { useToast } from './useToasts';

export function useLogEntriesUpdates(incidentId: string) {
  const pollingInterval = 10;
  const queryClient = useQueryClient();
  const [hasNewLogEntries, resetNewLogEntries] = useMessaging('NewLogEntries', incidentId);
  const postToast = useToast();
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!incidentId) return;

    const pollForNewEntries = async () => {
      await queryClient.invalidateQueries({
        queryKey: [`incident/${incidentId}/logEntries`]
      });
      await queryClient.invalidateQueries({
        queryKey: [`incident/${incidentId}/attachments`]
      });
    };

    pollingIntervalRef.current = setInterval(pollForNewEntries, pollingInterval * 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [incidentId, queryClient]);

  useEffect(() => {
    if (!hasNewLogEntries) return;

    postToast({
      type: 'Info',
      id: `NEW_LOG_ENTRIES:${incidentId}`,
      content: (
        <span>
          New log entries have been detected. Checking for updates every {pollingInterval} seconds...
        </span>
      ),
      isDismissable: true
    });

    resetNewLogEntries();
  }, [incidentId, queryClient, postToast, hasNewLogEntries, resetNewLogEntries]);
}
