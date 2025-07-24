import { QueryClient } from '@tanstack/react-query';
import { FetchError, get } from '../../api';
import { newNotificationGenerator, previousTestNotifications } from './notification.mock';
import { pollForReadNotifications } from '../useNotifications';

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

    await pollForReadNotifications(notificationToBeReadId, 1, 1, queryClient);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['notifications'] });
  });

  it('should invalidate queries when the attempt number is greater than 10', async () => {
    (get as jest.Mock).mockResolvedValueOnce([
      newNotificationGenerator(notificationToBeReadId),
      ...previousTestNotifications
    ]);

    await pollForReadNotifications(notificationToBeReadId, 11, 1, queryClient);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['notifications'] });
  });

  it('calls set timeout when the read notification is not found with the provided id', async () => {
    let setTimeoutCalled = false;
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      setTimeoutCalled = true;
      return setTimeout(() => {}, 0);
    });
    (get as jest.Mock).mockResolvedValueOnce([
      newNotificationGenerator(notificationToBeReadId),
      ...previousTestNotifications
    ]);

    await pollForReadNotifications(notificationToBeReadId, 1, 1, queryClient);

    expect(setTimeoutCalled).toBeTruthy();
  });

  it('calls set timeout when an error is encountered while fetching the notifications and the retry attempt is < 3', async () => {
    let setTimeoutCalled = false;
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      setTimeoutCalled = true;
      return setTimeout(() => {}, 0);
    });
    (get as jest.Mock).mockImplementationOnce(() => {
      throw new FetchError('Error occured!', 500);
    });

    await pollForReadNotifications(notificationToBeReadId, 1, 1, queryClient);

    expect(setTimeoutCalled).toBeTruthy();
  });

  it('does nothing when an error is encountered while fetching the notifications and the retry attempt is > 3', async () => {
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw new Error('setTimeout should not have been called');
    });
    (get as jest.Mock).mockImplementationOnce(() => {
      throw new FetchError('Error occured!', 500);
    });

    await pollForReadNotifications(notificationToBeReadId, 1, 4, queryClient);

    expect(setTimeout).not.toHaveBeenCalled();
    expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
  });
});
