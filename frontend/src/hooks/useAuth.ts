// Global imports
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

// Local imports
import { type User } from 'common/User';
import { AuthContext } from '../context/AuthContext';
import { AuthContextType } from '../utils/types';
import { FetchError, get } from '../api';

export function useAuth(): AuthContextType {
  return useContext(AuthContext) as AuthContextType;
}

export function useUsers() {
  const { data, isLoading, isError, error } = useQuery<User[], FetchError>({
    queryKey: ['users'],
    queryFn: () => get<User[]>('/auth/users')
  });

  return { users: data, isLoading, isError, error };
}
