// Global imports
import { v4 as uuidV4 } from 'uuid';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Local imports
import { type Incident } from 'common/Incident';
import { FetchError, get, post } from '../api';

export const useIncidents = () => {
  const queryClient = useQueryClient();
  const invalidateIncidents = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['incidents']
    });
  }, [queryClient]);
  const { data, isLoading, isError, error } = useQuery<Incident[], FetchError>({
    queryKey: ['incidents'],
    queryFn: () => get('/incidents')
  });

  return { incidents: data, isLoading, isError, error, invalidateIncidents };
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  const createIncident = useMutation<Incident, Error, Omit<Incident, 'id' | 'reportedBy'>>({
    mutationFn: (incident) => post('/incident', incident),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['incidents'] }),
    // optimistic update
    onMutate: async (newIncident) => {
      await queryClient.cancelQueries({ queryKey: ['incidents'] });
      const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);
      if (previousIncidents) {
        queryClient.setQueryData<Incident[]>(
          ['incidents'],
          [
            ...previousIncidents,
            {
              ...newIncident,
              id: uuidV4(),
              offline: true
            }
          ]
        );
      }
      return { previousIncidents };
    }
  });

  return createIncident;
};

export const useChangeIncidentStage = () => {
  const queryClient = useQueryClient();
  const createIncident = useMutation<Incident, Error, Incident>({
    mutationFn: (incident) => post(`/incident/${incident.id}/stage`, incident),
    onSuccess: async () =>
      queryClient.invalidateQueries({
        queryKey: ['incidents']
      }),
    // optimistic update
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
