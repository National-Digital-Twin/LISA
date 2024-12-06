// Local imports
import { type Field } from 'common/Field';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LocationTypes } from 'common/Location';
import { type LogEntry } from 'common/LogEntry';
import Format, { VIEW_LOCATION } from '../Format';

type ValueType = string | string[] | undefined;
export function getFieldValue(field: Field, entry: Partial<LogEntry>): ValueType {
  if (field.type === 'Location') {
    const href = Format.entry.locationLink(entry);
    const text = Format.entry.location(entry);
    if (href) {
      return text === VIEW_LOCATION ? LocationTypes.coordinates : text;
    }
    return text === VIEW_LOCATION ? '' : text;
  }
  return entry.fields?.find((f) => f.id === field.id)?.value;
}
