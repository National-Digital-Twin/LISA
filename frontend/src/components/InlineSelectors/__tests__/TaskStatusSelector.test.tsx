// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import TaskStatusSelector from '../TaskStatusSelector';

jest.mock('../../Tasks/StatusMini', () => ({
  __esModule: true,
  default: ({ status }: { status: string }) => (
    <span data-testid="status-mini" data-status={status} />
  ),
}));

jest.mock('../../Tasks/utils/statusLabelMapper', () => ({
  __esModule: true,
  STATUS_LABELS: {
    ToDo: 'To-do',
    InProgress: 'In progress',
    Done: 'Done',
  },
  toStatusHumanReadable: (s: 'ToDo' | 'InProgress' | 'Done') =>
    ({ ToDo: 'To-do', InProgress: 'In progress', Done: 'Done' } as const)[s],
}));

describe('TaskStatusSelector', () => {
  test('renders the trigger and current value (dot + human text)', () => {
    const handleChange = jest.fn();
    render(<TaskStatusSelector value="ToDo" onChange={handleChange} />);

    expect(screen.getByRole('button', { name: /status/i })).toBeInTheDocument();

    expect(screen.getByText('To-do')).toBeInTheDocument();
    const dot = screen.getAllByTestId('status-mini')[0];
    expect(dot).toHaveAttribute('data-status', 'ToDo');
  });

  test('menu is closed by default and ARIA reflects that', () => {
    const handleChange = jest.fn();
    render(<TaskStatusSelector value="ToDo" onChange={handleChange} />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: /status/i });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(trigger).not.toHaveAttribute('aria-expanded');
  });

  test('opens the menu and lists only allowed transitions for ToDo (InProgress, Done)', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<TaskStatusSelector value="ToDo" onChange={handleChange} />);

    const trigger = screen.getByRole('button', { name: /status/i });
    await user.click(trigger);

    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const controlsId = trigger.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toHaveAttribute('id', controlsId);
    expect(container).toContainElement(menu);

    const items = within(menu).getAllByRole('menuitem');
    const labels = items.map((li) => li.textContent);
    expect(labels).toEqual(['In progress', 'Done']);

    const minis = within(menu).getAllByTestId('status-mini');
    expect(minis[0]).toHaveAttribute('data-status', 'InProgress');
    expect(minis[1]).toHaveAttribute('data-status', 'Done');

    items.forEach((li) => expect(li).not.toHaveClass('Mui-selected'));
  });

  test('selecting a next status calls onChange and closes the menu', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<TaskStatusSelector value="ToDo" onChange={handleChange} />);

    const trigger = screen.getByRole('button', { name: /status/i });
    await user.click(trigger);

    const menu = await screen.findByRole('menu');
    const choice = within(menu).getByRole('menuitem', { name: 'Done' });

    await user.click(choice);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('Done');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-expanded', 'true');
  });

  test('lists only "Done" when current value is InProgress', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<TaskStatusSelector value="InProgress" onChange={handleChange} />);

    const trigger = screen.getByRole('button', { name: /status/i });
    await user.click(trigger);

    const menu = await screen.findByRole('menu');
    const items = within(menu).getAllByRole('menuitem');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Done');

    const mini = within(items[0]).getByTestId('status-mini');
    expect(mini).toHaveAttribute('data-status', 'Done');
  });

  test('shows an empty menu when value is Done (no further transitions)', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<TaskStatusSelector value="Done" onChange={handleChange} />);

    const trigger = screen.getByRole('button', { name: /status/i });
    await user.click(trigger);

    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(within(menu).queryAllByRole('menuitem')).toHaveLength(0);
  });

  test('does not open when disabled', () => {
    const handleChange = jest.fn();
    render(<TaskStatusSelector value="ToDo" onChange={handleChange} disabled />);

    const trigger = screen.getByRole('button', { name: /status/i });
    expect(trigger).toBeDisabled();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-expanded');
    expect(handleChange).not.toHaveBeenCalled();
  });
});
