// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { format } from 'date-fns';

export function dateAndTimeMobile(dateStr: string): string {
  if (dateStr) {
    return `${format(dateStr, 'd MMM yyyy')} @ ${format(dateStr, 'HH:mm')}`;
  }
  return '';
}
