// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type FieldOption } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import { entry } from '../entry';
import { sortLabel } from '../../sortLabel';

export function categories(entries: Array<LogEntry> = []): Array<FieldOption> {
  const typeCounts: Record<string, number> = {};
  entries.forEach(e => {
    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
  });

  const uniqueTypes = Array.from(new Set(entries.map(e => e.type)));

  return sortLabel(
    uniqueTypes.map(type => ({
      value: type,
      label: entry.type(type)
    }))
  );
}
