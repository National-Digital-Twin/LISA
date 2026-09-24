// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { useUsers } from './useAuth';
import { useFormTemplates } from './Forms/useFormTemplates';

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
}
