// Global imports
import { v4 as uuidV4 } from 'uuid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useCreateLogEntry = (incidentId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    LogEntry,
    Error,
    {
      newLogEntry: Omit<LogEntry, 'id' | 'author'>;
      selectedFiles?: File[];
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`incident/${incidentId}/logEntries`] });
    },
    // optimistic update
    onMutate: async ({ newLogEntry }) => {
      await queryClient.cancelQueries({ queryKey: [`incident/${incidentId}/logEntries`] });
      const previousEntries = queryClient.getQueryData<LogEntry[]>([
        `incident/${incidentId}/logEntries`
      ]);
      const countOffline = previousEntries?.filter((pe) => pe.offline).length ?? 0;
      if (previousEntries) {
        queryClient.setQueryData<LogEntry[]>(
          [`incident/${incidentId}/logEntries`],
          [
            ...previousEntries,
            {
              ...newLogEntry,
              id: uuidV4(),
              displaySequence: `${countOffline + 1}`,
              offline: true
            }
          ]
        );
      }
      return { previousEntries };
    }
  });
};
