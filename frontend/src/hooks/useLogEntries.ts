// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Incident } from 'common/Incident';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchError, get, post } from '../api';
import { addOptimisticLogEntry } from './useLogEntriesUpdates';
import { applyFieldUpdatesToIncident } from '../utils/Incident/optimisticUpdates';
import { mergeOfflineEntities } from '../utils';

export const useLogEntries = (incidentId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: logEntries,
    isLoading,
    isError,
    error
  } = useQuery<LogEntry[], FetchError>({
    queryKey: [`incident/${incidentId}/logEntries`],
    queryFn: async () => {
      const serverEntries = await get<LogEntry[]>(`/incident/${incidentId}/logEntries`);
      const cachedEntries = queryClient.getQueryData<LogEntry[]>([`incident/${incidentId}/logEntries`]);

      return mergeOfflineEntities(cachedEntries, serverEntries);
    },
    staleTime: Infinity,
  });

  return { logEntries, isLoading, isError, error };
};

type CreateLogEntryParams = {
  logEntry: Omit<LogEntry, 'author'>;
  attachments?: File[];
};

export const useCreateLogEntry = (incidentId?: string, onSuccess?: () => void) => {
  if (!incidentId) {
    throw new Error('Incident id is undefined cannot create log entry!');
  }

  const queryClient = useQueryClient();

  const { mutate: createLogEntry, isPending: isCreating } = useMutation<
    LogEntry,
    Error,
    CreateLogEntryParams,
    {
      previousEntries?: LogEntry[];
      updatedEntries?: LogEntry[];
      previousIncidents?: Incident[];
    }
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
      await queryClient.cancelQueries({ queryKey: [`incident/${incidentId}/logEntries`] });

      const { previousEntries, updatedEntries } = await addOptimisticLogEntry(
        queryClient,
        incidentId,
        logEntry
      );

      // If this is a SetIncidentInformation log entry, also update the incident cache
      let previousIncidents: Incident[] | undefined;
      if (logEntry.type === 'SetIncidentInformation') {
        await queryClient.cancelQueries({ queryKey: ['incidents'] });
        previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);

        if (previousIncidents) {
          const updatedIncidents = previousIncidents.map(incident => {
            if (incident.id === incidentId) {
              return applyFieldUpdatesToIncident(incident, logEntry.fields);
            }
            return incident;
          });

          queryClient.setQueryData<Incident[]>(['incidents'], updatedIncidents);
        }
      }

      return { previousEntries, updatedEntries, previousIncidents };
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
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

      if (context?.previousIncidents) {
        queryClient.setQueryData<Incident[]>(['incidents'], context.previousIncidents);
      }
    }
  });

  return { createLogEntry, isLoading: isCreating };
};
