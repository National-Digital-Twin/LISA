import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from 'common/User';
import { FetchError, get } from '../api';
import { AuthContextType } from '../utils/types';
import { AuthContext } from '../context/AuthContext';

async function clearServiceWorkerCaches() {
  // Clear service worker cache
  if ('caches' in window) {
    await caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    });
  }
}

function clearLocalAndSessionStorage() {
  // Handle client-side storage
  localStorage.clear();
  sessionStorage.clear();
}

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [offline, setOffline] = useState<boolean>(true);
  const { data, error } = useQuery<User, FetchError>({
    queryKey: ['user'],
    queryFn: () => get('/auth/user'),
    retry: false
  });

  const logout = async () => {
    await fetch('/api/auth/logout-links').then(
      async (response) => {
        if (response.ok) {
          const logoutLinks = await response.json();
          await clearServiceWorkerCaches();
          clearLocalAndSessionStorage();
          await fetch(logoutLinks.oAuthLogoutUrl, { method: 'GET', redirect: 'manual' });
          document.location = logoutLinks.redirect;
        } else {
          document.location = '/';
        }
      },
      () => {
        document.location = '/';
      }
    );
  };

  useEffect(() => {
    const isOffline = error?.message === 'Failed to fetch';
    setOffline(isOffline);

    return () => undefined;
  }, [error?.message, error?.status]);

  const value: AuthContextType = useMemo(
    () => ({
      user: {
        current: data,
        offline,
        logout
      }
    }),
    [data, offline]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContextProvider;
