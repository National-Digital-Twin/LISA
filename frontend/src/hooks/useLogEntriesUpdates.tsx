// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import useMessaging from './useMessaging';
import { useToast } from './useToasts';

export function useLogEntriesUpdates(incidentId: string) {
  const queryClient = useQueryClient();
  const [hasNewLogEntries, resetNewLogEntries] = useMessaging('NewLogEntries', incidentId);
  const postToast = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasNewLogEntries) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const handler = async () => {
      await queryClient.invalidateQueries({
        queryKey: [`incident/${incidentId}/logEntries`]
      });
      await queryClient.invalidateQueries({
        queryKey: [`incident/${incidentId}/attachments`]
      });
    };

    timerRef.current = setTimeout(async () => {
      await handler();

      postToast({
        type: 'Info',
        id: `NEW_LOG_ENTRIES:${incidentId}`,
        content: <span>New log entries have been added to this incident.</span>,
        isDismissable: true
      });
    }, 1000);
  }, [incidentId, queryClient, postToast, hasNewLogEntries, resetNewLogEntries]);
}
