// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme';
import AdminViewUser from '../AdminViewUser';
import * as hooks from '../../hooks';

jest.mock('../../hooks');

jest.mock('../../components', () => ({
  __esModule: true,
  PageTitle: ({ title }: { title: string }) => <div>{title}</div>
}));

const renderWithRoute = (route: string) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>
        <AdminViewUser />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('AdminViewUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hooks.useUsers as jest.Mock).mockReturnValue({
      users: [
        { displayName: 'Alice', email: 'alice@example.com' },
        { displayName: 'Bob', email: 'bob@sample.org' }
      ]
    });
  });

  it('shows selected user details from the query string', () => {
    renderWithRoute('/settings/user-profile?user=alice@example.com');

    // title comes from the selected user
    const backLink = screen.getByRole('link', { name: 'Alice' });
    expect(backLink).toHaveAttribute('href', '/settings/users');

    // details
    expect(screen.getByText('Personal details')).toBeInTheDocument();
    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('shows "Unknown user" when the email does not match', () => {
    renderWithRoute('/settings/user-profile?user=unknown@example.com');

    expect(screen.getByRole('link', { name: /unknown user/i })).toHaveAttribute(
      'href',
      '/settings/users'
    );
    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });

  it('shows "Unknown user" when no user param is present', () => {
    renderWithRoute('/settings/user-profile');

    expect(screen.getByRole('link', { name: /unknown user/i })).toBeInTheDocument();
    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });

  it('renders a disabled Edit button and the coming soon note', () => {
    renderWithRoute('/settings/user-profile?user=alice@example.com');

    const btn = screen.getByRole('button', { name: /edit details/i });
    expect(btn).toBeDisabled();
    expect(screen.getByText('(coming soon)')).toBeInTheDocument();
  });
});
