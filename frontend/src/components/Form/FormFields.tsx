// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ElementType } from 'react';

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
  component?: ElementType;
  showValidationErrors: boolean;
};

export default function FormFields({
  fields,
  groups,
  entry,
  entries = undefined,
  validationErrors,
  onFieldChange,
  component = undefined,
  showValidationErrors
}: Props) {
  if (!fields || fields.length === 0) {
    return null;
  }

  if (groups && groups.length > 0) {
    return groups.map((group) => (
      <FormGroup
        component={component}
        key={group.id}
        group={group}
        fields={fields}
        entry={entry}
        entries={entries}
        validationErrors={validationErrors}
        onFieldChange={onFieldChange}
        showValidationErrors={showValidationErrors}
      />
    ));
  }

  return fields.map((field) => (
    <FormField
      component={component}
      key={field.id}
      field={{
        ...field,
        value: Form.getFieldValue(field, entry)
      }}
      entries={entries}
      error={showValidationErrors ? Form.getError(field, validationErrors) : undefined}
      onChange={onFieldChange}
      className={field.className}
    />
  ));
}
