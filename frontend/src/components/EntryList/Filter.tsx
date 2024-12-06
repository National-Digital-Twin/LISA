// Local imports
import { type FieldOption } from 'common/Field';
import { type FieldValueType, type FilterType } from '../../utils/types';
import SelectField from '../SelectField';

type Props = {
  applied: FilterType;
  totalCount: number;
  categories: Array<FieldOption>;
  authors: Array<FieldOption>;
  onChange: (id: keyof FilterType, value: FieldValueType) => void;
};

const Filter = ({ applied, totalCount, categories, authors, onChange }: Props) => {
  const internalOnChange = (id: string, value: FieldValueType) => {
    onChange(id as keyof FilterType, value);
  };

  return (
    <div className="section log-form log-filter">
      <label htmlFor="author">
        Author
        <SelectField
          id="author"
          options={authors}
          multi
          placeholder="Everyone"
          value={applied.author}
          onChange={internalOnChange}
        />
      </label>
      <label htmlFor="category">
        Category
        <SelectField
          id="category"
          options={categories}
          multi
          placeholder={`Any (${totalCount})`}
          value={applied.category}
          onChange={internalOnChange}
        />
      </label>
    </div>
  );
};

export default Filter;
