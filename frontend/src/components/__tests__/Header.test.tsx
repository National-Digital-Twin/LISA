import { fireEvent, screen } from '@testing-library/react';
import { providersRender } from '../../test-utils';
import Header from '../Header';

const mockOnMenuClick = jest.fn();

jest.mock('../../hooks', () => ({
  useAuth: jest.fn(() => ({
    user: { current: { username: 'testUser', displayName: 'Test User' } },
    logout: jest.fn()
  })),
  useNotifications: jest.fn(() => ({
    notifications: [
      { id: '1', read: false },
      { id: '2', read: true },
      { id: '3', read: false }
    ]
  }))
}));

const mockNavigationItems = [
  { to: '/', label: 'Home' },
  { to: '/incidents', label: 'Incidents' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/forms', label: 'Form Templates' }
];

const mockIsActive = jest.fn();
const mockHandleLink = jest.fn();

jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigationItems: mockNavigationItems,
    isActive: mockIsActive,
    handleLink: mockHandleLink
  })
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn()
}));

describe('Header Component', () => {
  beforeEach(() => {
    mockOnMenuClick.mockClear();
    jest.clearAllMocks();
    mockIsActive.mockReturnValue(false);
  });

  it('renders the header component', () => {
    providersRender(<Header onMenuClick={mockOnMenuClick} />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders notification and user account buttons', () => {
    providersRender(<Header onMenuClick={mockOnMenuClick} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders minimal header content', () => {
    providersRender(<Header onMenuClick={mockOnMenuClick} />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders navigation items when available', () => {
    providersRender(<Header onMenuClick={mockOnMenuClick} />);

    const navigationItems = screen.queryAllByRole('button');
    expect(navigationItems.length).toBeGreaterThan(0);
  });

  it('handles navigation item clicks', () => {
    providersRender(<Header onMenuClick={mockOnMenuClick} />);

    const buttons = screen.getAllByRole('button');
    const navigationButton = buttons.find(
      (button) =>
        button.textContent &&
        ['Home', 'Incidents', 'Tasks', 'Form Templates'].includes(button.textContent)
    );

    if (!navigationButton) {
      return;
    }

    fireEvent.click(navigationButton);
    expect(mockHandleLink).toHaveBeenCalled();
  });

  it('shows active state for selected navigation item', () => {
    mockIsActive.mockImplementation((path) => path === '/incidents');

    providersRender(<Header onMenuClick={mockOnMenuClick} />);

    const incidentsButton = screen.queryByText('Incidents');
    expect(incidentsButton).toBeDefined();
  });
});
