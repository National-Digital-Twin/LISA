// Global imports
import { v4 as uuidV4 } from 'uuid';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from 'common/LogEntry';
import { FetchError, get, post } from '../api';

export const useLogEntries = (incidentId?: string) => {
  const { data, isLoading, isError, error } = useQuery<LogEntry[], FetchError>({
    queryKey: [`incident/${incidentId}/logEntries`],
    queryFn: () => get(`/incident/${incidentId}/logEntries`)
  });

  return { logEntries: data, isLoading, isError, error };
};

export async function poll(
  incidentId: string | undefined,
  logEntryId: string | undefined,
  queryClient: QueryClient,
  attemptNumber: number
) {
  const logEntries = await get<LogEntry[]>(`/incident/${incidentId}/logEntries`);

  if (attemptNumber <= 10) {
    if (logEntries.find((logEntry) => logEntry.id === logEntryId)) {
      queryClient
        .invalidateQueries({ queryKey: [`incident/${incidentId}/logEntries`] })
        .then(() =>
          queryClient.invalidateQueries({ queryKey: [`incident/${incidentId}/attachments`] })
        );
    } else {
      setTimeout(() => poll(incidentId, logEntryId, queryClient, attemptNumber + 1), 10000);
    }
  }
}

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
    onSuccess: async (data) => {
      setTimeout(() => poll(incidentId, data.id, queryClient, 1), 1000);
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData<LogEntry[]>(
        [`incident/${incidentId}/logEntries`],
        context!.previousEntries
      );
    },
    // optimistic update
    onMutate: async ({ newLogEntry }) => {
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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
