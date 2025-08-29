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
import { useOfflineSync } from './hooks/useOfflineSync';

// Styles
import './App.scss';
import MessagingProvider from './providers/MessagingProvider';
import NotificationProvider from './providers/NotificationProvider';
import ToastProvider from './providers/ToastProvider';
import AuthContextProvider from './providers/AuthContextProvider'
import { useOfflineBootstrap } from './hooks/useOfflineBootstrap';

const App = () => {

  useOfflineSync();
  useOfflineBootstrap();

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

  return (
    <AuthContextProvider>
      <MessagingProvider>
        <NotificationProvider>
          <ToastProvider>
            <Toasts />
            <AppWrapper />
          </ToastProvider>
        </NotificationProvider>
      </MessagingProvider>
    </AuthContextProvider>
  );
};

export default App;
