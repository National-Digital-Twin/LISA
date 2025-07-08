import { render, screen, fireEvent } from '@testing-library/react';
import { type Notification } from 'common/Notification';
import { NotificationsMenu } from '../index';
import { providersRender } from '../../../test-utils';
import * as hooks from '../../../hooks';
import useMessaging from '../../../hooks/useMessaging';

// Create mock implementations for the custom hooks used in NotificationsMenu
const mockInvalidate = jest.fn();
const mockMutate = jest.fn();

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useNotifications: jest.fn()
}));

const sampleNotifications: Notification[] = [
  {
    id: '1',
    read: false,
    recipient: 'Notification 1',
    dateTime: '',
    entry: {
      id: '1',
      incidentId: '1',
      dateTime: '',
      sequence: '1',
      author: { username: 'testUser', displayName: 'Test User' },
      content: { text: 'Test content', json: '' }
    }
  },
  {
    id: '2',
    read: false,
    recipient: 'Notification 3',
    dateTime: '',
    entry: {
      id: '4',
      incidentId: '5',
      dateTime: '',
      sequence: '6',
      author: { username: 'testUser2', displayName: 'Test User 2' },
      content: { text: 'Test content 7', json: '' }
    }
  }
];

jest.mock('../../../hooks', () => ({
  useAuth: jest.fn(() => ({
    user: { current: { username: 'testUser' } }
  })),
  useNotifications: jest.fn(() => ({
    notifications: sampleNotifications,
    invalidate: mockInvalidate
  })),
  useOutsideClick: jest.fn(() =>
    // For simplicity, return a dummy ref object.
    // In tests we can manually trigger an outside click by calling the callback.
    ({ current: null })
  ),
  useReadNotification: jest.fn(() => ({
    mutate: mockMutate
  }))
}));

jest.mock('../../../hooks/useMessaging', () => jest.fn(() => false));

// Mock getHandler used by NotificationItem so that the title and content come from the notification
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
    // Reset mocks before each test
    mockInvalidate.mockClear();
    mockMutate.mockClear();
  });

  it('renders the notifications badge with correct unread count', () => {
    providersRender(<NotificationsMenu />);
    // Unread count should be 2 since there are two unread notifications
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('toggles the menu when the notifications icon button is clicked', () => {
    providersRender(<NotificationsMenu />);

    // Initially, the IconButton should be visible with the unread count
    const iconButton = screen.getByText('2');
    expect(iconButton).toBeInTheDocument();

    // Click to expand the menu
    fireEvent.click(iconButton);
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();

    // The close button should be visible in the expanded menu
    const closeButton = screen.getByRole('button', { name: '' });
    expect(closeButton).toBeInTheDocument();

    // Click close button to collapse the menu
    fireEvent.click(closeButton);
    // After collapse, the icon button should be visible again.
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });

  it('displays "No notifications" when notification list is empty', () => {
    // Override the useNotifications hook to return an empty array for notifications
    (hooks.useNotifications as jest.Mock).mockImplementation(() => ({
      notifications: [],
      invalidate: mockInvalidate
    }));

    providersRender(<NotificationsMenu />);
    // Expand the menu by clicking the notifications button
    const iconButton = screen.getByRole('button');
    fireEvent.click(iconButton);

    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
  });

  it('calls invalidate when new notifications are received (via useMessaging hook)', () => {
    // Override useMessaging to simulate new notifications being received
    (useMessaging as jest.Mock).mockReturnValue(true);

    render(<NotificationsMenu />);
    // The hook effect should call invalidate if new notifications have arrived.
    expect(mockInvalidate).toHaveBeenCalled();
  });
});
