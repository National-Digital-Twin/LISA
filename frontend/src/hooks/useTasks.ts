// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Task } from 'common/Task';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from 'common/LogEntry';
import { patch } from '../api';

export const useUpdateTaskStatus = (incidentId?: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    Task,
    Error,
    { task: Task },
    { previousEntries?: LogEntry[] }
  >({
    mutationFn: ({ task }) =>
      patch(`/task/${task.id}/status`, { status: task.status }),

    onMutate: async ({ task }) => {
      await queryClient.cancelQueries({
        queryKey: [`incident/${incidentId}/logEntries`],
      });

      const previousEntries = queryClient.getQueryData<LogEntry[]>(
        [`incident/${incidentId}/logEntries`]
      );

      queryClient.setQueryData<LogEntry[]>(
        [`incident/${incidentId}/logEntries`],
        previousEntries?.map((entry) => {
          if (entry.task?.id === task.id) {
            return {
              ...entry,
              task: {
                ...entry.task,
                status: task.status,
              },
            };
          }
          return entry;
        }) ?? []
      );

      return { previousEntries };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(
          [`incident/${incidentId}/logEntries`],
          context.previousEntries
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`incident/${incidentId}/logEntries`],
      });
    },
  });
};

export const useUpdateTaskAssignee = (incidentId?: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    Task,
    Error,
    { task: Task },
    { previousEntries?: LogEntry[] }
  >({
    mutationFn: ({ task }) =>
      patch(`/task/${task.id}/assignee`, { assignee: task.assignee }),

    onMutate: async ({ task }) => {
      await queryClient.cancelQueries({
        queryKey: [`incident/${incidentId}/logEntries`],
      });

      const previousEntries = queryClient.getQueryData<LogEntry[]>(
        [`incident/${incidentId}/logEntries`]
      );

      queryClient.setQueryData<LogEntry[]>(
        [`incident/${incidentId}/logEntries`],
        previousEntries?.map((entry) => {
          if (entry.task?.id === task.id) {
            return {
              ...entry,
              task: {
                ...entry.task,
                assignee: task.assignee,
              },
            };
          }
          return entry;
        }) ?? []
      );

      return { previousEntries };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(
          [`incident/${incidentId}/logEntries`],
          context.previousEntries
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`incident/${incidentId}/logEntries`],
      });
    },
  });
};
