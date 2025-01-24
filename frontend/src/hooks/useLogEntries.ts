// Global imports
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from 'common/LogEntry';
import { FetchError, get, post } from '../api';

export const useLogEntries = (incidentId?: string) => {
  const { data, isLoading, isError, error } = useQuery<LogEntry[], FetchError>({
    queryKey: [`incident/${incidentId}/logEntries`],
    queryFn: () => get(`/incident/${incidentId}/logEntries`),
  });

  return { logEntries: data, isLoading, isError, error };
};

const useLogEntryUpdateSequence = (incidentId? : string) => {
  const queryClient = useQueryClient();
  const logEntryUpdateSequence = useMutation<unknown, Error, { logEntry: LogEntry }>({
    mutationFn: ({ logEntry }) => post(`/incident/${incidentId}/logEntry/${logEntry.id}/updateSequence`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`incident/${incidentId}/logEntries`]
      });
    }
  });

  return logEntryUpdateSequence;
};

export const useCreateLogEntry = (incidentId?: string) => {
  const queryClient = useQueryClient();
  const logEntryUpdateSequence = useLogEntryUpdateSequence(incidentId);
  const createLogEntry = useMutation<
    LogEntry,
    Error,
    {
      newLogEntry: Omit<LogEntry, 'id' | 'author'>;
      selectedFiles?: File[]
    }
  >({
    mutationFn: ({ newLogEntry, selectedFiles }) => {
      let data: undefined | FormData;
      if (selectedFiles?.length) {
        data = new FormData();
        selectedFiles.forEach((file) => data?.append(file.name, file));
        data.append('logEntry', JSON.stringify(newLogEntry));
      }
      return post(`/incident/${incidentId}/logEntry`, data ?? newLogEntry);
    },
    onSuccess: (logEntry) => {
      logEntryUpdateSequence.mutate({ logEntry });
    },
    // optimistic update
    onMutate: async ({ newLogEntry }) => {
      await queryClient.cancelQueries({ queryKey: [`incident/${incidentId}/logEntries`] });
      const previousEntries = queryClient.getQueryData<LogEntry[]>([`incident/${incidentId}/logEntries`]);
      const countOffline = previousEntries?.filter((pe) => pe.offline).length ?? 0;
      if (previousEntries) {
        queryClient.setQueryData<LogEntry[]>(
          [`incident/${incidentId}/logEntries`],
          [
            ...previousEntries,
            {
              ...newLogEntry,
              id: Math.random().toString(), // We should probably have UUIDs here,
              sequence: `-${countOffline + 1}`, // TODO: Figure out what to use for referencing here,
              offline: true
            }
          ]
        );
      }
      return { previousEntries };
    },
  });

  return createLogEntry;
};
