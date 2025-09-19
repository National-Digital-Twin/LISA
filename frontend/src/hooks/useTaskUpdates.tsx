// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { type Task } from 'common/Task';

import { get } from '../api';
import { mergeOfflineEntities } from '../utils';

const POLLING_INTERVAL_SECONDS = 10;
const POLLING_INTERVAL_MS = POLLING_INTERVAL_SECONDS * 1000;

export function useTasksUpdates() {
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncTasks = useCallback(async () => {
    try {
      const tasks: Task[] = await get<Task[]>('/tasks');
      const cachedTasks: Task[] | undefined = queryClient.getQueryData<Task[]>(['tasks']);

      const mergedTasks = mergeOfflineEntities(cachedTasks, tasks);

      queryClient.setQueryData<Task[]>(['tasks'], mergedTasks);
    } catch (error) {
      console.error(`Error occurred: ${error}. Unable to poll for task updates!`);
    }
  }, [queryClient]);

  const startPolling = useCallback(() => {
    pollingIntervalRef.current = setInterval(syncTasks, POLLING_INTERVAL_MS);
  }, [syncTasks]);

  const clearPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  return { startPolling, clearPolling };
}

export const addOptimisticTask = async (
  queryClient: QueryClient,
  task: Task
) => {
  const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) ?? [];

  const offlineCountForIncident =
    previousTasks.filter((t) => t.offline && t.incidentId === task.incidentId).length;

  const optimisticTask: Task = {
    ...task,
    sequence: `${offlineCountForIncident + 1}`,
    offline: true
  };

  const updatedTasks = [optimisticTask, ...previousTasks];
  queryClient.setQueryData<Task[]>(['tasks'], updatedTasks);

  return { previousTasks, updatedTasks };
};
