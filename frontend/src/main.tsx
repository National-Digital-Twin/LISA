// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
import OnlineProvider from './providers/OnlineProvider';

// Styles
import './App.scss';
import theme from './theme';

interface LogoutLinks {
  oAuthLogoutUrl: string;
  redirect: string;
  landingPageUrl: string;
}

const persister = createSyncStoragePersister({
  storage: window.localStorage
});

let cachedLandingPageUrl: string | null = null;
const fetchLandingPageUrl = async (): Promise<void> => {
  try {
    const response = await fetch('/api/auth/logout-links');
    if (response.ok) {
      const logoutLinks: LogoutLinks = await response.json();
      cachedLandingPageUrl = logoutLinks.landingPageUrl;
    }
  } catch (error) {
    console.warn('Failed to fetch logout links config:', error);
  }
};

const onError = async (error: FetchError) => {
  if (error.status === 302) {
    document.location = error.redirectUrl!;
  } else if (error.status === 401 || error.status === 403) {
    if (cachedLandingPageUrl) {
      document.location = cachedLandingPageUrl;
    }
  }
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError }),
  mutationCache: new MutationCache({ onError })
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
        <OnlineProvider>
          <App />
        </OnlineProvider>
      </ThemeProvider>
    </React.StrictMode>
    <ReactQueryDevtools />
  </PersistQueryClientProvider>
);

fetchLandingPageUrl();
