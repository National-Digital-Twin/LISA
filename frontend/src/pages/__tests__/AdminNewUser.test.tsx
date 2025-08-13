// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme';
import AdminNewUser from '../AdminNewUser';

jest.mock('../../components', () => ({
  __esModule: true,
  PageTitle: ({ title }: { title: string }) => <div>{title}</div>
}));

const renderPage = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AdminNewUser />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('AdminNewUser', () => {
  it('renders title and back link', () => {
    renderPage();
    const title = screen.getByText(/invite new user \(coming soon\)/i);
    expect(title).toBeInTheDocument();

    const backLink = screen.getByRole('link', { name: /invite new user/i });
    expect(backLink).toHaveAttribute('href', '/settings/users');
  });

  it('renders email field with label and placeholder', () => {
    renderPage();
    const input = screen.getByRole('textbox', { name: /email address/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Email address');
  });

  it('renders a disabled send button', () => {
    renderPage();
    const btn = screen.getByRole('button', { name: /send invite/i });
    expect(btn).toBeDisabled();
  });
});
