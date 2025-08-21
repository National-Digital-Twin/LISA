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

const TOTAL_RETRY_ATTEMPTS = 3;

export const useIncidents = () =>
  useQuery<Incident[], FetchError>({
    queryKey: ['incidents'],
    queryFn: () => get('/incidents'),
    staleTime: 10_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

async function poll(
  incidentId: string | undefined,
  attemptNumber: number,
  retryAttemptNumber: number,
  queryClient: QueryClient
) {
  try {
    const incidents = await get<Incident[]>('/incidents');

    if (attemptNumber <= 10) {
      if (incidents.find((incident) => incident.id === incidentId)) {
        queryClient.invalidateQueries({ queryKey: ['incidents'] });
      } else {
        setTimeout(
          () => poll(incidentId, attemptNumber + 1, retryAttemptNumber, queryClient),
          10000
        );
      }
    } else {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    }
  } catch (error) {
    const retryAttemptsLeft = TOTAL_RETRY_ATTEMPTS - retryAttemptNumber;

    if (retryAttemptsLeft > 0) {
      console.error(
        `Error occured while polling for updates: ${error}. Retry attempts left: ${retryAttemptsLeft}`
      );
      setTimeout(
        () => poll(incidentId, attemptNumber + 1, retryAttemptNumber + 1, queryClient),
        5000
      );
    }
  }
}

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    Incident,
    Error,
    Omit<Incident, 'reportedBy'>,
    {
      previousIncidents?: Incident[];
      updatedIncidents?: Incident[];
    }
  >({
    mutationFn: (incident) => post('/incident', incident),
    onSuccess: async (data) => {
      setTimeout(() => poll(data.id, 1, 1, queryClient), 1000);
    },
    onError: async (error, _variables, context) => {
      // assumption: when the user is offline there will be no cause so we can use this to differentiate between
      // a genuine error and one that happens due to the user being offline.
      if (error.cause && context?.previousIncidents) {
        queryClient.setQueryData<Incident[]>(['incidents'], context.previousIncidents);
      }

      if (context?.updatedIncidents) {
        queryClient.setQueryData<Incident[]>(['incidents'], context.updatedIncidents);
      }
    },
    // optimistic update
    onMutate: async (newIncident) => {
      await queryClient.cancelQueries({ queryKey: ['incidents'] });
      const previousIncidents = queryClient.getQueryData<Incident[]>(['incidents']);
      const newIncidentOffline = {
        ...newIncident,
        id: uuidV4(),
        offline: true
      };
      queryClient.setQueryData<Incident[]>(
        ['incidents'],
        (oldData) => oldData?.concat(newIncidentOffline) || [newIncidentOffline]
      );
      const updatedIncidents = previousIncidents?.concat(newIncidentOffline) || [
        newIncidentOffline
      ];
      return { previousIncidents, updatedIncidents };
    }
  });

  return { createIncident: mutate, isLoading: isPending };
};

export async function pollForIncidentUpdate(
  incidentId: string | undefined,
  attemptNumber: number,
  retryAttemptNumber: number,
  queryClient: QueryClient
): Promise<void> {
  if (!incidentId) {
    throw new Error('Incident id undefined unable to poll for updates!');
  }

  if (attemptNumber <= 0) {
    throw new Error('Attempt number is less than or equal to 0 unable to poll for updates!');
  }

  if (retryAttemptNumber <= 0) {
    throw new Error('Retry attempt number is less than or equal to 0 unable to poll for updates!');
  }

  if (attemptNumber <= 10) {
    const cachedIncidents: Incident[] | undefined = queryClient.getQueryData<Incident[]>([
      'incidents'
    ]);
    const cachedIncident: Incident | undefined = cachedIncidents?.find(
      (incident) => incident?.id === incidentId
    );

    try {
      const incident: Incident | undefined = await get<Incident>(`/incident/${incidentId}`);

      if (cachedIncident && incident) {
        if (cachedIncident.stage === incident.stage) {
          queryClient.invalidateQueries({ queryKey: ['incidents'] });
        } else {
          setTimeout(
            () =>
              pollForIncidentUpdate(incidentId, attemptNumber + 1, retryAttemptNumber, queryClient),
            10000
          );
        }
      }
    } catch (error) {
      const retryAttemptsLeft = TOTAL_RETRY_ATTEMPTS - retryAttemptNumber;
      console.error(
        `Error occured while polling for updates: ${error}. Retry attempts left: ${retryAttemptsLeft}`
      );
      if (retryAttemptsLeft > 0) {
        setTimeout(
          () =>
            pollForIncidentUpdate(
              incidentId,
              attemptNumber + 1,
              retryAttemptNumber + 1,
              queryClient
            ),
          5000
        );
      }
    }
  } else {
    queryClient.invalidateQueries({ queryKey: ['incidents'] });
  }
}

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
      onSuccess: async (incident) => {
        setTimeout(() => pollForIncidentUpdate(incident.id, 1, 1, queryClient), 1000);
      },
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
          ?.concat(incident)
          ?.sort((a, b) => b.startedAt.localeCompare(a.startedAt)) || [incident];
        queryClient.setQueryData<Incident[]>(['incidents'], updatedIncidents);
        return { previousIncidents };
      }
    }
  );

  return createIncident;
};
