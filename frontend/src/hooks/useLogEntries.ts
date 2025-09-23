// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Incident } from 'common/Incident';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchError, get, post } from '../api';
import { addOptimisticLogEntry } from './useLogEntriesUpdates';
import { applyFieldUpdatesToIncident } from '../utils/Incident/optimisticUpdates';
import { mergeOfflineEntities } from '../utils';
import { useIsOnline } from './useIsOnline';
import { addLog } from '../offline/db/dbOperations';
import { v4 as uuidV4 } from 'uuid';
import { useAuth } from './useAuth';

export const getLogEntries = async (queryClient: QueryClient, incidentId: string) => {
  const serverEntries = await get<LogEntry[]>(`/incident/${incidentId}/logEntries`);
  const cachedEntries = queryClient.getQueryData<LogEntry[]>([`incident/${incidentId}/logEntries`]);
  return mergeOfflineEntities(cachedEntries, serverEntries);
};

export const useLogEntries = (incidentId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: logEntries,
    isLoading,
    isError,
    error
  } = useQuery<LogEntry[], FetchError>({
    queryKey: [`incident/${incidentId}/logEntries`],
    queryFn: () => getLogEntries(queryClient, incidentId ?? ''),
    staleTime: Infinity
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
  const isOnline = useIsOnline();
  const { user } = useAuth();

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
      if (!isOnline) {
        logEntry.id ??= uuidV4();
        const offlineEntry = { ...logEntry, incidentId };
        await addLog(offlineEntry);
        return offlineEntry;
      }

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
        {
          ...logEntry,
          author: {
            username: user.current?.username ?? 'Offline',
            displayName: user.current?.displayName ?? 'Offline'
          }
        }
      );

      // If this is a SetIncidentInformation log entry, also update the incident cache
      let previousIncidents: Incident[] | undefined;
      if (logEntry.type === 'SetIncidentInformation') {
        await queryClient.cancelQueries({ queryKey: ['incidents'] });
        previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);

        if (previousIncidents) {
          const updatedIncidents = previousIncidents.map((incident) => {
            if (incident.id === incidentId) {
              const updatedIncident = applyFieldUpdatesToIncident(incident, logEntry.fields);
              updatedIncident.offline = true;
              return updatedIncident;
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
    },
    networkMode: 'always'
  });

  return { createLogEntry, isLoading: isCreating };
};
