import { get } from '../../api';
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

    await pollForTotalNotifications(1, 1, invalidate, jest.fn());

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it('calls the invalidate function when the attempt number is greater than 10', async () => {
    const invalidate: () => void = jest.fn();
    (get as jest.Mock).mockResolvedValueOnce([...previousTestNotifications]);

    await pollForTotalNotifications(1, 11, invalidate, jest.fn());

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it('calls the reset new notifications function when the amount of notifications are increased', async () => {
    (get as jest.Mock).mockResolvedValueOnce([
      newNotificationGenerator(notificationId),
      ...previousTestNotifications
    ]);
    const resetNewNotifications: () => void = jest.fn();

    await pollForTotalNotifications(1, 1, jest.fn(), resetNewNotifications);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(resetNewNotifications).toHaveBeenCalledTimes(1);
  });

  it('calls the reset new notifications function when attempt number is greater than 10', async () => {
    (get as jest.Mock).mockResolvedValueOnce([...previousTestNotifications]);
    const resetNewNotifications: () => void = jest.fn();

    await pollForTotalNotifications(1, 11, jest.fn(), resetNewNotifications);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(resetNewNotifications).toHaveBeenCalledTimes(1);
  });
});
