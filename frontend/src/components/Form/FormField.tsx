// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { ChangeEvent, ElementType, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Local imports
import { type Field } from 'common/Field';
import { type FieldType } from 'common/FieldType';
import { type LogEntry } from 'common/LogEntry';
import { Box, InputLabel, TextField, Typography } from '@mui/material';
import { Form } from '../../utils';
import { type OnFieldChange } from '../../utils/handlers';
import { type FieldValueType, type Linkable, type ValidationError } from '../../utils/types';
import DateTimeInput from '../DateTimeInput';
import LabelField from '../LabelField';
import LocationField from '../LocationField';
import SelectField from '../SelectField';
import FormHelpButton from './FormHelpButton';
import { getFieldValue } from '../../utils/Form/getFieldValue';

type Props = {
  field: Field;
  entry?: Partial<LogEntry>;
  entries?: Array<Partial<LogEntry>>;
  error?: ValidationError;
  onChange: OnFieldChange;
  className?: string;
  component?: ElementType;
};

const YesNoOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
];

const ARE_SELECTS: Array<FieldType> = ['Select', 'SelectMulti', 'SelectLogEntry', 'YesNo'];

const FormField = ({
  field,
  entry = undefined,
  entries = undefined,
  error = undefined,
  onChange,
  className = undefined,
  component = undefined
}: Props) => {
  const navigate = useNavigate();
  const onClickLocation = () => {
    navigate('#location');
  };

  const onTextChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = evt.target;
    onChange(field.id, value);
  };
  const onSelectionChange = (id: string, value: FieldValueType) => {
    onChange(id, value);
  };
  const onDateTimeChange = (value: string | undefined) => {
    onChange(field.id, value);
  };
  const options = useMemo(() => {
    if (field.type === 'YesNo') {
      return YesNoOptions;
    }
    if (field.type === 'SelectLogEntry' && entries) {
      return Form.linkableEntries(field, entries as Array<Linkable>);
    }
    return field.options;
  }, [field, entries]);

  const isSelect = useMemo(() => ARE_SELECTS.includes(field.type), [field.type]);

  return (
    <Box
      component={component ?? 'div'}
      className={`${className ?? ''}`}
      display="flex"
      flexDirection="column"
      gap={1}
    >
      <InputLabel
        htmlFor={field.id}
        sx={{ color: 'text.primary', fontWeight: 'bold', whiteSpace: 'normal' }}
      >
        {field.label}{' '}
        {field.optional && (
          <Typography component="span" className="optional-field">
            (optional)
          </Typography>
        )}
      </InputLabel>
      <FormHelpButton field={field} />
      {field.className?.includes('horizontalYN') && (
        <span data-testid="horizontal-span" className="h-sep" />
      )}
      {field.type === 'Input' && (
        <TextField
          hiddenLabel
          fullWidth
          variant="filled"
          id={field.id}
          value={getFieldValue(field, entry ?? {}) ?? field.value}
          onChange={onTextChange}
          error={Boolean(error)}
          helperText={error?.error}
        />
      )}
      {field.type === 'TextArea' && (
        <TextField
          hiddenLabel
          fullWidth
          variant="filled"
          multiline
          id={field.id}
          value={getFieldValue(field, entry ?? {}) ?? field.value}
          onChange={onTextChange}
          error={Boolean(error)}
          helperText={error?.error}
          rows={field.rows ?? 1}
        />
      )}
      {isSelect && (
        <SelectField
          id={field.id}
          options={options ?? []}
          multi={field.type === 'SelectMulti'}
          value={getFieldValue(field, entry ?? {}) ?? field.value}
          placeholder="Select"
          onChange={onSelectionChange}
          error={error}
        />
      )}
      {field.type === 'DateTime' && (
        <DateTimeInput
          id={field.id}
          value={field.value as string}
          onChange={onDateTimeChange}
          error={error}
        />
      )}
      {field.type === 'Location' && (
        <LocationField
          id={field.id}
          value={field.value as string}
          onClick={onClickLocation}
          error={error}
        />
      )}
      {field.type === 'Label' && <LabelField id={field.id} hint={field.hint} />}
    </Box>
  );
};

export default FormField;
