// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { v4 as uuidV4 } from 'uuid';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Local imports
import { type Incident } from 'common/Incident';
import { FetchError, get, post } from '../api';
import { createSequenceNumber } from '../utils/Form/sequence';

export const useIncidents = () =>
  useQuery<Incident[], FetchError>({
    queryKey: ['incidents'],
    queryFn: () => get('/incidents')
  });

async function poll(
  incidentId: string | undefined,
  queryClient: QueryClient,
  attemptNumber: number
) {
  const incidents = await get<Incident[]>('/incidents');

  if (attemptNumber <= 10) {
    if (incidents.find((incident) => incident.id === incidentId)) {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    } else {
      setTimeout(() => poll(incidentId, queryClient, attemptNumber + 1), 10000);
    }
  }
}

export const useCreateIncident = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    Incident,
    Error,
    Omit<Incident, 'id' | 'reportedBy'>,
    {
      previousIncidents?: Incident[];
      newIncidentId: string;
    }
  >({
    mutationFn: async (incident) => {
      const newIncidentId = uuidV4();

      const createdIncident = await post<Incident>('/incident', {
        ...incident,
        id: newIncidentId,
      });

      return createdIncident;
    },

    onSuccess: async (data) => {
      setTimeout(() => poll(data.id, queryClient, 1), 1000);
    },

    onError: async (_error, _variables, context) => {
      // rollback to previously captured incidents from the context.
      if (context?.previousIncidents) {
        queryClient.setQueryData<Incident[]>(['incidents'], context.previousIncidents);
      }
    },
    // optimistic update
    onMutate: async (newIncident) => {
      await queryClient.cancelQueries({ queryKey: ['incidents'] });

      const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);
      const newIncidentId = uuidV4();

      const newIncidentOffline: Incident = {
        ...newIncident,
        id: newIncidentId,
        offline: true,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Incident[]>(['incidents'], (oldData) =>
        oldData ? oldData.concat(newIncidentOffline) : [newIncidentOffline]
      );

      return { previousIncidents, newIncidentId };
    }
  });

  return { createIncident: mutate, isLoading: isPending };
};

export const useChangeIncidentStage = () => {
  const queryClient = useQueryClient();

  const createIncident = useMutation<Incident, Error, Incident>({
    mutationFn: (incident) =>
      post(`/incident/${incident.id}/stage`, {
        id: incident.id,
        stage: incident.stage,
        sequence: createSequenceNumber()
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },

    onMutate: async (updatedIncident) => {
      await queryClient.cancelQueries({ queryKey: ['incidents'] });

      const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);
      if (previousIncidents) {
        queryClient.setQueryData<Incident[]>(
          ['incidents'],
          [...previousIncidents.filter((p) => p.id !== updatedIncident.id), updatedIncident].sort(
            (a, b) => b.startedAt.localeCompare(a.startedAt)
          )
        );
      }

      return { previousIncidents };
    }
  });

  return createIncident;
};
