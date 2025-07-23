// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react';
import { onlineManager, useQueryClient } from '@tanstack/react-query';

// Local imports
import AppWrapper from './components/AppWrapper';
import Toasts from './components/Toasts';
import { clearExpiredEntities } from './offline/db/indexedDb';
import { useOfflineSync } from './hooks/useOfflineSync';

// Styles
import './App.scss';
import MessagingProvider from './providers/MessagingProvider';
import ToastProvider from './providers/ToastProvider';
import AuthContextProvider from './providers/AuthContextProvider'
import { useUsers } from './hooks';

const App = () => {

  useOfflineSync();

  useRegisterSW({
    immediate: true
  });

  const queryClient = useQueryClient();

  useEffect(
    () =>
      onlineManager.subscribe((isOnline) => {
        if (isOnline) {
          queryClient.resumePausedMutations().then(async () => {
            await queryClient.invalidateQueries();
          });
        }
      }),
    [queryClient]
  );

  useEffect(() => {
    clearExpiredEntities();
  }, []);

  // Pre-warm users cache here
  useUsers({
    enabled: true,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <AuthContextProvider>
      <MessagingProvider>
        <ToastProvider>
          <Toasts />
          <AppWrapper />
        </ToastProvider>
      </MessagingProvider>
    </AuthContextProvider>
  );
};

export default App;
