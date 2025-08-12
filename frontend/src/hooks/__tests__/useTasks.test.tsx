// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTasks, useAllTasks } from '../useTasks';
import { get } from '../../api';

jest.mock('../../api');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};

const mockTasks = [
  {
    id: 'task-1',
    name: 'Test Task 1',
    description: 'Description 1',
    incidentId: 'incident-1',
    author: { username: 'john.doe', displayName: 'John Doe' },
    assignee: { username: 'jane.smith', displayName: 'Jane Smith' },
    status: 'ToDo',
    sequence: '1',
    createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 'task-2',
    name: 'Test Task 2',
    description: 'Description 2',
    incidentId: 'incident-1',
    author: { username: 'jane.smith', displayName: 'Jane Smith' },
    assignee: { username: 'john.doe', displayName: 'John Doe' },
    status: 'InProgress',
    sequence: '2',
    createdAt: '2025-01-01T11:00:00Z'
  }
];

describe('useTasks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('fetches tasks for a specific incident', async () => {
    (get as jest.Mock).mockResolvedValueOnce(mockTasks);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTasks('incident-1'), {
      wrapper
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(get).toHaveBeenCalledWith('/incident/incident-1/tasks');
    expect(result.current.data).toEqual(mockTasks);
    expect(result.current.isError).toBe(false);
  });

  it('does not fetch when no incident ID is provided', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTasks(undefined), {
      wrapper
    });

    expect(get).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it('handles errors when fetching tasks', async () => {
    const errorMessage = 'Failed to fetch tasks';
    (get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTasks('incident-1'), {
      wrapper
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});

describe('useAllTasks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('fetches all tasks', async () => {
    const allTasks = [
      ...mockTasks,
      {
        id: 'task-3',
        name: 'Test Task 3',
        description: 'Description 3',
        incidentId: 'incident-2',
        author: { username: 'admin.user', displayName: 'Admin User' },
        assignee: { username: 'john.doe', displayName: 'John Doe' },
        status: 'Done',
        sequence: '1',
        createdAt: '2025-01-01T12:00:00Z'
      }
    ];

    (get as jest.Mock).mockResolvedValueOnce(allTasks);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useAllTasks(), {
      wrapper
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(get).toHaveBeenCalledWith('/tasks');
    expect(result.current.data).toEqual(allTasks);
    expect(result.current.isError).toBe(false);
  });

  it('handles errors when fetching all tasks', async () => {
    const errorMessage = 'Failed to fetch all tasks';
    (get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useAllTasks(), {
      wrapper
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

});
