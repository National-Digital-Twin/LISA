// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme';
import MyProfile from '../MyProfile';
import * as hooks from '../../hooks';

jest.mock('../../hooks');

jest.mock('../../components', () => ({
  __esModule: true,
  PageTitle: ({ title }: { title: string }) => <div>{title}</div>
}));

const renderWithRoute = (route = '/settings/profile') =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>
        <MyProfile />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('MyProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows current user title and back link', () => {
    (hooks.useAuth as jest.Mock).mockReturnValue({
      user: { current: { displayName: 'Jane Doe', email: 'jane@acme.co.uk' } }
    });

    renderWithRoute();

    const backLink = screen.getByRole('link', { name: 'Jane Doe' });
    expect(backLink).toHaveAttribute('href', '/settings');
  });

  it('renders personal details with organisation and email', () => {
    (hooks.useAuth as jest.Mock).mockReturnValue({
      user: { current: { displayName: 'Jane Doe', email: 'jane@acme.co.uk' } }
    });

    renderWithRoute();

    expect(screen.getByText('Personal details')).toBeInTheDocument();
    expect(screen.getByText('acme.co.uk')).toBeInTheDocument();
    expect(screen.getByText('jane@acme.co.uk')).toBeInTheDocument();
  });

  it('renders a disabled Edit button and coming soon note', () => {
    (hooks.useAuth as jest.Mock).mockReturnValue({
      user: { current: { displayName: 'Jane Doe', email: 'jane@acme.co.uk' } }
    });

    renderWithRoute();

    const btn = screen.getByRole('button', { name: /edit details/i });
    expect(btn).toBeDisabled();
    expect(screen.getByText('(coming soon)')).toBeInTheDocument();
  });

  it('falls back to Unknown user and Not provided when current is missing', () => {
    (hooks.useAuth as jest.Mock).mockReturnValue({ user: { current: undefined } });

    renderWithRoute();

    expect(screen.getByRole('link', { name: /unknown user/i })).toHaveAttribute(
      'href',
      '/settings'
    );
    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });
});
