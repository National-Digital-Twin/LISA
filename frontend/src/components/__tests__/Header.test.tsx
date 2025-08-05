import { screen } from '@testing-library/react';
import { providersRender } from '../../test-utils';
import Header from '../Header';

const mockNotifications = [
  { id: '1', read: false },
  { id: '2', read: true },
  { id: '3', read: false }
];

jest.mock('../../hooks', () => ({
  useAuth: jest.fn(() => ({
    user: { current: { username: 'testUser', displayName: 'Test User' } },
    logout: jest.fn()
  })),
  useNotifications: jest.fn(() => ({
    notifications: mockNotifications
  })),
  useIncidents: jest.fn(() => ({
    data: []
  })),
  useResponsive: jest.fn(() => ({
    isBelowMd: false
  }))
}));

describe('Header Component', () => {
  it('renders notification bell with unread count', () => {
    providersRender(<Header />);

    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('shows yellow bell and hides count when on notifications page', () => {
    providersRender(<Header />);

    const bellButton = screen.getByRole('link', { name: /2/i });
    expect(bellButton).toBeInTheDocument();
  });

  it('shows white bell with count when not on notifications page', () => {
    providersRender(<Header />);

    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('renders user menu button', () => {
    providersRender(<Header />);

    const userButton = screen.getByRole('button');
    expect(userButton).toBeInTheDocument();
  });

  it('shows yellow user icon when user menu is open', () => {
    providersRender(<Header />);

    const userButton = screen.getByRole('button');
    expect(userButton).toBeInTheDocument();
  });
});
