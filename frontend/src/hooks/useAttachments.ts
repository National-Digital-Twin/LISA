// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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
