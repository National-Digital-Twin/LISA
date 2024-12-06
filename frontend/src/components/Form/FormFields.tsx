// Local imports
import { type Field } from 'common/Field';
import { type FieldGroup } from 'common/FieldGroup';
import { type LogEntry } from 'common/LogEntry';
import { Form } from '../../utils';
import { type OnFieldChange } from '../../utils/handlers';
import FormField from './FormField';
import FormGroup from './FormGroup';
import { ValidationError } from '../../utils/types';

type Props = {
  fields: Array<Field> | undefined;
  groups: Array<FieldGroup> | undefined;
  entry: Partial<LogEntry>;
  entries?: Array<Partial<LogEntry>>;
  validationErrors: Array<ValidationError>;
  onFieldChange: OnFieldChange;
};

export default function FormFields({
  fields,
  groups,
  entry,
  entries = undefined,
  validationErrors,
  onFieldChange
}: Props) {
  if (!fields || fields.length === 0) {
    return null;
  }

  if (groups && groups.length > 0) {
    return groups.map((group) => (
      <FormGroup
        key={group.id}
        group={group}
        fields={fields}
        entry={entry}
        entries={entries}
        validationErrors={validationErrors}
        onFieldChange={onFieldChange}
      />
    ));
  }

  return fields.map((field) => (
    <FormField
      key={field.id}
      field={{
        ...field,
        value: Form.getFieldValue(field, entry)
      }}
      entries={entries}
      error={Form.getError(field, validationErrors)}
      onChange={onFieldChange}
      className={field.className}
    />
  ));
}
