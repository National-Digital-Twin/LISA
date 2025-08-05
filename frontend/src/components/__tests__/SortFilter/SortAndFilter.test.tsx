import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SortAndFilter } from '../../SortFilter/SortAndFilter';
import { FilterTree, QueryState } from '../../SortFilter/filter-types';

const sampleTree: FilterTree = {
  title: 'Filters',
  items: [
    {
      id: 'sort',
      type: 'group',
      label: 'Sort by',
      selection: 'single',
      children: [
        { id: 'date_desc', type: 'option', label: 'Newest first' },
        { id: 'date_asc', type: 'option', label: 'Oldest first' },
      ]
    },
    {
      id: 'author',
      type: 'group',
      label: 'Author',
      selection: 'multi',
      children: [
        { id: 'alice', type: 'option', label: 'Alice' },
        { id: 'bob', type: 'option', label: 'Bob' },
      ]
    },
    {
      id: 'time',
      type: 'group',
      label: 'Time',
      selection: 'single',
      children: [
        { id: 'last30min', type: 'option', label: 'Last 30 minutes' },
        { id: 'custom', type: 'option', label: 'Custom date range' },
      ]
    },
  ]
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
        onClear={() => {}}
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
        onClear={() => {}}
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
        onClear={() => {}}
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
        onClear={() => {}}
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