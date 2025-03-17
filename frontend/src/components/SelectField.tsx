// Global imports
import { useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

// Local imports
import { type FieldOption } from 'common/Field';
import { OnFieldChange } from '../utils/handlers';
import { OptionType, ValidationError } from '../utils/types';

type SelectFieldProps = {
  id: string;
  options: Array<FieldOption>;
  value: string | Array<string> | undefined;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  multi?: boolean;
  onChange: OnFieldChange;
  error?: ValidationError;
};

interface FlatOptionType extends FieldOption {
  group?: string;
}

const formatOptions = (options: Array<FieldOption>) => {
  const flatOptions: Array<FlatOptionType> = [];
  options.forEach((item) => {
    if (item.options && Array.isArray(item.options)) {
      item.options.forEach((subOption) => {
        flatOptions.push({ ...subOption, group: item.label });
      });
    } else {
      flatOptions.push(item);
    }
  });
  return flatOptions;
};

type SelectionType = OptionType | Array<OptionType> | null;

const getDefaultSelection = (
  value: string | Array<string> | undefined,
  options: Array<FieldOption>,
  multi: boolean
) => {
  if (Array.isArray(value) && !value.length) return [];
  if (Array.isArray(value) && value.length > 0) {
    return options.filter((option) => value.includes(option.value));
  }
  if (!value && multi) return [];
  return options.find((option) => option.value === value);
};

const SelectField = ({
  id,
  value,
  placeholder = undefined,
  options,
  readonly = false,
  disabled = false,
  multi = false,
  onChange,
  error = undefined
}: SelectFieldProps) => {
  const flatOptions = useMemo(() => formatOptions(options), [options]);
  const [selected, setSelected] = useState<SelectionType>(
    getDefaultSelection(value, flatOptions, multi) ?? null
  );

  const handleOnChange = (selection: FlatOptionType | SelectionType | null) => {
    if (selection) {
      if (Array.isArray(selection)) {
        setSelected(selection);
        onChange(
          id,
          selection.map((item) => item.value)
        );
      } else {
        setSelected(selection);
        onChange(id, selection.value);
      }
    }
  };

  return (
    <Autocomplete
      multiple={multi}
      options={flatOptions}
      value={selected}
      readOnly={readonly}
      groupBy={(option: FlatOptionType) => option.group || ''}
      getOptionLabel={(option) => option.label}
      onChange={(_, selection) => handleOnChange(selection)}
      renderOption={(props, option) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <li {...props} key={`${option.value}-${option.index}`}>
          {option.index && (
            <span style={{ marginRight: '1rem' }}>
              {option.index}
              {option.subIndex ? `${option.subIndex}.` : '.'}
            </span>
          )}

          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          error={Boolean(error)}
          helperText={error?.error}
          placeholder={placeholder}
          hiddenLabel
          variant="filled"
        />
      )}
      disabled={disabled}
    />
  );
};

export default SelectField;
