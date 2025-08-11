import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SortAndFilter } from '../../SortFilter/SortAndFilter';
import { FilterTree, QueryState } from '../../SortFilter/filter-types';
import { makeGroup, makeOptions } from '../../SortFilter/schemas/schema-utils';

const sampleTree: FilterTree = {
  title: 'Filters',
  items: [
    makeGroup('sort', 'Sort by', 'single', makeOptions([
      { id: 'date_desc', label: 'Newest first' },
      { id: 'date_asc', label: 'Oldest first' },
    ])),
    makeGroup('author', 'Author', 'multi', makeOptions([
      { id: 'alice', label: 'Alice' },
      { id: 'bob', label: 'Bob' },
    ])),
    makeGroup('time', 'Time', 'single', makeOptions([
      { id: 'last30min', label: 'Last 30 minutes' },
      { id: 'custom', label: 'Custom date range' },
    ])),
  ],
};

const initialState: QueryState = {
  sort: { by: 'date_desc', direction: 'desc' },
  values: {}
};

describe('SortAndFilter component', () => {
  it('renders the drawer with list items', () => {
    render(
      <SortAndFilter
        open
        onClose={() => {}}
        onApply={() => {}}
        title="Filters"
        sort={[{ id: 'date_desc', label: 'Newest first' }]}
        initial={initialState}
        tree={sampleTree}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
  });

  it('navigates to "Author" group and toggles multi-select checkbox', async () => {
    const user = userEvent.setup();

    render(
      <SortAndFilter
        open
        onClose={() => {}}
        onApply={() => {}}
        title="Filters"
        sort={[{ id: 'date_desc', label: 'Newest first' }]}
        initial={initialState}
        tree={sampleTree}
      />
    );

    await user.click(screen.getByText('Author'));
    expect(screen.getByText('Alice')).toBeInTheDocument();

    const aliceCheckbox = screen.getByRole('checkbox', { name: /Alice/i });
    expect(aliceCheckbox).not.toBeChecked();

    await user.click(aliceCheckbox);
    expect(aliceCheckbox).toBeChecked();
  });

  it('calls onApply with updated query state', async () => {
    const user = userEvent.setup();
    const handleApply = jest.fn();

    render(
      <SortAndFilter
        open
        onClose={() => {}}
        onApply={handleApply}
        title="Filters"
        sort={[{ id: 'date_desc', label: 'Newest first' }]}
        initial={initialState}
        tree={sampleTree}
      />
    );

    await user.click(screen.getByText('Author'));
    await user.click(screen.getByRole('checkbox', { name: /Alice/i }));

    await user.click(screen.getByRole('button', { name: /Apply/i }));
    expect(handleApply).toHaveBeenCalledWith(
      expect.objectContaining({
        values: {
          author: ['alice']
        }
      })
    );
  });

  it('shows custom date fields when "custom" is selected', async () => {
    const user = userEvent.setup();
  
    render(
      <SortAndFilter
        open
        onClose={() => {}}
        onApply={() => {}}
        title="Filters"
        sort={[{ id: 'date_desc', label: 'Newest first' }]}
        initial={initialState}
        tree={sampleTree}
      />
    );
  
    await user.click(screen.getByText('Time'));
    await user.click(screen.getByText('Custom date range'));
    await user.click(screen.getByText('Between'));
  
    expect(await screen.findByLabelText('From')).toBeInTheDocument();
    expect(await screen.findByLabelText('To')).toBeInTheDocument();
  });
})