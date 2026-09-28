// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type FieldOption } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import { type User } from 'common/User';
import { deduplicate } from '../../deduplicate';
import { sortLabel } from '../../sortLabel';
import { user } from '../user';

export function authors(
  current: User | undefined,
  entries: Array<LogEntry> | undefined
): Array<FieldOption> {
  if (!entries) {
    return [];
  }
  return sortLabel(
    deduplicate(
      entries.map((e) => {
        if (e.author) {
          const value = e.author.username;
          let label = user(e.author);
          if (value === current?.username) {
            label += ' (Me)';
          }
          return { value, label };
        }
        return undefined;
      }).filter((e) => !!e)
    )
  );
}
