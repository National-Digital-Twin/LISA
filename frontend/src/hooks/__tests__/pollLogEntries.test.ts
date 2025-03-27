import { QueryClient } from '@tanstack/react-query';
import { get } from '../../api';
import { poll } from '../useLogEntries';

jest.mock('../../api', () => ({
  get: jest.fn()
}));

describe('poll', () => {
  let queryClient: QueryClient;
  const incidentId = 'incident-123';
  const logEntryId = 'log-entry-456';

  beforeEach(() => {
    jest.useFakeTimers();
    queryClient = {
      invalidateQueries: jest.fn(() => Promise.resolve()),
      setQueryData: jest.fn(),
      getQueryData: jest.fn(),
      cancelQueries: jest.fn()
    } as unknown as QueryClient;

    (get as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should invalidate queries immediately when matching log entry is found', async () => {
    (get as jest.Mock).mockResolvedValueOnce([{ id: logEntryId, message: 'Test log entry' }]);

    await poll(incidentId, logEntryId, queryClient, 1);

    expect(get).toHaveBeenCalledWith<unknown[]>(`/incident/${incidentId}/logEntries`);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [`incident/${incidentId}/logEntries`]
    });

    await Promise.resolve();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [`incident/${incidentId}/attachments`]
    });
  });

  it('should not poll further if attempt number exceeds 10', async () => {
    (get as jest.Mock).mockResolvedValueOnce([{ id: 'no-match', message: 'Nothing' }]);

    await poll(incidentId, logEntryId, queryClient, 11);

    expect(get).toHaveBeenCalledWith<unknown[]>(`/incident/${incidentId}/logEntries`);
    expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
  });
});
