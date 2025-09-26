// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Local imports
import { type Incident } from 'common/Incident';
import { FetchError, get, post } from '../api';
import { createSequenceNumber } from '../utils/Form/sequence';
import { useIsOnline } from './useIsOnline';
import { addIncident } from '../offline/db/dbOperations';
import { v4 as uuidV4 } from 'uuid';
import { useAuth } from './useAuth';
import { useCallback, useRef } from 'react';
import { applyFieldUpdatesToIncident } from '../utils/Incident/optimisticUpdates';
import { mergeOfflineEntities } from '../utils';
import { getCachedLogEntries } from './useLogEntries';
import { LogEntry } from 'common/LogEntry';

const POLLING_INTERVAL_SECONDS = 5;
const POLLING_INTERVAL_MS = POLLING_INTERVAL_SECONDS * 1000;

const getIncidents = async (queryClient: QueryClient, isOnline: boolean) => {
  const cachedIncidents = queryClient.getQueryData<Incident[]>(['incidents']);
  const serverIncidents = isOnline ? await get<Incident[]>('/incidents') : cachedIncidents ?? [];

  const mergedIncidents = mergeOfflineEntities(cachedIncidents, serverIncidents);

  // due to the way that special log entries are merged with an incident to
  // update its properties, if we have any offline log entries we may need to
  // reapply optimistic updates to the incident
  const updatedIncidents = mergedIncidents.map((incident) => {
    const logEntries = getCachedLogEntries(queryClient, incident.id);
    if (!logEntries) {
      return incident;
    }

    const pendingUpdates: LogEntry[] = [];
    let hasOfflineEntries = false;
    for (const logEntry of logEntries) {
      if (!logEntry.offline) continue;

      hasOfflineEntries = true;
      if (logEntry.type === 'SetIncidentInformation') {
        pendingUpdates.push(logEntry);
      }
    }
    if (!hasOfflineEntries) {
      return incident;
    }

    const updatedIncident = pendingUpdates
      .toSorted((a, b) => a.dateTime.localeCompare(b.dateTime))
      .reduce((acc, u) => applyFieldUpdatesToIncident(acc, u.fields), incident);

    return { ...updatedIncident, offline: true };
  });

  return updatedIncidents;
};

export const useIncidents = () => {
  const queryClient = useQueryClient();
  const isOnline = useIsOnline();

  return useQuery<Incident[], FetchError>({
    queryKey: ['incidents'],
    queryFn: async () => {
      return getIncidents(queryClient, isOnline);
    },
    staleTime: 10_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    networkMode: 'always'
  });
};

export const useIncidentsUpdates = () => {
  const queryClient = useQueryClient();
  const isOnline = useIsOnline();
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncIncidents = useCallback(async () => {
    try {
      const mergedIncidents = await getIncidents(queryClient, isOnline);
      queryClient.setQueryData<Incident[]>(['incidents'], mergedIncidents);
    } catch (error) {
      console.error(`Error occurred: ${error}. Unable to poll for incident updates!`);
    }
  }, [queryClient]);

  const startPolling = useCallback(() => {
    pollingIntervalRef.current = setInterval(syncIncidents, POLLING_INTERVAL_MS);
  }, [syncIncidents]);

  const clearPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  return { startPolling, clearPolling };
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  const isOnline = useIsOnline();
  const { user } = useAuth();
  const { mutate, isPending } = useMutation<
    Incident,
    Error,
    Omit<Incident, 'reportedBy'>,
    {
      previousIncidents?: Incident[];
      updatedIncidents?: Incident[];
    }
  >({
    mutationFn: async (incident) => {
      incident.id ??= uuidV4();
      if (isOnline) {
        await post('/incident', incident);
      } else {
        await addIncident({ ...incident, offline: true });
      }

      return incident;
    },
    onError: async (_error, _variables, context) => {
      if (context?.previousIncidents) {
        queryClient.setQueryData<Incident[]>(['incidents'], context.previousIncidents);
      }

      if (context?.updatedIncidents) {
        queryClient.setQueryData<Incident[]>(['incidents'], context.updatedIncidents);
      }
    },
    onMutate: async (newIncident) => {
      await queryClient.cancelQueries({ queryKey: ['incidents'] });

      const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);
      const optimisticIncident = {
        ...newIncident,
        reportedBy: {
          username: user.current?.username ?? 'Offline',
          displayName: user.current?.displayName ?? 'Offline'
        },
        createdAt: new Date().toISOString(),
        offline: true
      };
      queryClient.setQueryData<Incident[]>(
        ['incidents'],
        (oldData) => oldData?.concat(optimisticIncident) || [optimisticIncident]
      );
      const updatedIncidents = previousIncidents?.concat(optimisticIncident) || [
        optimisticIncident
      ];
      return { previousIncidents, updatedIncidents };
    },
    networkMode: 'always'
  });

  return { createIncident: mutate, isLoading: isPending };
};

export const useChangeIncidentStage = () => {
  const queryClient = useQueryClient();
  const createIncident = useMutation<Incident, Error, Incident, { previousIncidents?: Incident[] }>(
    {
      mutationFn: (incident) =>
        post(`/incident/${incident.id}/stage`, {
          id: incident.id,
          stage: incident.stage,
          sequence: createSequenceNumber()
        }),
      onError: (_error, _variables, context) => {
        if (context?.previousIncidents) {
          queryClient.setQueryData<Incident[]>(['incidents'], context.previousIncidents);
        }
      },
      // optimistic update
      onMutate: async (incident) => {
        await queryClient.cancelQueries({ queryKey: ['incidents'] });
        const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);
        const updatedIncidents = previousIncidents
          ?.filter((p) => p.id !== incident.id)
          ?.concat({ ...incident, offline: true })
          ?.sort((a, b) => b.startedAt.localeCompare(a.startedAt)) || [incident];
        queryClient.setQueryData<Incident[]>(['incidents'], updatedIncidents);
        return { previousIncidents };
      }
    }
  );

  return createIncident;
};
