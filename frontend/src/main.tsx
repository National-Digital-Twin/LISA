// Global imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
// Local imports
import App from './App';
import { FetchError, post } from './api';

// Styles
import './App.scss';
import theme from './theme';

const persister = createSyncStoragePersister({
  storage: window.localStorage
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: FetchError) => {
      if (error.status === 302) {
        document.location = error.redirectUrl!;
      }
    }
  }),
  mutationCache: new MutationCache({
    onError: (error: FetchError) => {
      if (error.status === 302) {
        document.location = error.redirectUrl!;
      }
    }
  })
});

queryClient.setMutationDefaults(['createIncident'], {
  mutationFn: async (incident: object | FormData) => {
    await queryClient.cancelQueries({ queryKey: ['incidents'] });
    return post('/incident', incident);
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
    <ReactQueryDevtools />
  </PersistQueryClientProvider>
);
