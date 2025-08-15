// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Task, type CreateTask } from 'common/Task';
import { LogEntry } from 'common/LogEntry';
import { User } from 'common/User';
import { get, patch, post } from '../api';
import { useCreateLogEntry } from './useLogEntries';
import {
  createLogEntryFromTaskStatusUpdate,
  createLogEntryFromTaskAssigneeUpdate
} from '../utils/Task/updateLogEntries';
import { addOptimisticTask } from './useTaskUpdates';

export const useTasks = (incidentId?: string) =>
  useQuery<Task[]>({
    queryKey: [`incident/${incidentId}/tasks`],
    queryFn: () => get(`/incident/${incidentId}/tasks`),
    enabled: !!incidentId,
    staleTime: 10_000 // 10 seconds
  });

export const useAllTasks = () =>
  useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => get('/tasks'),
    staleTime: 10_000 // 10 seconds
  });

type CreateTaskInput = {
  task: CreateTask & Required<Pick<Task, 'id' | 'status'>>;
  files?: File[]; // attachments + generated sketches/recordings
};

export const useCreateTask = ({ author }: { author: User }) => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, CreateTaskInput, { previousTasks?: Task[]; previousAllTasks?: Task[] }>({
    mutationFn: ({ task, files }) => {
      if (files && files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append(file.name, file));
        formData.append('task', JSON.stringify(task));
        return post(`/incident/${task.incidentId}/tasks`, formData);
      }
      return post(`/incident/${task.incidentId}/tasks`, task);
    },
    onMutate: async ({ task }) => {
      await queryClient.cancelQueries({ queryKey: [`incident/${task.incidentId}/tasks`] });

      const optimisticTask: Task = {
        ...task,
        author,
        createdAt: new Date().toISOString(),
        location: task.location ?? null,
        attachments: task.attachments ?? [],
      };

      const { previousTasks, previousAllTasks } = await addOptimisticTask(
        queryClient,
        optimisticTask
      );

      return { previousTasks, previousAllTasks };
    },
    onError: (_error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([`incident/${variables.task.incidentId}/tasks`], context.previousTasks);
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(['tasks'], context.previousAllTasks);
      }
    },
  });
};

export const useUpdateTaskStatus = (incidentId?: string) => {
  const queryClient = useQueryClient();
  const { createLogEntry } = useCreateLogEntry(incidentId);

  return useMutation<Task, Error, { task: Task }, { previousTasks?: Task[] }>({
    mutationFn: ({ task }) => patch(`/task/${task.id}/status`, { status: task.status }),

    onMutate: async ({ task }) => {
      await queryClient.cancelQueries({
        queryKey: [`incident/${incidentId}/tasks`]
      });

      const previousTasks = queryClient.getQueryData<Task[]>([`incident/${incidentId}/tasks`]);

      queryClient.setQueryData<Task[]>(
        [`incident/${incidentId}/tasks`],
        previousTasks?.map((t) => {
          if (t.id === task.id) {
            return {
              ...t,
              status: task.status
            };
          }
          return t;
        }) ?? []
      );

      return { previousTasks };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([`incident/${incidentId}/tasks`], context.previousTasks);
      }
    },

    onSuccess: (_data, variables) => {
      const taskId = variables.task.id;
      const taskStatus = variables.task.status;

      if (!incidentId || !taskId || !taskStatus) return;

      const logEntry = {
        ...createLogEntryFromTaskStatusUpdate(taskId, taskStatus, incidentId)
      } as Omit<LogEntry, 'id' | 'author'>;
      createLogEntry({ logEntry });
    }
  });
};

export const useUpdateTaskAssignee = (incidentId?: string) => {
  const queryClient = useQueryClient();
  const { createLogEntry } = useCreateLogEntry(incidentId);

  return useMutation<Task, Error, { task: Task }, { previousTasks?: Task[] }>({
    mutationFn: ({ task }) => patch(`/task/${task.id}/assignee`, { assignee: task.assignee }),

    onMutate: async ({ task }) => {
      await queryClient.cancelQueries({
        queryKey: [`incident/${incidentId}/tasks`]
      });

      const previousTasks = queryClient.getQueryData<Task[]>([`incident/${incidentId}/tasks`]);

      queryClient.setQueryData<Task[]>(
        [`incident/${incidentId}/tasks`],
        previousTasks?.map((t) => {
          if (t.id === task.id) {
            return {
              ...t,
              assignee: task.assignee
            };
          }
          return t;
        }) ?? []
      );

      return { previousTasks };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([`incident/${incidentId}/tasks`], context.previousTasks);
      }
    },

    onSuccess: (_data, variables) => {
      const taskId = variables.task.id;
      const taskAssignee = variables.task.assignee?.displayName;

      if (!incidentId || !taskId || !taskAssignee) return;

      const logEntry = {
        ...createLogEntryFromTaskAssigneeUpdate(taskId, taskAssignee, incidentId)
      } as Omit<LogEntry, 'id' | 'author'>;
      createLogEntry({ logEntry });
    }
  });
};
