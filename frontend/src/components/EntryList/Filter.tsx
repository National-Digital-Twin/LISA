// Local imports
import { type FieldOption } from 'common/Field';
import { Autocomplete, TextField } from '@mui/material';
import { type FieldValueType, type FilterType } from '../../utils/types';

type Props = {
  categories: Array<FieldOption>;
  authors: Array<FieldOption>;
  onChange: (id: keyof FilterType, value: FieldValueType) => void;
  isMobile: boolean;
  appliedFilters: FilterType;
};

const Filter = ({ categories, authors, onChange, isMobile, appliedFilters }: Props) => {
  const internalOnChange = (id: string, value: { label: string; value: string }[]) => {
    const formattedValue: FieldValueType = value.map((item) => item.value);
    onChange(id as keyof FilterType, formattedValue);
  };

  const handleSelected = (id: 'author' | 'category') => {
    const selected = appliedFilters[id];
    const options = id === 'author' ? authors : categories;

    const values = selected
      .map((x) => {
        const item = options.find(({ value }) => value === x);
        if (item) return item;
        return null;
      })
      .filter((item) => item);

    return values as FieldOption[];
  };

  return (
    <>
      <Autocomplete
        size={isMobile ? 'small' : 'medium'}
        multiple
        fullWidth
        options={authors}
        value={handleSelected('author')}
        onChange={(_, selection) => internalOnChange('author', selection)}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            label="Author"
            placeholder="Everyone"
            variant="outlined"
          />
        )}
        sx={{ maxWidth: isMobile ? 'none' : 200 }}
      />
      <Autocomplete
        size={isMobile ? 'small' : 'medium'}
        multiple
        fullWidth
        options={categories}
        value={handleSelected('category')}
        onChange={(_, selection) => internalOnChange('category', selection)}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            label="Category"
            placeholder="Everyone"
            variant="outlined"
          />
        )}
        sx={{ maxWidth: isMobile ? 'none' : 200 }}
      />
    </>
  );
};

export default Filter;
