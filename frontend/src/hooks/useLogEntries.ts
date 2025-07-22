// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchError, get, post } from '../api';
import { addOptimisticLogEntry, resetPolling, optimisticEntriesRef } from './useLogEntriesUpdates';

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
    { previousEntries?: LogEntry[]; updatedEntries?: LogEntry[]; optimisticEntryId?: string }
  >({
    mutationFn: async ({ logEntry, attachments }) => {
      if (attachments?.length) {
        const formData = new FormData();
        attachments.forEach((file: File) => formData.append(file.name, file));
        formData.append('logEntry', JSON.stringify(logEntry));
        return post(`/incident/${incidentId}/logEntry`, formData);
      }
      return post(`/incident/${incidentId}/logEntry`, logEntry);
    },
    onMutate: async ({ logEntry }) => {
      resetPolling();
      await queryClient.cancelQueries({ queryKey: [`incident/${incidentId}/logEntries`] });

      const { optimisticEntry, previousEntries } = addOptimisticLogEntry(incidentId!, logEntry);

      return { previousEntries, optimisticEntryId: optimisticEntry.id };
    },
    onSuccess: (data, _variables, context) => {
      if (context?.optimisticEntryId && data.id) {
        const optimisticEntry = optimisticEntriesRef.current.get(context.optimisticEntryId);
        if (optimisticEntry) {
          optimisticEntry.serverId = data.id;
        }
      }
    },
    onError(error, _variables, context) {
      if (error.cause && context?.previousEntries) {
        queryClient.setQueryData<LogEntry[]>(
          [`incident/${incidentId}/logEntries`],
          context.previousEntries
        );
      }

      if (context?.updatedEntries) {
        queryClient.setQueryData<LogEntry[]>(
          [`incident/${incidentId}/logEntries`],
          context.updatedEntries
        );
      }
    }
  });

  return { createLogEntry, isLoading: isCreating };
};
