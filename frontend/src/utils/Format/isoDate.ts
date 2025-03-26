// Global imports
import { format } from 'date-fns';

export function isoDate(dateStr: string): string {
  if (dateStr) {
    return format(dateStr, 'yyyy-MM-dd');
  }
  return '';
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
