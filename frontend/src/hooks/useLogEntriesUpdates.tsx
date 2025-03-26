import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import useMessaging from './useMessaging';
import { useToast } from './useToasts';

export function useLogEntriesUpdates(incidentId: string) {
  const queryClient = useQueryClient();
  const hasNewLogEntries = useMessaging('NewLogEntries', incidentId);
  const postToast = useToast();

  useEffect(() => {
    if (!hasNewLogEntries) return;

    const handler = async () => {
      await queryClient.invalidateQueries({
        queryKey: [`incident/${incidentId}/logEntries`]
      });
      await queryClient.invalidateQueries({
        queryKey: [`incident/${incidentId}/attachments`]
      });
    };

    postToast({
      type: 'Info',
      id: `NEW_LOG_ENTRIES:${incidentId}`,
      content: (
        <span>
          New log entries have been added to this incident.{' '}
          <button type="button" onClick={handler}>
            Click here
          </button>{' '}
          to load them.
        </span>
      ),
      isDismissable: true
    });
  }, [incidentId, queryClient, postToast, hasNewLogEntries]);
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
