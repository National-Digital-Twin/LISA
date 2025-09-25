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
  createLogEntryFromTaskAssigneeUpdate,
  createLogEntryFromTaskCreation
} from '../utils/Task/updateLogEntries';
import { addOptimisticTask } from './useTaskUpdates';
import { useIsOnline } from './useIsOnline';
import { addTask } from '../offline/db/dbOperations';
import { mergeOfflineEntities } from '../utils';

export const useTasks = (incidentId?: string) => {
  const queryClient = useQueryClient();

  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = await get<Task[]>('/tasks');
      const cachedTasks = queryClient.getQueryData<Task[]>(['tasks']);
      return mergeOfflineEntities(cachedTasks, tasks);
    },
    staleTime: 10_000, // 10 seconds
    select: (tasks) => (incidentId ? tasks.filter((t) => t.incidentId === incidentId) : tasks)
  });
};

type CreateTaskInput = {
  task: CreateTask & Required<Pick<Task, 'id' | 'status'>>;
  files?: File[]; // attachments + generated sketches/recordings
};

export const useCreateTask = ({ author, incidentId }: { author: User; incidentId?: string }) => {
  const queryClient = useQueryClient();
  const { createLogEntry } = useCreateLogEntry(incidentId);
  const isOnline = useIsOnline();

  return useMutation<
    { id: string },
    Error,
    CreateTaskInput,
    { previousTasks?: Task[]; previousAllTasks?: Task[] }
  >({
    mutationFn: async ({ task, files }) => {
      if (!isOnline) {
        const offlineTask: Task = {
          ...task,
          author,
          createdAt: new Date().toISOString(),
          attachments: task.attachments ?? [],
          offline: true
        };
        await addTask(offlineTask);
        return { id: task.id };
      }

      if (files && files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append(file.name, file));
        formData.append('task', JSON.stringify(task));
        return post(`/incident/${task.incidentId}/tasks`, formData);
      }
      return post(`/incident/${task.incidentId}/tasks`, task);
    },
    onMutate: async ({ task }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const optimisticTask: Task = {
        ...task,
        author,
        createdAt: new Date().toISOString(),
        attachments: task.attachments ?? []
      };

      const { previousTasks } = await addOptimisticTask(queryClient, optimisticTask);

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSuccess: (_data, variables) => {
      const taskId = variables.task.id;
      const taskName = variables.task.name;
      const taskIncidentId = variables.task.incidentId;
      const taskAssignee = variables.task.assignee.displayName;

      if (!taskIncidentId || !taskId || !taskName || !taskAssignee) return;

      const logEntry = {
        ...createLogEntryFromTaskCreation(taskId, taskName, taskAssignee, taskIncidentId)
      } as Omit<LogEntry, 'author'>;
      createLogEntry({ logEntry });
    },
    networkMode: 'always'
  });
};

export const useUpdateTaskStatus = (incidentId?: string) => {
  const queryClient = useQueryClient();
  const { createLogEntry } = useCreateLogEntry(incidentId);

  return useMutation<Task, Error, { task: Task }, { previousTasks?: Task[] }>({
    mutationFn: ({ task }) => patch(`/task/${task.id}/status`, { status: task.status }),

    onMutate: async ({ task }) => {
      await queryClient.cancelQueries({
        queryKey: ['tasks']
      });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(
        ['tasks'],
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
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },

    onSuccess: (_data, variables) => {
      const taskId = variables.task.id;
      const taskStatus = variables.task.status;

      if (!incidentId || !taskId || !taskStatus) return;

      const logEntry = {
        ...createLogEntryFromTaskStatusUpdate(taskId, taskStatus, incidentId)
      } as Omit<LogEntry, 'author'>;
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
        queryKey: ['tasks']
      });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(
        ['tasks'],
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
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },

    onSuccess: (_data, variables) => {
      const taskId = variables.task.id;
      const taskAssignee = variables.task.assignee?.displayName;

      if (!incidentId || !taskId || !taskAssignee) return;

      const logEntry = {
        ...createLogEntryFromTaskAssigneeUpdate(taskId, taskAssignee, incidentId)
      } as Omit<LogEntry, 'author'>;
      createLogEntry({ logEntry });
    }
  });
};
