import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAttachments } from '../useAttachments';
import { get } from '../../api';

jest.mock('../../api', () => ({
  get: jest.fn(),
  FetchError: class FetchError extends Error {}
}));

describe('useAttachments', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false // disable retries for testing
        }
      }
    });

    return function Wrapper({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  };

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('fetches attachments successfully', async () => {
    const fakeData = [{ id: '1', name: 'Attachment1' }]; // adjust shape as needed
    (get as jest.Mock).mockResolvedValueOnce(fakeData);
    const incidentId = '123';

    const { result } = renderHook(() => useAttachments(incidentId), {
      wrapper: createWrapper()
    });

    // Wait until data is fetched
    await waitFor(() => result.current.attachments !== undefined);

    // Verify that the API was called with the proper URL
    expect(get).toHaveBeenCalledWith(`/incident/${incidentId}/attachments`);
    // Check the returned values
    expect(result.current.attachments).toEqual(fakeData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles error when API call fails', async () => {
    const error = new Error('Network Error');
    // Use mockImplementationOnce to simulate a rejected promise
    (get as jest.Mock).mockImplementationOnce(() => Promise.reject(error));
    const incidentId = '456';

    const { result } = renderHook(() => useAttachments(incidentId), {
      wrapper: createWrapper()
    });

    // Flush any pending promises
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    // Wait until isLoading becomes false and error is set
    await waitFor(() => {
      if (result.current.isLoading) {
        throw new Error('Still loading');
      }
      return true;
    });

    expect(get).toHaveBeenCalledWith(`/incident/${incidentId}/attachments`);
    expect(result.current.attachments).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(error);
  });

  it('handles undefined incidentId', async () => {
    const fakeData: never[] = []; // empty data set for this case
    (get as jest.Mock).mockResolvedValueOnce(fakeData);

    const { result } = renderHook(() => useAttachments(undefined), {
      wrapper: createWrapper()
    });

    await waitFor(() => result.current.attachments !== undefined);

    // Note: With incidentId undefined, the URL will include "undefined"
    expect(get).toHaveBeenCalledWith('/incident/undefined/attachments');
    expect(result.current.attachments).toEqual(fakeData);
  });
});
