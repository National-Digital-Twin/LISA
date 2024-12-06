// Local imports
import { type Field } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import bem from '../../../bem';
import { FieldValue } from './FieldValue';

const classes = bem('log-entry-fields');

interface Props {
  field: Field;
  entry: LogEntry;
}
export function FieldItem({ field, entry }: Props) {
  if (field.type === 'Label') {
    return null;
  }

  const value = entry.fields?.find((ef) => ef.id === field.id)?.value;
  if (!value && field.type !== 'Location' && field.type !== 'SelectLogEntry') {
    return null;
  }

  const fieldClasses = field.className?.split(' ') ?? [];
  return (
    <>
      <div className={classes('label', fieldClasses)}>{field.label}</div>
      <div className={classes('value')}>
        <FieldValue field={field} entry={entry} value={value} />
      </div>
    </>
  );
}
