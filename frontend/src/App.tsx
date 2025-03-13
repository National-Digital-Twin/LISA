// Global imports
import { useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react';
import { onlineManager, useQueryClient } from '@tanstack/react-query';

// Local imports
import AppWrapper from './components/AppWrapper';
import Toasts from './components/Toasts';

// Styles
import './App.scss';
import MessagingProvider from './providers/MessagingProvider';
import ToastProvider from './providers/ToastProvider';
import AuthContextProvider from './providers/AuthContextProvider';

const App = () => {
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
    []
  );

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
