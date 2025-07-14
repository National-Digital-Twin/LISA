import { type Notification } from 'common/Notification';
import { get } from '../../api';
import { pollForTotalNotifications } from '../useNotifications';

jest.mock('../../api', () => ({
  get: jest.fn()
}));

describe('pollForTotalNotifications', () => {
  const notificationToBeRead: Notification = {
    id: 'notification-1',
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
    (get as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls the invalidate function when the amount of notifications are increased', async () => {
    const invalidate: () => void = jest.fn();
    (get as jest.Mock).mockResolvedValueOnce([notificationToBeRead, ...previousNotifications]);

    await pollForTotalNotifications(1, 1, invalidate, jest.fn());

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it('calls the invalidate function when the attempt number is greater than 10', async () => {
    const invalidate: () => void = jest.fn();
    (get as jest.Mock).mockResolvedValueOnce([...previousNotifications]);

    await pollForTotalNotifications(1, 11, invalidate, jest.fn());

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it('calls the reset new notifications function when the amount of notifications are increased', async () => {
    (get as jest.Mock).mockResolvedValueOnce([notificationToBeRead, ...previousNotifications]);
    const resetNewNotifications: () => void = jest.fn();

    await pollForTotalNotifications(1, 1, jest.fn(), resetNewNotifications);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(resetNewNotifications).toHaveBeenCalledTimes(1);
  });

  it('calls the reset new notifications function when attempt number is greater than 10', async () => {
    (get as jest.Mock).mockResolvedValueOnce([...previousNotifications]);
    const resetNewNotifications: () => void = jest.fn();

    await pollForTotalNotifications(1, 11, jest.fn(), resetNewNotifications);

    expect(get).toHaveBeenCalledWith<unknown[]>('/notifications');
    expect(resetNewNotifications).toHaveBeenCalledTimes(1);
  });
});
