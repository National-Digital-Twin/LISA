// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { useEffect } from 'react';
import { syncAllOfflineEntities } from '../offline/db/dbSync';
import { clearExpiredEntities } from '../offline/db/indexedDb';
import { useIsOnline } from "./useIsOnline";
import { logInfo } from '../utils/logger';

export function useOfflineSync() {
  const isOnline = useIsOnline();

  useEffect(() => {
    if (!isOnline) return;

    const sync = async () => {
      logInfo('Back online. Starting offline data sync...');
      await clearExpiredEntities();
      await syncAllOfflineEntities();
    };

    sync();
  }, [isOnline]);
}