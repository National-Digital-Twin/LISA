import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotifications, useReadNotification } from '../useNotifications';
import { get, put } from '../../api';

jest.mock('../../api');

// Create a helper that returns a wrapper and the QueryClient instance.
const createWrapper = () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};

describe('useNotifications', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('invalidate function calls queryClient.invalidateQueries', async () => {
    (get as jest.Mock).mockResolvedValueOnce([]);

    // Get the wrapper and queryClient from our helper.
    const { wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useNotifications(), {
      wrapper
    });

    // Wait for the query to complete.
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Spy on the invalidateQueries method of the query client.
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    await act(async () => {
      await result.current.invalidate();
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] });
    invalidateSpy.mockRestore();
  });
});

describe('useReadNotification', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls API to mark notification as read and invalidates notifications', async () => {
    const notificationId = '123';
    (put as jest.Mock).mockResolvedValueOnce(undefined);

    // Reuse the helper to obtain the wrapper and queryClient.
    const { wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useReadNotification(), {
      wrapper
    });

    // Spy on the invalidateQueries method.
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
