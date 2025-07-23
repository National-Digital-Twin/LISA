import { useEffect, useState } from 'react';
import { onlineManager } from '@tanstack/react-query';

const PING_INTERVAL_MS = 2500; // polls every 2.5s
const PING_URL = '/api/ping'; 

export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe(setIsOnline);

    const ping = async () => {
      if (!navigator.onLine) {
        onlineManager.setOnline(false);
        return;
      }

      try {
        const response = await fetch(PING_URL, {
          method: 'HEAD',
          cache: 'no-store',
        });
        onlineManager.setOnline(response.ok);
      } catch {
        onlineManager.setOnline(false);
      }
    };

    ping();
    const intervalId = setInterval(ping, PING_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  return isOnline;
}
