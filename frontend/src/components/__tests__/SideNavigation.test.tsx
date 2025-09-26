import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme';
import SideNavigation from '../SideNavigation';

let mockNavigationItems = [
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

jest.mock('../../assets/images/lisa_logo.svg', () => 'mocked-logo.svg');
jest.mock('../../assets/images/lisa_logo_mobile.svg', () => 'mocked-logo-mobile.svg');

const renderSideNavigation = (props: { open: boolean; onClose: () => void }) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <SideNavigation open={props.open} onClose={props.onClose} />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('SideNavigation', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsActive.mockReturnValue(false);
  });

  it('renders all items on desktop', () => {
    // desktop: include Form Templates
    mockNavigationItems = [
      { to: '/', label: 'Home' },
      { to: '/incidents', label: 'Incidents' },
      { to: '/tasks', label: 'Tasks' },
      { to: '/forms', label: 'Form Templates' }
    ];

    renderSideNavigation({ open: true, onClose: mockOnClose });

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Incidents')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Form Templates')).toBeInTheDocument();
  });

  it('hides Form Templates on mobile', () => {
    // mobile: exclude Form Templates
    mockNavigationItems = [
      { to: '/', label: 'Home' },
      { to: '/incidents', label: 'Incidents' },
      { to: '/tasks', label: 'Tasks' }
    ];

    renderSideNavigation({ open: true, onClose: mockOnClose });

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Incidents')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.queryByText('Form Templates')).toBeNull();
  });

  it('renders logo', () => {
    renderSideNavigation({ open: true, onClose: mockOnClose });
    expect(screen.getByAltText('Local Incident Services Application')).toBeInTheDocument();
  });

  it('handles item clicks', () => {
    renderSideNavigation({ open: true, onClose: mockOnClose });
    fireEvent.click(screen.getByText('Home'));
    expect(mockHandleLink).toHaveBeenCalled();
  });
});
