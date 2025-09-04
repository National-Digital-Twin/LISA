import { ChangeEvent, useMemo } from 'react';
import { Box, MenuItem, TextField, useTheme } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Field } from 'common/Field';
import { LogEntry } from 'common/LogEntry';
import { FieldType } from 'common/FieldType';
import { OnFieldChange } from '../../utils/handlers';
import { FieldValueType, Linkable, OptionType, ValidationError } from '../../utils/types';
import { getFieldValue } from '../../utils/Form/getFieldValue';
import { Form as FormUtils } from '../../utils';
import { getError } from '../../utils/Form/getError';

type FormFieldProps = {
  field: Field;
  entry?: Partial<LogEntry>;
  entries?: Array<LogEntry>;
  error?: ValidationError;
  onChange: OnFieldChange;
};

type Props = {
  field: Field;
  entry?: Partial<LogEntry>;
  entries?: Array<LogEntry>;
  onChange: OnFieldChange;
  fields?: Array<Field>;
  errors: Array<ValidationError>;
};

const FormField = ({
  field,
  entry = undefined,
  entries = undefined,
  error = undefined,
  onChange
}: FormFieldProps) => {
  const theme = useTheme();

  const ARE_SELECTS: Array<FieldType> = ['Select', 'SelectLogEntry', 'YesNo'];

  const options: OptionType[] | null = useMemo(() => {
    const placeholderOption: OptionType = { label: 'Select', value: 'Select', disabled: true };

    if (field.type === 'SelectLogEntry' && entries) {
      return [placeholderOption, ...FormUtils.linkableEntries(field, entries as Array<Linkable>)];
    }
    return field.options ? [placeholderOption, ...field.options] : null;
  }, [field, entries]);

  const onTextChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = evt.target;
    onChange(field.id, value);
  };

  const onSelectionChange = (id: string, value: FieldValueType) => {
    onChange(id, value);
  };

  const isSelect = useMemo(() => ARE_SELECTS.includes(field.type), [field.type]);

  return (
    <Box display="flex">
      {field.type === 'Input' && (
        <TextField
          hiddenLabel
          fullWidth
          variant="filled"
          placeholder={field.label}
          id={field.id}
          value={getFieldValue(field, entry ?? {}) ?? field.value ?? ''}
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
          placeholder={field.label}
          value={getFieldValue(field, entry ?? {}) ?? field.value ?? ''}
          onChange={onTextChange}
          error={Boolean(error)}
          helperText={error?.error}
          rows={field.rows ?? 1}
        />
      )}
      {isSelect && options && (
        <TextField
          select
          variant="filled"
          fullWidth
          id={field.id}
          value={getFieldValue(field, entry ?? {}) ?? field.value ?? options[0].value}
          onChange={(event) => onSelectionChange(field.id, event.target.value)}
          error={Boolean(error)}
          helperText={error?.error ?? ''}
          slotProps={{
            select: {
              sx: {
                color: theme.palette.primary.main,
                '.MuiSelect-select': { paddingTop: '17px', paddingBottom: '16px' }
              },
              IconComponent: (props) => (
                <ArrowDropDownIcon
                  {...{
                    ...props,
                    sx: { '&.MuiSvgIcon-root': { color: theme.palette.primary.main } }
                  }}
                />
              )
            },
            inputLabel: { shrink: false, sx: { color: theme.palette.primary.main } }
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={`${option.value}-option`}
              value={option.value}
              disabled={option.disabled}
              sx={{ borderBottom: '1px solid #CAC4D0', paddingTop: '17px', paddingBottom: '16px' }}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Box>
  );
};

export const GenericFormField = ({
  field,
  fields = undefined,
  entry = undefined,
  entries = undefined,
  errors,
  onChange
}: Props) => {
  const dependentField = fields?.find((f) => f.id === field.dependentFieldId);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormField
        field={field}
        entry={entry}
        entries={entries}
        error={getError(field, errors)}
        onChange={onChange}
      />
      {dependentField && (
        <FormField
          field={dependentField}
          entry={entry}
          entries={entries}
          error={getError(dependentField, errors)}
          onChange={onChange}
        />
      )}
    </Box>
  );
};
