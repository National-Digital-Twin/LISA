// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from 'common/User';
import { FetchError, get } from '../api';
import { AuthContextType } from '../utils/types';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../utils/auth';

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [offline, setOffline] = useState<boolean>(true);
  const { data, error } = useQuery<User, FetchError>({
    queryKey: ['user'],
    queryFn: () => get('/auth/user'),
    retry: false
  });

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
