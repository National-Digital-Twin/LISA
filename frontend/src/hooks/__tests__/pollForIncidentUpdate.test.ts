import { QueryClient } from '@tanstack/react-query';
import { type Referrer, type Incident } from 'common/Incident';
import { get } from '../../api';
import { pollForIncidentUpdate } from '../useIncidents';

jest.mock('../../api', () => ({
  get: jest.fn()
}));

const mockReferrer: Referrer = {
  name: 'Local User',
  email: 'local.user@example.com',
  organisation: 'Test',
  supportRequested: 'No',
  telephone: '123456789'
};

const mockIncidentForTest: Incident = {
  id: 'incident-1',
  type: 'Storms',
  startedAt: '1970-01-01',
  name: 'Test 2',
  referrer: mockReferrer,
  stage: 'Response'
};

const mockIncidentWithoutStageChangeForTest: Incident = {
  ...mockIncidentForTest,
  stage: 'Monitoring'
};

const mockOtherIncidentForTest: Incident = {
  id: 'incident-3',
  type: 'Drought',
  startedAt: '1970-01-01',
  name: 'Test 2',
  referrer: mockReferrer,
  stage: 'Monitoring'
};

const mockIncidents: Incident[] = [
  {
    id: 'incident-0',
    type: 'OilTradeDisruption',
    startedAt: '1970-01-01',
    name: 'Test 1',
    referrer: mockReferrer,
    stage: 'Monitoring'
  },
  mockIncidentForTest
];

describe('pollForIncidentUpdate', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.useFakeTimers();
    queryClient = {
      invalidateQueries: jest.fn(() => Promise.resolve()),
      setQueryData: jest.fn(),
      getQueryData: () => mockIncidents,
      cancelQueries: jest.fn()
    } as unknown as QueryClient;

    (get as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('throws an error when the incident id provided is undefined', async () => {
    await expect(() => pollForIncidentUpdate(undefined, 1, queryClient)).rejects.toThrow(
      'Incident id undefined unable to poll for updates!'
    );
  });

  it('throws an error when the attempt number provided is equal to 0', async () => {
    await expect(() => pollForIncidentUpdate('incident-0', 0, queryClient)).rejects.toThrow(
      'Attempt number is less than or equal to 0 unable to poll for updates!'
    );
  });

  it('throws an error when the attempt number provided is less than 0', async () => {
    await expect(() => pollForIncidentUpdate('incident-0', -1, queryClient)).rejects.toThrow(
      'Attempt number is less than or equal to 0 unable to poll for updates!'
    );
  });

  it('does nothing when the cached incident is undefined', async () => {
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw new Error('setTimeout should not have been called');
    });
    (get as jest.Mock).mockResolvedValueOnce(mockOtherIncidentForTest);

    await pollForIncidentUpdate('incident-3', 1, queryClient);

    expect(setTimeout).not.toHaveBeenCalled();
    expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
  });

  it('does nothing when the incident from the backend is undefined', async () => {
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw new Error('setTimeout should not have been called');
    });
    (get as jest.Mock).mockResolvedValueOnce(undefined);

    await pollForIncidentUpdate('incident-1', 1, queryClient);

    expect(setTimeout).not.toHaveBeenCalled();
    expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
  });

  it('invalidates the query cache when the incident stage change is mirrored by the backend', async () => {
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw new Error('setTimeout should not have been called');
    });
    (get as jest.Mock).mockResolvedValueOnce(mockIncidentForTest);

    await pollForIncidentUpdate('incident-1', 1, queryClient);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['incidents'] });
  });

  it('invalidates the query cache when the attempt number is greater than 10', async () => {
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw new Error('setTimeout should not have been called');
    });
    (get as jest.Mock).mockResolvedValueOnce(mockIncidentWithoutStageChangeForTest);

    await pollForIncidentUpdate('incident-1', 11, queryClient);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['incidents'] });
  });

  it('calls set timeout when the incident change is not mirrored by the backend', async () => {
    let setTimeoutCalled = false;
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      setTimeoutCalled = true;
      return setTimeout(() => {}, 0);
    });
    (get as jest.Mock).mockResolvedValueOnce(mockIncidentWithoutStageChangeForTest);

    await pollForIncidentUpdate('incident-1', 1, queryClient);

    expect(setTimeoutCalled).toBeTruthy();
  });
});
