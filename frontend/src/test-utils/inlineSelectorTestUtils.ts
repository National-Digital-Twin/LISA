// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function openInlineMenu(triggerName: RegExp | string) {
  const user = userEvent.setup();
  const trigger = screen.getByRole('button', { name: triggerName });
  await user.click(trigger);
  const menu = await screen.findByRole('menu');
  return { user, trigger, menu };
}

export function getMenuItems(menu: HTMLElement) {
  return within(menu).getAllByRole('menuitem');
}
