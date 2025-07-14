import { QueryClient } from '@tanstack/react-query';
import { get } from '../../api';
import { pollForReadNotifications } from '../useNotifications';
import { newNotificationGenerator, previousTestNotifications } from './notificationMocks';

jest.mock('../../api', () => ({
  get: jest.fn()
}));

describe('pollForReadNotifications', () => {
  let queryClient: QueryClient;
  const notificationToBeReadId: string = 'notification-1';

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
      { ...newNotificationGenerator(notificationToBeReadId), read: true },
      ...previousTestNotifications
    ]);

    await pollForReadNotifications(notificationToBeReadId, 1, queryClient);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['notifications'] });
  });

  it('should invalidate queries when the attempt number is greater than 10', async () => {
    (get as jest.Mock).mockResolvedValueOnce([
      newNotificationGenerator(notificationToBeReadId),
      ...previousTestNotifications
    ]);

    await pollForReadNotifications(notificationToBeReadId, 11, queryClient);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['notifications'] });
  });
});
