// Global imports
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react';

// Local imports
import { post } from './api';
import AppWrapper from './components/AppWrapper';
import Toasts from './components/Toasts';

// Styles
import './App.scss';
import MessagingProvider from './providers/MessagingProvider';
import ToastProvider from './providers/ToastProvider';
import AuthContextProvider from './providers/AuthContextProvider';

const persister = createSyncStoragePersister({
  storage: window.localStorage
});

const queryClient = new QueryClient();

queryClient.setMutationDefaults(['createIncident'], {
  mutationFn: async (incident: object | FormData) => {
    await queryClient.cancelQueries({ queryKey: ['incidents'] });
    return post('/incident', incident);
  }
});

const App = () => {
  useRegisterSW({
    immediate: true
  });

  useEffect(
    () => onlineManager.subscribe((isOnline) => {
      if (isOnline) {
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }
    }),
    []
  );
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <AuthContextProvider>
        <MessagingProvider>
          <ToastProvider>
            <Toasts />
            <AppWrapper />
          </ToastProvider>
        </MessagingProvider>
      </AuthContextProvider>
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  );
};

export default App;
