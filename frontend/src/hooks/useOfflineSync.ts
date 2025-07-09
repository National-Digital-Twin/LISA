import { useEffect } from 'react';
import { syncAllOfflineEntities } from '../offline/db/dbSync';
import { isOnline } from './utils/network';
import { clearExpiredEntities } from '../offline/db/indexedDb';

export function useOfflineSync() {
  useEffect(() => {
    async function handleOnline() {
      console.log('Back online. Starting offline data sync...');
      await clearExpiredEntities();
      await syncAllOfflineEntities();
    }

    window.addEventListener('online', handleOnline);

    if (isOnline()) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
}
