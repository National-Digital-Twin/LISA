// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { ElementType } from 'react';

// Local imports
import { type Field } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
import { type OnFieldChange } from '../../utils/handlers';
import { type ValidationError } from '../../utils/types';
import FormField from './FormField';
import { Form as FormUtils } from '../../utils';

type BaseProps = {
  component?: ElementType;
};

type MainFieldProps = BaseProps & {
  field: Field;
};

type DependentFieldProps = BaseProps & {
  field?: Field;
};

type Props = {
  mainFormField: MainFieldProps;
  dependentFormField?: DependentFieldProps;
  entry: Partial<LogEntry>;
  entries?: Array<Partial<LogEntry>>;
  onChange: OnFieldChange;
  errors: Array<ValidationError>;
};

export const FormFieldWithDependent = ({
  mainFormField,
  onChange,
  errors,
  entries = undefined,
  entry,
  dependentFormField = undefined
}: Props) => (
  <>
    <FormField
      component={mainFormField.component}
      field={mainFormField.field}
      onChange={onChange}
      entry={entry}
      entries={entries}
      error={FormUtils.getError(mainFormField.field, errors)}
      className={mainFormField.field.className}
    />
    {dependentFormField && dependentFormField.field && (
      <FormField
        component={dependentFormField.component}
        field={dependentFormField.field}
        onChange={onChange}
        entry={entry}
        entries={entries}
        error={FormUtils.getError(dependentFormField.field, errors)}
        className={dependentFormField.field?.className}
      />
    )}
  </>
);
