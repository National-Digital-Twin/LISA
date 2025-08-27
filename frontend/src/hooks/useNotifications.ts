// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Notification } from 'common/Notification';
import { useCallback } from 'react';

import { FetchError, get, post, put } from '../api';
import { useNotificationContext } from './useNotificationContext';


export function useNotifications() {
  const queryClient = useQueryClient();
  const { isPolling } = useNotificationContext();

  const invalidate = useCallback(
    async () =>
      queryClient.invalidateQueries({
        queryKey: ['notifications']
      }),
    [queryClient]
  );
  
  const { data, isLoading, isError, error } = useQuery<Notification[], FetchError>({
    queryKey: ['notifications'],
    queryFn: () => get('/notifications'),
    staleTime: isPolling ? Infinity : 30_000,
    refetchOnMount: !isPolling,
    refetchOnWindowFocus: !isPolling,
  });

  return { notifications: data, isLoading, isError, error, invalidate };
}


export function useReadNotification() {
  const queryClient = useQueryClient();
  const { addPendingChange } = useNotificationContext();
  
  const readNotification = useMutation<
    { id: string },
    Error,
    string,
    { previousNotifications?: Notification[] }
  >({
    mutationFn: (id: string) => put(`/notifications/${id}`, {}),
    onSuccess: async (data) =>
      setTimeout(() => {
        addPendingChange(
          `read-${data.id}`,
          (notifications) =>
            notifications.find(
              (notification) => notification.id === data.id && notification.read
            ) !== undefined
        );
      }, 1000),
    onError: (_variables, _error, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications']);

      const updatedNotifications = previousNotifications!.map((notification) =>
        notification.id === id
          ? { ...notification, read: true, seen: true }
          : notification
      );
      queryClient.setQueryData<Notification[]>(['notifications'], updatedNotifications);

      return { previousNotifications };
    }
  });
  return readNotification;
}

export function useMarkAllAsSeen() {
  const queryClient = useQueryClient();
  const { addPendingChange } = useNotificationContext();
  
  const markAllAsSeen = useMutation<
    { markedAsSeen: number },
    Error,
    void,
    { previousNotifications?: Notification[]; firstUnseenId?: string }
  >({
    mutationFn: () => post('/notifications/actions/markSeen', {}),
    onSuccess: async (data, __, context) => {
      if (context?.firstUnseenId && data.markedAsSeen > 0) {
        setTimeout(() => {
          addPendingChange(
            `seen-${context.firstUnseenId}`,
            (notifications) =>
              notifications.find((n) => n.id === context.firstUnseenId)?.seen === true
          );
        }, 1000);
      }
    },
    onError: (_variables, _error, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications']);

      if (previousNotifications) {
        const firstUnseenId = previousNotifications.find((n) => !n.seen)?.id;
        const updatedNotifications = previousNotifications.map((notification) => ({
          ...notification,
          seen: true
        }));
        queryClient.setQueryData<Notification[]>(['notifications'], updatedNotifications);

        return { previousNotifications, firstUnseenId };
      }

      return { previousNotifications };
    }
  });
  return markAllAsSeen;
}
