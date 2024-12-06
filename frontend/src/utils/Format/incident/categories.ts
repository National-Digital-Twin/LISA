// Local imports
import { type FieldOption } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import { type LogEntryType } from 'common/LogEntryType';
import { deduplicate } from '../../deduplicate';
import { sortLabel } from '../../sortLabel';
import { entry } from '../entry';

function typeCount(entries: Array<LogEntry>, type: LogEntryType): number {
  return entries.filter((e) => e.type === type).length;
}

function adjustOption(entries: Array<LogEntry>, option: FieldOption): FieldOption {
  return {
    ...option,
    label: `${option.label} (${typeCount(entries, option.value as LogEntryType)})`
  };
}

export function categories(entries: Array<LogEntry> | undefined): Array<FieldOption> {
  if (!entries) {
    return [];
  }
  return sortLabel(
    deduplicate(
      entries.map((e) => ({ value: e.type, label: entry.type(e.type) }))
    ).map((opt) => adjustOption(entries, opt))
  );
}
