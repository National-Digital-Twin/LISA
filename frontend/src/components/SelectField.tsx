// Global imports
import { ReactNode, useEffect, useState } from 'react';
import Select, { ActionMeta, PropsValue } from 'react-select';

// Local imports
import { type FieldOption } from 'common/Field';
import { OnFieldBlur, OnFieldChange } from '../utils/handlers';
import { OptionType } from '../utils/types';
import Readonly from './Readonly';

type SelectionType = OptionType | Array<OptionType> | undefined;

function toStringArray(val?: PropsValue<OptionType | string>): Array<string> {
  if (typeof val === 'string') {
    return val.split(',');
  }
  if (Array.isArray(val)) {
    return val.map((v) => (typeof v === 'string' ? v : v.value));
  }
  if (val) {
    return [(val as OptionType).value];
  }
  return [];
}

function formatOptionLabel(option: FieldOption): ReactNode {
  return (
    <span className="option-label">
      {option.index && (
        <span className="option-label__index">
          {option.index}
          {option.subIndex ? <>&nbsp;</> : '.'}
        </span>
      )}
      {option.subIndex && (
        <span className="option-label__sub-index">
          {`${option.subIndex}.`}
        </span>
      )}
      <span className="option-label__label">{option.label}</span>
    </span>
  );
}

function getSelected(
  opts: Array<FieldOption>,
  val?: PropsValue<OptionType | string>
): SelectionType {
  const vals = toStringArray(val);
  return opts.reduce((selected: Array<OptionType>, option: FieldOption) => {
    if (vals.includes(option.value)) {
      selected.push(option);
    } else if (Array.isArray(option.options)) {
      const optsSelected = getSelected(option.options, vals) as Array<OptionType>;
      selected.push(...optsSelected);
    }
    return selected;
  }, []);
}

type SelectFieldProps = {
  id: string,
  options: Array<FieldOption>,
  value: string | Array<string> | undefined,
  placeholder?: string,
  readonly?: boolean,
  disabled?: boolean,
  multi?: boolean,
  onChange: OnFieldChange,
  onBlur?: OnFieldBlur
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
  onBlur = undefined
}: SelectFieldProps) => {
  const [selected, setSelected] = useState<SelectionType>(getSelected(options, value));

  useEffect(() => {
    setSelected(getSelected(options, value));
  }, [options, value]);

  if (readonly) {
    const selection = getSelected(options, value);
    if (Array.isArray(selection)) {
      const labels = selection.map((sel) => sel.label);
      return <Readonly>{labels.join(', ')}</Readonly>;
    }
    return <Readonly>{selection?.label}</Readonly>;
  }

  const onInternalChange = (
    val: PropsValue<OptionType | string>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ActionMeta<OptionType | string>
  ) => {
    let selection = getSelected(options, val);
    if (!multi && Array.isArray(selection)) {
      selection = selection.length > 0 ? selection[0] : undefined;
    }
    setSelected(selection ?? undefined);
    if (Array.isArray(selection)) {
      onChange(id, selection.map((sel) => sel.value));
    } else {
      onChange(id, selection?.value ?? '');
    }
  };
  const onInternalBlur = () => {
    if (typeof onBlur === 'function') {
      onBlur(id);
    }
  };

  return (
    <Select
      id={id}
      name={id}
      value={selected || ''}
      options={options}
      onChange={onInternalChange}
      onBlur={onInternalBlur}
      isDisabled={disabled}
      isMulti={multi}
      placeholder={placeholder}
      isClearable
      unstyled
      formatOptionLabel={(option) => formatOptionLabel(option as FieldOption)}
      className="react-select"
      classNamePrefix="react-select"
    />
  );
};

export default SelectField;
