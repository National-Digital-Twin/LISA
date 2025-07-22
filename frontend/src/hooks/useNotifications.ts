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
  retryAttemptNumber: number,
  invalidateNotifications: () => void,
  resetNewNotifications: () => void
) {
  try {
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
              retryAttemptNumber,
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
  } catch (error) {
    const retryAttemptsLeft = 3 - retryAttemptNumber;
    // eslint-disable-next-line no-console
    console.error(
      `Error occured while polling for updates: ${error}. Retry attempts left: ${retryAttemptsLeft}`
    );

    if (retryAttemptsLeft > 0) {
      setTimeout(
        () =>
          pollForTotalNotifications(
            totalCurrentNotifications,
            attemptNumber + 1,
            retryAttemptNumber + 1,
            invalidateNotifications,
            resetNewNotifications
          ),
        10000
      );
    }
  }
}

export async function pollForReadNotifications(
  notificationId: string,
  attemptNumber: number,
  retryAttemptNumber: number,
  queryClient: QueryClient
) {
  try {
    const notifications = await get<Notification[]>('/notifications');

    if (attemptNumber <= 10) {
      if (
        notifications.find(
          (notification) => notification.id === notificationId && notification.read
        )
      ) {
        queryClient.invalidateQueries({
          queryKey: ['notifications']
        });
      } else {
        setTimeout(
          () =>
            pollForReadNotifications(
              notificationId,
              attemptNumber + 1,
              retryAttemptNumber,
              queryClient
            ),
          10000
        );
      }
    } else {
      queryClient.invalidateQueries({
        queryKey: ['notifications']
      });
    }
  } catch (error) {
    const retryAttemptsLeft = 3 - retryAttemptNumber;
    // eslint-disable-next-line no-console
    console.error(
      `Error occured while polling for updates: ${error}. Retry attempts left: ${retryAttemptsLeft}`
    );

    if (retryAttemptsLeft > 0) {
      setTimeout(
        () =>
          pollForReadNotifications(
            notificationId,
            attemptNumber + 1,
            retryAttemptNumber + 1,
            queryClient
          ),
        5000
      );
    }
  }
}

export function useReadNotification() {
  const queryClient = useQueryClient();
  const readNotification = useMutation<
    { id: string },
    Error,
    string,
    { previousNotifications?: Notification[] }
  >({
    mutationFn: (id: string) => put(`/notifications/${id}`, {}),
    onSuccess: async (data) =>
      setTimeout(() => pollForReadNotifications(data.id, 1, 1, queryClient), 1000),
    onError: (_variables, _error, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications']);

      const otherNotifications: Notification[] = previousNotifications!.filter(
        (notification) => notification.id !== id
      );
      const notificationToBeUpdated: Notification | undefined = previousNotifications!.find(
        (notification) => notification.id === id
      );

      if (notificationToBeUpdated) {
        const updatedNotifications = [
          { ...notificationToBeUpdated, read: true },
          ...otherNotifications
        ];
        queryClient.setQueryData<Notification[]>(['notifications'], updatedNotifications);
      }

      return { previousNotifications };
    }
  });
  return readNotification;
}
