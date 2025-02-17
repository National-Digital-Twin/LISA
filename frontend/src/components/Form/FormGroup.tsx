// Global imports
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

// Local imports
import { type Field } from 'common/Field';
import { type FieldGroup } from 'common/FieldGroup';
import { type LogEntry } from 'common/LogEntry';
import { bem, Form, Icons } from '../../utils';
import { type OnFieldChange } from '../../utils/handlers';
import { type ValidationError } from '../../utils/types';
import FormField from './FormField';

type Props = {
  group: FieldGroup;
  fields: Array<Field>;
  entry: Partial<LogEntry>;
  entries?: Array<Partial<LogEntry>>;
  validationErrors: Array<ValidationError>;
  onFieldChange: OnFieldChange;
};

export default function FormGroup({
  group,
  fields,
  entry,
  entries = undefined,
  validationErrors,
  onFieldChange
}: Readonly<Props>) {
  const [open, setOpen] = useState<boolean>(group.defaultOpen ?? false);

  if (!Form.groupHasFields(group, fields)) {
    return null;
  }

  const onClickLabel = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    setOpen((prev) => !prev);
  };

  const classes = bem('form-group', open ? 'open' : '');
  if (group.label) {
    return (
      <li className={classes()}>
        <ul>
          <li className={classes('label')}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link to="#" onClick={onClickLabel}>
              <Icons.Chevron />
              {group.label}
            </Link>
          </li>
          {group.description && (
            <li className={classes('description', [], 'full-width')}>{group.description}</li>
          )}
          {fields
            .filter((f) => group.fieldIds.includes(f.id))
            .map((field) => (
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
            ))}
        </ul>
      </li>
    );
  }

  return fields
    .filter((f) => group.fieldIds.includes(f.id))
    .map((field) => (
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
