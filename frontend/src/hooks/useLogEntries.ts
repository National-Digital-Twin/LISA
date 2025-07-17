// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from 'common/LogEntry';
import { FetchError, get, post } from '../api';
import { addOptimisticLogEntry, resetPolling } from './useLogEntriesUpdates';

export const useLogEntries = (incidentId?: string) => {
  const {
    data: logEntries,
    isLoading,
    isError,
    error
  } = useQuery<LogEntry[], FetchError>({
    queryKey: [`incident/${incidentId}/logEntries`],
    queryFn: () => get(`/incident/${incidentId}/logEntries`)
  });

  return { logEntries, isLoading, isError, error };
};

type CreateLogEntryParams = {
  logEntry: Omit<LogEntry, 'id' | 'author'>;
  attachments?: File[];
};

export const useCreateLogEntry = (incidentId?: string) => {
  const queryClient = useQueryClient();

  const { mutate: createLogEntry, isPending: isCreating } = useMutation<
    LogEntry,
    Error,
    CreateLogEntryParams,
    { previousEntries?: LogEntry[] }
  >({
    mutationFn: async ({ logEntry, attachments }) => {
      if (attachments?.length) {
        const formData = new FormData();
        attachments.forEach((file) => formData.append(file.name, file));
        formData.append('logEntry', JSON.stringify(logEntry));
        return post(`/incident/${incidentId}/logEntry`, formData);
      }
      return post(`/incident/${incidentId}/logEntry`, logEntry);
    },
    onMutate: async ({ logEntry }) => {
      resetPolling();
      await queryClient.cancelQueries({ queryKey: [`incident/${incidentId}/logEntries`] });

      const { previousEntries } = addOptimisticLogEntry(incidentId!, logEntry);
      return { previousEntries };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<LogEntry[]>(
        [`incident/${incidentId}/logEntries`],
        context!.previousEntries
      );
    }
  });

  return { createLogEntry, isLoading: isCreating };
};
