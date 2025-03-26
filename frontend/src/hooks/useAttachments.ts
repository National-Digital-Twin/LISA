// Global imports
import { useQuery } from '@tanstack/react-query';

import { type IncidentAttachment } from 'common/IncidentAttachment';
import { FetchError, get } from '../api';

export const useAttachments = (incidentId?: string) => {
  const { data, isLoading, isError, error } = useQuery<IncidentAttachment[], FetchError>({
    queryKey: [`incident/${incidentId}/attachments`],
    queryFn: () => get(`/incident/${incidentId}/attachments`)
  });

  return { attachments: data, isLoading, isError, error };
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
