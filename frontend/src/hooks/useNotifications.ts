import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Notification } from 'common/Notification';
import { useCallback } from 'react';

import { FetchError, get, put } from '../api';

export function useNotifications() {
  const queryClient = useQueryClient();
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['notifications']
    });
  }, [queryClient]);
  const { data, isLoading, isError, error } = useQuery<Notification[], FetchError>({
    queryKey: ['notifications'],
    queryFn: () => get('/notifications'),
  });

  return { notifications: data, isLoading, isError, error, invalidate };
}

export function useReadNotification() {
  const queryClient = useQueryClient();
  const readNotification = useMutation<void, Error, string>({
    mutationFn: (id: string) => put(`/notifications/${id}`, {}),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications']
      });
    }
  });
  return readNotification;
}
