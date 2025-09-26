// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { onlineManager } from '@tanstack/react-query';
import { OnlineContext } from '../context/OnlineContext';
import { redirectToLanding } from '../utils/authRedirect';

const PING_INTERVAL_MS = 2500; // polls every 2.5s
const PING_URL = '/api/ping';

interface OnlineProviderProps {
  children: ReactNode;
}

const OnlineProvider = ({ children }: Readonly<OnlineProviderProps>) => {
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
          cache: 'no-store'
        });

        if (response.status === 401 || response.status === 403) {
          redirectToLanding();
          return;
        }

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

  const contextValue = useMemo(() => ({ isOnline }), [isOnline]);

  return <OnlineContext.Provider value={contextValue}>{children}</OnlineContext.Provider>;
};

export default OnlineProvider;
