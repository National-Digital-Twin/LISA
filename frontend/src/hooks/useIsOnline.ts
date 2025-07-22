import { useEffect, useState } from 'react';
import { onlineManager } from '@tanstack/react-query';

export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe(setIsOnline);
    return () => unsubscribe();
  }, []);

  return isOnline;
}