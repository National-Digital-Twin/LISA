// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BaseInlineSelector from '../BaseInlineSelector';

function renderBase({
  label = 'Label',
  value = 'A',
  options = ['A', 'B', 'C'] as const,
  disabled = false,
  onChange = jest.fn(),
} = {}) {
  render(
    <BaseInlineSelector<string>
      label={label}
      disabled={disabled}
      valueNode={<span>Current:{value}</span>}
      options={options}
      onChange={onChange}
      getOptionKey={(s) => s}
      isSelected={(s) => s === value}
      renderOption={(s) => ({ label: s })}
    />
  );
  return { onChange };
}

test('closed by default and ARIA reflects it', () => {
  renderBase();

  expect(screen.queryByRole('menu')).not.toBeInTheDocument();

  const trigger = screen.getByRole('button', { name: /label/i });
  expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  expect(trigger).not.toHaveAttribute('aria-controls');
  expect(trigger).not.toHaveAttribute('aria-expanded');
});

test('opens, wires aria-controls, renders options, highlights selected', async () => {
  const user = userEvent.setup();
  renderBase({ label: 'Label', value: 'B' });

  const trigger = screen.getByRole('button', { name: /label/i });
  await user.click(trigger);

  const menu = await screen.findByRole('menu');
  expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const controlsId = trigger.getAttribute('aria-controls');
  expect(controlsId).toBeTruthy();
  const presented = screen.getByRole('presentation', { hidden: true });
  expect(presented).toHaveAttribute('id', controlsId);
  expect(presented).toContainElement(menu);

  const items = within(menu).getAllByRole('menuitem');
  expect(items.map((li) => li.textContent)).toEqual(['A', 'B', 'C']);
  expect(within(menu).getByRole('menuitem', { name: 'B' })).toHaveClass('Mui-selected');
});

test('selecting an option calls onChange and closes', async () => {
  const user = userEvent.setup();
  const { onChange } = renderBase({ value: 'A' });

  const trigger = screen.getByRole('button', { name: /label/i });
  await user.click(trigger);

  const menu = await screen.findByRole('menu');
  await user.click(within(menu).getByRole('menuitem', { name: 'C' }));

  expect(onChange).toHaveBeenCalledWith('C');
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(trigger).not.toHaveAttribute('aria-expanded');
});

test('disabled prevents opening', async () => {
  const user = userEvent.setup({ pointerEventsCheck: 0 });
  renderBase({ disabled: true });

  const trigger = screen.getByRole('button', { name: /label/i });
  expect(trigger).toBeDisabled();

  await user.click(trigger);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});
