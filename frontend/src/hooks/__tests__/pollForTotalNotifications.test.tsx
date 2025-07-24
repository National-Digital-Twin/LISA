import { FetchError, get } from '../../api';
import { newNotificationGenerator, previousTestNotifications } from './notification.mock';
import { pollForTotalNotifications } from '../useNotifications';

jest.mock('../../api', () => ({
  get: jest.fn()
}));

describe('pollForTotalNotifications', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (get as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const notificationId: string = 'notification-0';

  it('calls the invalidate function when the amount of notifications are increased', async () => {
    const invalidate: () => void = jest.fn();
    (get as jest.Mock).mockResolvedValueOnce([
      newNotificationGenerator(notificationId),
      ...previousTestNotifications
    ]);

    await pollForTotalNotifications(1, 1, 1, invalidate, jest.fn());

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it('calls the invalidate function when the attempt number is greater than 10', async () => {
    const invalidate: () => void = jest.fn();
    (get as jest.Mock).mockResolvedValueOnce([...previousTestNotifications]);

    await pollForTotalNotifications(1, 11, 1, invalidate, jest.fn());

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it('calls the reset new notifications function when the amount of notifications are increased', async () => {
    (get as jest.Mock).mockResolvedValueOnce([
      newNotificationGenerator(notificationId),
      ...previousTestNotifications
    ]);
    const resetNewNotifications: () => void = jest.fn();

    await pollForTotalNotifications(1, 1, 1, jest.fn(), resetNewNotifications);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(resetNewNotifications).toHaveBeenCalledTimes(1);
  });

  it('calls the reset new notifications function when attempt number is greater than 10', async () => {
    (get as jest.Mock).mockResolvedValueOnce([...previousTestNotifications]);
    const resetNewNotifications: () => void = jest.fn();

    await pollForTotalNotifications(1, 11, 1, jest.fn(), resetNewNotifications);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(resetNewNotifications).toHaveBeenCalledTimes(1);
  });

  it('calls set timeout when the amount of notifications is the same', async () => {
    let setTimeoutCalled = false;
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      setTimeoutCalled = true;
      return setTimeout(() => {}, 0);
    });
    (get as jest.Mock).mockResolvedValueOnce([...previousTestNotifications]);

    await pollForTotalNotifications(1, 1, 1, jest.fn(), jest.fn());

    expect(setTimeoutCalled).toBeTruthy();
  });

  it('calls set timeout when an error is encountered while fetching the noitifications and the retry attempt is < 3', async () => {
    let setTimeoutCalled = false;
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      setTimeoutCalled = true;
      return setTimeout(() => {}, 0);
    });
    (get as jest.Mock).mockImplementationOnce(() => {
      throw new FetchError('Error occured!', 500);
    });

    await pollForTotalNotifications(1, 1, 1, jest.fn(), jest.fn());

    expect(setTimeoutCalled).toBeTruthy();
  });

  it('does nothing when an error is encountered while fetching the notifications and the retry attempt is > 3', async () => {
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw new Error('setTimeout should not have been called');
    });
    (get as jest.Mock).mockImplementationOnce(() => {
      throw new FetchError('Error occured!', 500);
    });

    const invalidate = jest.fn();
    const resetNewNotifications = jest.fn();

    await pollForTotalNotifications(1, 1, 4, invalidate, resetNewNotifications);

    expect(setTimeout).not.toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
    expect(resetNewNotifications).not.toHaveBeenCalled();
  });
});
