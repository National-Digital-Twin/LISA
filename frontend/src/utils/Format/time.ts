// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Global imports
import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';

export function time(dateStr: string | undefined): string {
  if (dateStr) {
    return format(dateStr, 'HH:mm');
  }
  return '';
}

export function relativeTime(dateStr: string | undefined): string {
  if (!dateStr) {
    return '';
  }

  try {
    const date = parseISO(dateStr);

    if (isToday(date)) {
      return format(date, 'HH:mm');
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '';
  }
}
