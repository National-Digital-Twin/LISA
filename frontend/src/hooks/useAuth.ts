// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { useContext } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Local imports
import { type User } from 'common/User';
import { AuthContext } from '../context/AuthContext';
import { AuthContextType } from '../utils/types';
import { FetchError, get } from '../api';

export function useAuth(): AuthContextType {
  return useContext(AuthContext) as AuthContextType;
}

export function useUsers(
  options?: Omit<
    UseQueryOptions<User[], FetchError>,
    'queryKey' | 'queryFn'
  >
) {
  const { data, isLoading, isError, error } = useQuery<User[], FetchError>({
    queryKey: ['users'],
    queryFn: () => get<User[]>('/auth/users'),
    ...options,
  });

  return { users: data, isLoading, isError, error };
}
