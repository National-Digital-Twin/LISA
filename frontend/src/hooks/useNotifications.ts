// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Notification } from 'common/Notification';
import { useCallback } from 'react';

import { FetchError, get, put } from '../api';

export function useNotifications() {
  const queryClient = useQueryClient();
  const invalidate = useCallback(
    async () =>
      queryClient.invalidateQueries({
        queryKey: ['notifications']
      }),
    [queryClient]
  );
  const { data, isLoading, isError, error } = useQuery<Notification[], FetchError>({
    queryKey: ['notifications'],
    queryFn: () => get('/notifications')
  });

  return { notifications: data, isLoading, isError, error, invalidate };
}

export function useReadNotification() {
  const queryClient = useQueryClient();
  const readNotification = useMutation<void, Error, string>({
    mutationFn: (id: string) => put(`/notifications/${id}`, {}),
    onSettled: async () =>
      queryClient.invalidateQueries({
        queryKey: ['notifications']
      })
  });
  return readNotification;
}
