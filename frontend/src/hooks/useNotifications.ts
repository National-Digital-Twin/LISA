// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export async function pollForTotalNotifications(
  totalCurrentNotifications: number,
  attemptNumber: number,
  invalidateNotifications: () => void,
  resetNewNotifications: () => void
) {
  const notifications = await get<Notification[]>('/notifications');

  if (attemptNumber <= 10) {
    if (notifications.length > totalCurrentNotifications) {
      invalidateNotifications();
      resetNewNotifications();
    } else {
      setTimeout(
        () =>
          pollForTotalNotifications(
            totalCurrentNotifications,
            attemptNumber + 1,
            invalidateNotifications,
            resetNewNotifications
          ),
        10000
      );
    }
  } else {
    invalidateNotifications();
    resetNewNotifications();
  }
}

export async function pollForReadNotifications(
  notificationId: string,
  attemptNumber: number,
  queryClient: QueryClient
) {
  const notifications = await get<Notification[]>('/notifications');

  if (attemptNumber <= 10) {
    if (
      notifications.find((notification) => notification.id === notificationId && notification.read)
    ) {
      queryClient.invalidateQueries({
        queryKey: ['notifications']
      });
    } else {
      setTimeout(
        () => pollForReadNotifications(notificationId, attemptNumber + 1, queryClient),
        10000
      );
    }
  } else {
    queryClient.invalidateQueries({
      queryKey: ['notifications']
    });
  }
}

export function useReadNotification() {
  const queryClient = useQueryClient();
  const readNotification = useMutation<{ id: string }, Error, string>({
    mutationFn: (id: string) => put(`/notifications/${id}`, {}),
    onSuccess: async (data) =>
      setTimeout(() => pollForReadNotifications(data.id, 1, queryClient), 1000),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const notifications = queryClient.getQueryData<Notification[]>(['notifications']);

      if (notifications) {
        const otherNotifications: Notification[] = notifications!.filter(
          (notification) => notification.id !== id
        );
        const notificationToBeUpdated: Notification | undefined = notifications!.find(
          (notification) => notification.id === id
        );

        if (notificationToBeUpdated) {
          const updatedNotifications: Notification[] = [
            { ...notificationToBeUpdated, read: true },
            ...otherNotifications
          ];
          queryClient.setQueryData<Notification[]>(['notifications'], updatedNotifications);
        }
      }
    }
  });
  return readNotification;
}
