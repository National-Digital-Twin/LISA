import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from 'common/LogEntry';
import { useLogEntries } from '../useLogEntries';
import * as api from '../../api';

// Mock the API functions
jest.mock('../../api');
const mockedGet = api.get as jest.Mock;

// Mock uuid for predictable id in optimistic updates.
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

describe('useLogEntries', () => {
  let queryClient: QueryClient;

  // Create a fresh queryClient and use fake timers before each test.
  beforeEach(() => {
    queryClient = new QueryClient();
    jest.useFakeTimers();
    jest.clearAllTimers();
    mockedGet.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // A helper wrapper to provide the QueryClient to our hooks.
  const createWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should return log entries from the API', async () => {
    const sampleData: LogEntry[] = [
      {
        id: '1',
        sequence: '1',
        offline: false,
        incidentId: '',
        dateTime: '',
        type: 'action',
        content: {
          text: 'Test log entry'
        }
      }
    ];
    mockedGet.mockResolvedValue(sampleData);

    const { result } = renderHook(() => useLogEntries('incident1'), { wrapper: createWrapper });

    // Wait for the data to be loaded.
    await waitFor(() => expect(result.current.logEntries).toBeDefined());

    expect(result.current.logEntries).toEqual(sampleData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(mockedGet).toHaveBeenCalledWith('/incident/incident1/logEntries');
  });
});
