import { type Notification } from 'common/Notification';
import { QueryClient } from '@tanstack/react-query';
import { get } from '../../api';
import { pollForReadNotifications } from '../useNotifications';

jest.mock('../../api', () => ({
  get: jest.fn()
}));

describe('pollForReadNotifications', () => {
  let queryClient: QueryClient;
  const notificationToBeReadId: string = 'notification-1';
  const notificationToBeRead: Notification = {
    id: notificationToBeReadId,
    dateTime: '1970-01-01',
    recipient: 'local.user',
    read: false,
    entry: {
      id: 'entry-0',
      dateTime: '1970-01-01',
      content: { text: '#1235 - Testing 02' },
      incidentId: 'incident-0',
      sequence: '0'
    }
  };
  const previousNotifications: Notification[] = [
    {
      id: 'notification-0',
      dateTime: '1970-01-01',
      read: true,
      recipient: 'local.user',
      entry: {
        id: 'entry-0',
        dateTime: '1970-01-01',
        content: { text: '#1234 - Testing 01' },
        incidentId: 'incident-0',
        sequence: '0'
      }
    }
  ];

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

  it('should invalidate queries immediately when a matching read notification is found with the provided id', async () => {
    (get as jest.Mock).mockResolvedValueOnce([
      { ...notificationToBeRead, read: true },
      ...previousNotifications
    ]);

    await pollForReadNotifications(notificationToBeReadId, 1, queryClient);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['notifications'] });
  });

  it('should invalidate queries when the attempt number is greater than 10', async () => {
    (get as jest.Mock).mockResolvedValueOnce([notificationToBeRead, ...previousNotifications]);

    await pollForReadNotifications(notificationToBeReadId, 11, queryClient);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['notifications'] });
  });
});
