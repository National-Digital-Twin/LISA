// Local imports
import { type Field } from 'common/Field';
import { type FieldGroup } from 'common/FieldGroup';
import { type LogEntry } from 'common/LogEntry';
import bem from '../../../bem';
import { FieldItem } from './FieldItem';

const classes = bem('log-entry-fields');

interface Props {
  group: FieldGroup
  fields: Field[];
  entry: LogEntry;
}
export function GroupItem({ group, fields, entry }: Readonly<Props>) {
  const filteredFields = fields.filter((f) => group.fieldIds.includes(f.id));
  if (filteredFields.length === 0) {
    return null;
  }

  return (
    <div className={classes('group')}>
      {group.label && (
        <div className={classes('group-label')}>{group.label}</div>
      )}
      {filteredFields.map((field) => (
        <FieldItem key={field.id} field={field} entry={entry} />
      ))}
    </div>
  );
}
