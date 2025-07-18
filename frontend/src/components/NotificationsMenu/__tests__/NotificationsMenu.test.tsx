import { fireEvent, render, screen } from '@testing-library/react';
import { type Notification } from 'common/Notification';
import { get } from '../../../api';
import * as hooks from '../../../hooks';
import { newNotificationGenerator } from '../../../hooks/__tests__/notification.mock';
import useMessaging from '../../../hooks/useMessaging';
import { providersRender } from '../../../test-utils';
import { NotificationsMenu } from '../index';

const mockInvalidate = jest.fn();
const mockMutate = jest.fn();

jest.mock('../../../api', () => ({
  get: jest.fn()
}));

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useNotifications: jest.fn()
}));

const sampleNotifications: Notification[] = [
  newNotificationGenerator('1'),
  newNotificationGenerator('2')
];

jest.mock('../../../hooks', () => ({
  useAuth: jest.fn(() => ({
    user: { current: { username: 'testUser' } }
  })),
  useNotifications: jest.fn(() => ({
    notifications: sampleNotifications,
    invalidate: mockInvalidate
  })),
  useOutsideClick: jest.fn(() => ({ current: null })),
  useReadNotification: jest.fn(() => ({
    mutate: mockMutate
  }))
}));

jest.mock('../../../hooks/useMessaging', () => jest.fn(() => [false, jest.fn()]));

jest.mock('../handlers', () => ({
  __esModule: true,
  default: jest.fn((notification) => ({
    title: notification.recipient,
    Content: <span>{notification.recipient}</span>,
    clickHandler: jest.fn()
  }))
}));

describe('NotificationsMenu Component', () => {
  beforeEach(() => {
    mockInvalidate.mockClear();
    mockMutate.mockClear();
  });

  it('renders the notifications badge with correct unread count', () => {
    providersRender(<NotificationsMenu />);
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('toggles the menu when the notifications icon button is clicked', () => {
    providersRender(<NotificationsMenu />);

    const iconButton = screen.getByText('2');
    expect(iconButton).toBeInTheDocument();

    fireEvent.click(iconButton);
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: '' });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });

  it('displays "No notifications" when notification list is empty', () => {
    (hooks.useNotifications as jest.Mock).mockImplementation(() => ({
      notifications: [],
      invalidate: mockInvalidate
    }));

    providersRender(<NotificationsMenu />);
    const iconButton = screen.getByRole('button');
    fireEvent.click(iconButton);

    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
  });

  it('calls invalidate when new notifications are received (via useMessaging hook)', async () => {
    const additionalNotification = newNotificationGenerator('3');

    (get as jest.Mock).mockResolvedValue([...sampleNotifications, additionalNotification]);

    (useMessaging as jest.Mock).mockReturnValue([true, jest.fn()]);

    render(<NotificationsMenu />);

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1100);
    });

    expect(mockInvalidate).toHaveBeenCalled();
  });
});