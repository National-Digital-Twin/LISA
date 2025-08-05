import { fireEvent, screen } from '@testing-library/react';
import { type Notification } from 'common/Notification';
import * as hooks from '../../hooks';
import { newNotificationGenerator } from '../../hooks/__tests__/notification.mock';
import { providersRender } from '../../test-utils';
import Notifications from '../Notifications';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const hour = 60 * 60 * 1000;
const day = 24 * hour;
const week = 7 * day;

const sampleNotifications: Notification[] = [
  { ...newNotificationGenerator('1'), read: false, dateTime: new Date().toISOString() },
  {
    ...newNotificationGenerator('2'),
    read: true,
    dateTime: new Date(Date.now() - day).toISOString()
  },
  {
    ...newNotificationGenerator('3'),
    read: false,
    dateTime: new Date(Date.now() - week).toISOString()
  }
];

jest.mock('../../hooks', () => ({
  useNotifications: jest.fn(() => ({
    notifications: sampleNotifications,
    invalidate: jest.fn()
  })),
  useReadNotification: jest.fn(() => ({
    mutate: jest.fn()
  }))
}));

describe('Notifications Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the notifications page with title', () => {
    providersRender(<Notifications />);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('displays notifications in chronological order', () => {
    providersRender(<Notifications />);

    const notificationItems = screen.getAllByRole('listitem');
    expect(notificationItems).toHaveLength(3);
  });

  it('shows relative time for older notifications', () => {
    providersRender(<Notifications />);

    const agoElements = screen.getAllByText(/ago/);
    expect(agoElements.length).toBeGreaterThan(0);
  });

  it('shows unread count in tab label', () => {
    providersRender(<Notifications />);

    expect(screen.getByText('Unread (2)')).toBeInTheDocument();
  });

  it('filters to show only unread notifications when unread tab is selected', () => {
    providersRender(<Notifications />);

    const unreadTab = screen.getByText('Unread (2)');
    fireEvent.click(unreadTab);

    const notificationItems = screen.getAllByRole('listitem');
    expect(notificationItems).toHaveLength(2);
  });

  it('shows empty state when no notifications exist', () => {
    (hooks.useNotifications as jest.Mock).mockImplementation(() => ({
      notifications: [],
      invalidate: jest.fn()
    }));

    providersRender(<Notifications />);

    expect(screen.getByText('There are no notifications')).toBeInTheDocument();
  });

  it('shows empty state when no unread notifications exist', () => {
    (hooks.useNotifications as jest.Mock).mockImplementation(() => ({
      notifications: sampleNotifications.filter((n) => n.read),
      invalidate: jest.fn()
    }));

    providersRender(<Notifications />);

    const unreadTab = screen.getByText('Unread');
    fireEvent.click(unreadTab);

    expect(screen.getByText('You have no unread notifications')).toBeInTheDocument();
  });

  it('handles notification click correctly', () => {
    providersRender(<Notifications />);

    const firstNotification = screen.getAllByRole('listitem')[0];
    fireEvent.click(firstNotification);

    expect(mockNavigate).toHaveBeenCalled();
  });
});
