// Local imports
import { type Field } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import { LocationValue } from './LocationValue';
import { SelectionValue } from './SelectionValue';

function formatSingleValue(value: string, field: Field): string {
  if (Array.isArray(field.options) && field.options.length > 0) {
    return field.options.find((opt) => opt.value === value)?.label ?? value;
  }
  return value;
}

function formatValue(value: string | string[], field: Field): string {
  if (Array.isArray(value)) {
    const labels = value.map((val) => formatSingleValue(val, field));
    return labels.join(';\n');
  }
  return formatSingleValue(value, field);
}

interface Props {
  field: Field;
  entry: LogEntry;
  value: string | string[] | undefined;
}
export function FieldValue({ field, entry, value }: Props) {
  if (field.type === 'Location') {
    return <LocationValue entry={entry} />;
  }
  if (field.type === 'SelectLogEntry') {
    return <SelectionValue entry={entry} value={value} />;
  }
  return value ? formatValue(value, field) : null;
}
