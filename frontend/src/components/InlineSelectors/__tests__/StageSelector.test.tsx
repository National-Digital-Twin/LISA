// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.


import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import StageSelectListItem from '../StageSelector';
import { openInlineMenu } from '../../../test-utils/inlineSelectorTestUtils';

jest.mock('../../Stage/StageMini', () => ({
  __esModule: true,
  default: ({ stage }: { stage: string }) => (
    <span data-testid="stage-mini" data-stage={stage} />
  ),
}));

jest.mock('../../../utils/Format', () => ({
  __esModule: true,
  default: {
    incident: {
      stage: (s: string) => `Stage:${s}`,
    },
  },
}));

const STAGES = ['Monitoring', 'Response', 'Recovery', 'Closed'] as const;

describe('StageSelector', () => {
  test('renders the title trigger and current value (dot + text)', () => {
    const handleChange = jest.fn();
    render(<StageSelectListItem value="Monitoring" onChange={handleChange} />);

    expect(screen.getByRole('button', { name: /stage/i })).toBeInTheDocument();
    expect(screen.getByText('Stage:Monitoring')).toBeInTheDocument();

    const dot = screen.getAllByTestId('stage-mini')[0];
    expect(dot).toHaveAttribute('data-stage', 'Monitoring');
  });

  test('opens the menu on click and lists all stages', async () => {
    const handleChange = jest.fn();
    render(<StageSelectListItem value="Monitoring" onChange={handleChange} />);

    const { trigger, menu } = await openInlineMenu(/stage/i);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const items = within(menu).getAllByRole('menuitem');
    expect(items).toHaveLength(STAGES.length);
    STAGES.forEach((s) => {
      expect(within(menu).getByText(`Stage:${s}`)).toBeInTheDocument();
    });

    const selected = within(menu).getByRole('menuitem', { name: /Stage:Monitoring/i });
    expect(selected).toHaveClass('Mui-selected');
  });

  test('selecting a different stage calls onChange and closes the menu', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<StageSelectListItem value="Monitoring" onChange={handleChange} />);

    const { trigger, menu } = await openInlineMenu(/stage/i);
    const choice = within(menu).getByRole('menuitem', { name: /Stage:Response/i });
    await user.click(choice);

    expect(handleChange).toHaveBeenCalledWith('Response');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-expanded', 'true');
  });

  test('does not open when disabled', async () => {
    const handleChange = jest.fn();
    render(<StageSelectListItem value="Monitoring" onChange={handleChange} disabled />);

    const trigger = screen.getByRole('button', { name: /stage/i });
    expect(trigger).toBeDisabled();

    const user = userEvent.setup({ pointerEventsCheck: 0 });
    await user.click(trigger);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });
});
