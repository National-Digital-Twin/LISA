import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from 'common/User';
import { FetchError, get } from '../api';
import { AuthContextType } from '../utils/types';
import { AuthContext } from '../context/AuthContext';

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [offline, setOffline] = useState<boolean>(true);
  const { data, error } = useQuery<User, FetchError>({
    queryKey: ['user'],
    queryFn: () => get('/auth/user'),
    retry: false
  });

  const logout = async () => {
    await fetch('/api/auth/logout').then(async (response) => {
      const signOutUrl = await response.json();

      document.location = signOutUrl;
    });
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
