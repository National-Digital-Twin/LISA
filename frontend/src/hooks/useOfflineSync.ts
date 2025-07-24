import { useEffect } from 'react';
import { syncAllOfflineEntities } from '../offline/db/dbSync';
import { clearExpiredEntities } from '../offline/db/indexedDb';
import { useIsOnline } from "./useIsOnline";

export function useOfflineSync() {
  const isOnline = useIsOnline();

  useEffect(() => {
    if (!isOnline) return;

    const sync = async () => {
      console.log('Back online. Starting offline data sync...');
      await clearExpiredEntities();
      await syncAllOfflineEntities();
    };

    sync();
  }, [isOnline]);
}