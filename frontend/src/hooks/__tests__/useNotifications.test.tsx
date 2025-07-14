import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotifications } from '../useNotifications';
import { get } from '../../api';

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
