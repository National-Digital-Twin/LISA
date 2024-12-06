// Local imports
import { type LogEntry } from 'common/LogEntry';
import { getField } from './getField';

export function extractFields(entry: LogEntry, entryIdNode: unknown): Array<unknown> {
  const fields = [];
  entry.fields?.forEach((field) => {
    fields.push(...getField(field, entryIdNode));
  });
  return fields;
}
