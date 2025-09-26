// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useUsers } from './useAuth';
import { useFormTemplates } from './Forms/useFormTemplates';
import { useIncidents } from './useIncidents';

// Pre-warm users and forms cache to support offline mode
export function useOfflineBootstrap() {
  useUsers({
    enabled: true,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useFormTemplates({
    enabled: true,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useIncidents();
}
