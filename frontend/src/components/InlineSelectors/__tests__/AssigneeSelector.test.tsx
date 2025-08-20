// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { User } from 'common/User';
import AssigneeSelector from '../AssigneeSelector';
import { openInlineMenu } from '../../../test-utils/inlineSelectorTestUtils';

const USERS = [
  { username: 'john', displayName: 'John Example' },
  { username: 'bob', displayName: 'Bob Smith' },
  { username: 'amy', displayName: 'Amy Scenario' },
] satisfies User[];

describe('AssigneeSelector', () => {
  test('renders the trigger and current assignee', () => {
    const handleChange = jest.fn();
    render(<AssigneeSelector value={USERS[0]} availableValues={USERS} onChange={handleChange} />);

    expect(screen.getByRole('button', { name: /assigned to/i })).toBeInTheDocument();
    expect(screen.getByText('John Example')).toBeInTheDocument();
  });

  test('opens the menu and lists all available users with current one selected', async () => {
    const handleChange = jest.fn();
    render(<AssigneeSelector value={USERS[0]} availableValues={USERS} onChange={handleChange} />);

    const { trigger, menu } = await openInlineMenu(/assigned to/i);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const items = within(menu).getAllByRole('menuitem');
    expect(items).toHaveLength(USERS.length);
    USERS.forEach((u) => {
      expect(within(menu).getByText(u.displayName)).toBeInTheDocument();
    });

    const selected = within(menu).getByRole('menuitem', { name: USERS[0].displayName });
    expect(selected).toHaveClass('Mui-selected');
  });

  test('selecting a different assignee calls onChange with that user and closes the menu', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<AssigneeSelector value={USERS[0]} availableValues={USERS} onChange={handleChange} />);

    const { trigger, menu } = await openInlineMenu(/assigned to/i);
    const choice = within(menu).getByRole('menuitem', { name: USERS[1].displayName });
    await user.click(choice);

    expect(handleChange).toHaveBeenCalledWith(USERS[1]);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-expanded', 'true');
  });

  test('does not open when disabled', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const handleChange = jest.fn();
    render(<AssigneeSelector value={USERS[0]} availableValues={USERS} onChange={handleChange} disabled />);

    const trigger = screen.getByRole('button', { name: /assigned to/i });
    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-expanded');
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('opens with an empty menu when availableValues is empty', async () => {
    const handleChange = jest.fn();
    render(<AssigneeSelector value={USERS[0]} availableValues={[]} onChange={handleChange} />);

    const { menu } = await openInlineMenu(/assigned to/i);
    expect(within(menu).queryAllByRole('menuitem')).toHaveLength(0);
  });
});
