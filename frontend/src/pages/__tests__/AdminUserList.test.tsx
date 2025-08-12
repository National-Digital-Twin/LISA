// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme';
import AdminUserList from '../AdminUserList';

let mockUsers: Array<{ displayName?: string; email?: string }> = [];

const mockNavigate = jest.fn();

jest.mock('../../components', () => ({
  __esModule: true,
  PageTitle: ({ title }: { title: string }) => <div>{title}</div>
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

jest.mock('../../hooks', () => ({
  useUsers: () => ({ users: mockUsers })
}));

jest.mock('../../components/SortFilter/schemas/user-schema', () => ({
  buildUserFilters: () => [],
  userSort: []
}));

jest.mock('../../components/SortFilter/filter-utils', () => ({
  countActive: (values: Record<string, unknown>) =>
    values && Object.values(values).some(v => String(v ?? '').trim() !== '') ? 1 : 0
}));

type SortDir = 'asc' | 'desc';
type Sort = { by: string; direction: SortDir };
type State = { values: Record<string, unknown>; sort: Sort };

jest.mock('../../components/SortFilter/SortAndFilter', () => ({
  SortAndFilter: ({
    onApply,
    initial
  }: {
    onApply: (next: State) => void;
    initial: State;
  }) => (
    <div data-testid="sort-filter">
      <button
        type="button"
        onClick={() =>
          onApply({
            ...initial,
            values: { search: 'acme' },
            sort: { by: 'displayName_desc', direction: 'desc' }
          })
        }
      >
        apply-search
      </button>
      <button
        type="button"
        onClick={() =>
          onApply({
            ...initial,
            values: {},
            sort: { by: 'displayName_asc', direction: 'asc' }
          })
        }
      >
        clear-filters
      </button>
    </div>
  )
}));

const renderPage = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AdminUserList />
      </MemoryRouter>
    </ThemeProvider>
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockUsers = [
    { displayName: 'Charlie', email: 'charlie@acme.com' },
    { displayName: 'Alice', email: 'alice@example.com' },
    { displayName: 'Bob', email: 'bob@sample.org' },
    { displayName: '', email: 'noname@example.com' },
    { displayName: '   ', email: 'space@example.com' },
    { email: 'missing@example.com' }
  ];
});

describe('AdminUserList', () => {
  it('renders users, excludes missing displayName, and sorts ascending by name', () => {
    renderPage();

    // only named users
    expect(screen.queryByText('noname@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('space@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('missing@example.com')).not.toBeInTheDocument();

    // names present
    const table = screen.getByRole('table');
    const links = within(table).getAllByRole('link');
    const names = links.map(a => a.textContent);
    expect(names).toEqual(['Alice', 'Bob', 'Charlie']); // ascending
  });

  it('filters by search and shows active count', () => {
    renderPage();

    // initial button has no count
    expect(screen.getByRole('button', { name: /^sort & filter$/i })).toBeInTheDocument();

    // apply search = "acme"
    fireEvent.click(screen.getByText('apply-search'));

    // now only Charlie (acme.com) remains
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(within(rows[1]).getByText('Charlie')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).toBeNull();
    expect(screen.queryByText('Bob')).toBeNull();

    // badge shows 1 active
    expect(screen.getByRole('button', { name: /sort & filter \(1\)/i })).toBeInTheDocument();

    // clear filters returns all
    fireEvent.click(screen.getByText('clear-filters'));
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('navigates to add user page', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /add new user/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/settings/users/new');
  });

  it('links each user name to their profile', () => {
    renderPage();
    const charlieLink = screen.getByRole('link', { name: 'Charlie' });
    const expected =
      `/settings/user-profile?user=${encodeURIComponent('charlie@acme.com')}`;
    expect(charlieLink).toHaveAttribute('href', expected);
  });
});
