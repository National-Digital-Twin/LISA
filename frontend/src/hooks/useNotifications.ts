// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Notification } from 'common/Notification';
import { useCallback } from 'react';

import { FetchError, get, post, put } from '../api';
import { useNotificationContext } from './useNotificationContext';

type PendingPredicate = (list: Notification[]) => boolean;

const NOTIFICATIONS_KEY = ['notifications'] as const;

const predicateHasBeenRead =
  (id: string): PendingPredicate =>
    (list) =>
      list.some((n) => n.id === id && n.read === true);

const predicateIsSeenById =
  (id: string): PendingPredicate =>
    (list) =>
      list.find((n) => n.id === id)?.seen === true;

const schedulePending = (
  addPendingChange: (key: string, predicate: PendingPredicate) => void,
  key: string,
  predicate: PendingPredicate,
  delay = 1000
) => setTimeout(() => addPendingChange(key, predicate), delay);

const optimisticRead = (prev: Notification[] | undefined, id: string) =>
  prev ? prev.map((n) => (n.id === id ? { ...n, read: true, seen: true } : n)) : prev;

const optimisticMarkAllSeen = (prev: Notification[] | undefined) =>
  prev ? prev.map((n) => ({ ...n, seen: true })) : prev;

const firstUnseenId = (list: Notification[] | undefined) =>
  list?.find((n) => !n.seen)?.id;


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

  return useMutation<
    { id: string },
    Error,
    string,
    { previousNotifications?: Notification[] }
  >({
    mutationFn: (id) => put(`/notifications/${id}`, {}),
    onSuccess: ({ id }) => {
      schedulePending(addPendingChange, `read-${id}`, predicateHasBeenRead(id));
    },
    onError: (_v, _e, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previousNotifications);
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData<Notification[]>(NOTIFICATIONS_KEY);
      const updated = optimisticRead(previous, id);
      if (updated) queryClient.setQueryData(NOTIFICATIONS_KEY, updated);
      return { previousNotifications: previous };
    }
  });
}

export function useMarkAllAsSeen() {
  const queryClient = useQueryClient();
  const { addPendingChange } = useNotificationContext();

  return useMutation<
    { markedAsSeen: number },
    Error,
    void,
    { previousNotifications?: Notification[]; firstUnseenId?: string }
  >({
    mutationFn: () => post('/notifications/actions/markSeen', {}),
    onSuccess: (data, _vars, context) => {
      if (context?.firstUnseenId && data.markedAsSeen > 0) {
        schedulePending(
          addPendingChange,
          `seen-${context.firstUnseenId}`,
          predicateIsSeenById(context.firstUnseenId)
        );
      }
    },
    onError: (_v, _e, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previousNotifications);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData<Notification[]>(NOTIFICATIONS_KEY);
      const updated = optimisticMarkAllSeen(previous);
      const firstId = firstUnseenId(previous);
      if (updated) queryClient.setQueryData(NOTIFICATIONS_KEY, updated);
      return { previousNotifications: previous, firstUnseenId: firstId };
    }
  });
}
