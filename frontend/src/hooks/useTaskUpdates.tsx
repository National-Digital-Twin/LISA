// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { type Task } from 'common/Task';

import { get } from '../api';

const POLLING_INTERVAL_SECONDS = 10;
const POLLING_INTERVAL_MS = POLLING_INTERVAL_SECONDS * 1000;

const mergeTasks = (cachedTasks: Task[] | undefined, serverTasks: Task[]): Task[] => {
  const matchedTasks: Task[] = [];
  let unmatchedTasks: Task[] = [];

  if (cachedTasks) {
    cachedTasks.forEach((cachedTask) => {
      const matchedTask = serverTasks.find((task) => task.id === cachedTask.id);

      if (matchedTask) {
        matchedTasks.push(matchedTask);
      } else if (cachedTask.offline) {
        unmatchedTasks.push(cachedTask);
      }
    });

    serverTasks.forEach((task) => {
      const matchedTask = cachedTasks.find((cachedTask) => cachedTask.id === task.id);
      if (!matchedTask) {
        unmatchedTasks.push(task);
      }
    });
  } else {
    unmatchedTasks = serverTasks;
  }

  return [...matchedTasks, ...unmatchedTasks];
};

export function useTasksUpdates(incidentId?: string) {
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncTasks = useCallback(async () => {
    if (!incidentId) return;
    
    try {
      const tasks: Task[] = await get<Task[]>(`/incident/${incidentId}/tasks`);
      const cachedTasks: Task[] | undefined = queryClient.getQueryData<Task[]>([
        `incident/${incidentId}/tasks`
      ]);

      const mergedTasks = mergeTasks(cachedTasks, tasks);

      queryClient.setQueryData<Task[]>([`incident/${incidentId}/tasks`], mergedTasks);
    } catch (error) {
      console.error(`Error occurred: ${error}. Unable to poll for task updates!`);
    }
  }, [incidentId, queryClient]);

  const startPolling = useCallback(() => {
    if (!incidentId) return;
    
    pollingIntervalRef.current = setInterval(syncTasks, POLLING_INTERVAL_MS);
  }, [syncTasks, incidentId]);

  const clearPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  return { startPolling, clearPolling };
}

export function useAllTasksUpdates() {
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncAllTasks = useCallback(async () => {
    try {
      const allTasks: Task[] = await get<Task[]>('/tasks');
      const cachedAllTasks: Task[] | undefined = queryClient.getQueryData<Task[]>(['tasks']);

      const mergedTasks = mergeTasks(cachedAllTasks, allTasks);

      queryClient.setQueryData<Task[]>(['tasks'], mergedTasks);
    } catch (error) {
      console.error(`Error occurred: ${error}. Unable to poll for all tasks updates!`);
    }
  }, [queryClient]);

  const startPolling = useCallback(() => {
    pollingIntervalRef.current = setInterval(syncAllTasks, POLLING_INTERVAL_MS);
  }, [syncAllTasks]);

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
  // Ensure the caches exist, fetching if needed
  let previousTasks = queryClient.getQueryData<Task[]>([
    `incident/${task.incidentId}/tasks`
  ]);
  if (!previousTasks) {
    try {
      previousTasks = await queryClient.fetchQuery({
        queryKey: [`incident/${task.incidentId}/tasks`],
        queryFn: () => get(`/incident/${task.incidentId}/tasks`),
        staleTime: 5 * 60 * 1000
      }) ?? [];
    } catch {
      previousTasks = [];
    }
  }

  let previousAllTasks = queryClient.getQueryData<Task[]>(['tasks']);
  if (!previousAllTasks) {
    try {
      previousAllTasks = await queryClient.fetchQuery({
        queryKey: ['tasks'],
        queryFn: () => get('/tasks'),
        staleTime: 5 * 60 * 1000
      }) ?? [];
    } catch {
      previousAllTasks = [];
    }
  }

  const offlineCount = previousTasks?.filter((t: Task) => t.offline).length ?? 0;
  const optimisticTask: Task = {
    ...task,
    sequence: `${offlineCount + 1}`,
    offline: true
  };

  const updatedTasks = [optimisticTask, ...previousTasks];
  queryClient.setQueryData<Task[]>([`incident/${task.incidentId}/tasks`], updatedTasks);

  const updatedAllTasks = [optimisticTask, ...previousAllTasks];
  queryClient.setQueryData<Task[]>(['tasks'], updatedAllTasks);

  return { previousTasks, previousAllTasks, updatedTasks };
};
