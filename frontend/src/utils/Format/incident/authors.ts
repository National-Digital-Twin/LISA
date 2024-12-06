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
