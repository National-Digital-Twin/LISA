// Local imports
import { type FieldOption, type Field } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import Format from '../Format';
import { Linkable } from '../types';

export function linkableEntries(field: Field, entries: Array<Linkable>): Array<FieldOption> {
  const allowed = field.linkableTypes;
  if (allowed) {
    return entries.filter((e) => allowed.includes(e.type)).map((e) => (
      { value: e.id, label: Format.mentionable.entry(e as LogEntry, true).label }
    ));
  }
  return [];
}
