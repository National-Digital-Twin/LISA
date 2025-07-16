// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidV4 } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from 'common/LogEntry';
import { FetchError, get, post } from '../api';
import { resetPolling } from './useLogEntriesUpdates';

export const useLogEntries = (incidentId?: string) => {
  const { data, isLoading, isError, error } = useQuery<LogEntry[], FetchError>({
    queryKey: [`incident/${incidentId}/logEntries`],
    queryFn: () => get(`/incident/${incidentId}/logEntries`)
  });

  return { logEntries: data, isLoading, isError, error };
};

export const useCreateLogEntry = (incidentId?: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    LogEntry,
    Error,
    {
      newLogEntry: Omit<LogEntry, 'id' | 'author'>;
      selectedFiles?: File[];
    },
    {
      previousEntries?: LogEntry[];
    }
  >({
    mutationFn: async ({ newLogEntry, selectedFiles }) => {
      let data: FormData | Omit<LogEntry, 'id' | 'author'> = newLogEntry;
      if (selectedFiles?.length) {
        data = new FormData();
        selectedFiles.forEach((file) => (data as FormData).append(file.name, file));
        data.append('logEntry', JSON.stringify(newLogEntry));
      }
      return post(`/incident/${incidentId}/logEntry`, data);
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData<LogEntry[]>(
        [`incident/${incidentId}/logEntries`],
        context!.previousEntries
      );
    },
    onMutate: async ({ newLogEntry }) => {
      resetPolling();
      await queryClient.cancelQueries({ queryKey: [`incident/${incidentId}/logEntries`] });
      const previousEntries = queryClient.getQueryData<LogEntry[]>([
        `incident/${incidentId}/logEntries`
      ]);
      const countOffline = previousEntries?.filter((pe) => pe.offline).length ?? 0;
      const newLogEntryOffline = {
        ...newLogEntry,
        id: uuidV4(),
        sequence: `${countOffline + 1}`,
        offline: true
      };
      queryClient.setQueryData<LogEntry[]>([`incident/${incidentId}/logEntries`], (oldData) =>
        oldData!.concat(newLogEntryOffline)
      );
      return { previousEntries };
    }
  });
  return { createLogEntry: mutate, isLoading: isPending };
};
