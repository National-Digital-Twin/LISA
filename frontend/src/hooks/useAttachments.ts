// Global imports
import { useQuery } from '@tanstack/react-query';

import { type IncidentAttachment } from 'common/IncidentAttachment';
import { FetchError, get } from '../api';

export const useAttachments = (incidentId?: string) => {
  const { data, isLoading, isError, error } = useQuery<IncidentAttachment[], FetchError>({
    queryKey: [`incident/${incidentId}/attachments`],
    queryFn: () => get(`/incident/${incidentId}/attachments`),
  });

  return { attachments: data, isLoading, isError, error };
};
