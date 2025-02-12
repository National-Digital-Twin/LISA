// Global imports
import { ChangeEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Local imports
import { type Field } from 'common/Field';
import { type FieldType } from 'common/FieldType';
import { type LogEntry } from 'common/LogEntry';
import { Form } from '../../utils';
import { type OnFieldChange } from '../../utils/handlers';
import { type FieldValueType, type Linkable, type ValidationError } from '../../utils/types';
import DateTimeInput from '../DateTimeInput';
import LabelField from '../LabelField';
import LocationField from '../LocationField';
import SelectField from '../SelectField';
import FormHelpButton from './FormHelpButton';

type Props = {
  field: Field;
  entries?: Array<Partial<LogEntry>>;
  error?: ValidationError;
  onChange: OnFieldChange;
  className?: string;
};

const YesNoOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
];

const ARE_SELECTS: Array<FieldType> = ['Select', 'SelectMulti', 'SelectLogEntry', 'YesNo'];

const FormField = ({
  field,
  entries = undefined,
  error = undefined,
  onChange,
  className = undefined
}: Props) => {
  const navigate = useNavigate();
  const onClickLocation = () => {
    navigate('#location');
  };

  const onTextChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = evt.target.value ? evt.target.value : undefined;
    onChange(field.id, value as FieldValueType);
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
    <li className={`${className ?? ''} field-type--${field.type} ${error ? 'in-error' : ''}`}>
      <label htmlFor={field.id}>
        {field.label}
        {field.optional && <span className="optional-field">optional</span>}
        <FormHelpButton field={field} />
        {field.className?.includes('horizontalYN') && (
          <span data-testid="horizontal-span" className="h-sep" />
        )}
        {field.type === 'Input' && (
          <input type="text" id={field.id} value={field.value} onChange={onTextChange} />
        )}
        {field.type === 'TextArea' && (
          <textarea id={field.id} value={field.value} onChange={onTextChange} />
        )}
        {isSelect && (
          <SelectField
            id={field.id}
            options={options ?? []}
            multi={field.type === 'SelectMulti'}
            value={field.value}
            onChange={onSelectionChange}
          />
        )}
        {field.type === 'DateTime' && (
          <DateTimeInput id={field.id} value={field.value as string} onChange={onDateTimeChange} />
        )}
        {field.type === 'Location' && (
          <LocationField id={field.id} value={field.value as string} onClick={onClickLocation} />
        )}
        {field.type === 'Label' && <LabelField id={field.id} hint={field.hint} />}
      </label>
      {error && <div className="field-error">{error.error}</div>}
    </li>
  );
};

export default FormField;
