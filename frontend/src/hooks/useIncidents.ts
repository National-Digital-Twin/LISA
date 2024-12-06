// Global imports
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Local imports
import { type Incident } from 'common/Incident';
import { FetchError, get, post } from '../api';

export const useIncidents = () => {
  const queryClient = useQueryClient();
  const invalidateIncidents = useCallback(() => {
    queryClient.invalidateQueries({
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
  const createIncident = useMutation<
    Incident,
    Error,
    Omit<Incident, 'id' | 'reportedBy'>
  >({
    mutationFn: (incident) => post('/incident', incident),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['incidents']
      });
    },
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
              id: Math.random().toString(), // We should probably have UUIDs here
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
  const createIncident = useMutation<
    Incident,
    Error,
    Incident
  >({
    mutationFn: (incident) => post(`/incident/${incident.id}/stage`, incident),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['incidents']
      });
    },
    // optimistic update
    onMutate: async (updatedIncident) => {
      await queryClient.cancelQueries({ queryKey: ['incidents'] });
      const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);
      if (previousIncidents) {
        queryClient.setQueryData<Incident[]>(
          ['incidents'],
          [
            ...previousIncidents.filter((p) => p.id !== updatedIncident.id),
            updatedIncident
          ].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
        );
      }
      return { previousIncidents };
    }
  });

  return createIncident;
};
