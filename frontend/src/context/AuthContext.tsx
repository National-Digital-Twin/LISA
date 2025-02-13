// Global imports
import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react';

// Local imports
import { type User } from 'common/User';
import { FetchError, get } from '../api';
import { AuthContextType } from '../utils/types';

export const AuthContext = createContext({});

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [offline, setOffline] = useState<boolean>(true);
  const { data, error } = useQuery<User, FetchError>({
    queryKey: ['user'],
    queryFn: () => get('/auth/user'),
    retry: false
  });

  const login = () => {
    document.location = `/api/auth/login?redirect=${window.location.pathname}`;
  };

  const logout = () => {
    document.location = '/api/auth/logout';
  };

  useEffect(() => {
    const isOffline = error?.message === 'Failed to fetch';
    setOffline(isOffline);

    const isUnauthenticated = error?.status === 403;
    setAuthenticated(!isUnauthenticated);
    if (isUnauthenticated) {
      login();
    }
    return () => undefined;
  }, [error?.message, error?.status]);

  const value: AuthContextType = useMemo(() => ({
    user: {
      current: data,
      authenticated,
      offline,
      login,
      logout
    }
  }), [data, authenticated, offline]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
