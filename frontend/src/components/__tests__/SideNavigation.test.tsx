import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme';
import SideNavigation from '../SideNavigation';

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

  it('should render navigation items', () => {
    renderSideNavigation({ open: true, onClose: mockOnClose });

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Incidents')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Form Templates')).toBeInTheDocument();
  });

  it('should render logo', () => {
    renderSideNavigation({ open: true, onClose: mockOnClose });

    const logo = screen.getByAltText('Local Incident Services Application');
    expect(logo).toBeInTheDocument();
  });

  it('should handle navigation item clicks', () => {
    renderSideNavigation({ open: true, onClose: mockOnClose });

    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    fireEvent.click(homeLink);
    expect(mockHandleLink).toHaveBeenCalled();
  });
});
