import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotifications, useReadNotification } from '../useNotifications';
import { get, put } from '../../api';

jest.mock('../../api');

describe('useNotifications', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('invalidate function calls queryClient.invalidateQueries', async () => {
    (get as jest.Mock).mockResolvedValueOnce([]);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useNotifications(), {
      wrapper
    });

    // Wait for the query to finish.
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Spy on invalidateQueries for the current query client.
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    await act(async () => {
      await result.current.invalidate();
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] });
    invalidateSpy.mockRestore();
  });
});

describe('useReadNotification', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls API to mark notification as read and invalidates notifications', async () => {
    const notificationId = '123';
    (put as jest.Mock).mockResolvedValueOnce(undefined);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useReadNotification(), {
      wrapper
    });

    // Spy on invalidateQueries from the query client.
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    // Trigger the mutation.
    await act(async () => {
      await result.current.mutateAsync(notificationId);
    });

    expect(put).toHaveBeenCalledWith(`/notifications/${notificationId}`, {});
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] });
    invalidateSpy.mockRestore();
  });
});
