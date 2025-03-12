// Local imports
import { type FieldOption } from 'common/Field';
import { Autocomplete, TextField } from '@mui/material';
import { type FieldValueType, type FilterType } from '../../utils/types';

type Props = {
  categories: Array<FieldOption>;
  authors: Array<FieldOption>;
  onChange: (id: keyof FilterType, value: FieldValueType) => void;
  isMobile: boolean;
};

const Filter = ({ categories, authors, onChange, isMobile }: Props) => {
  const internalOnChange = (id: string, value: { label: string; value: string }[]) => {
    const formattedValue: FieldValueType = value.map((item) => item.value);
    onChange(id as keyof FilterType, formattedValue);
  };

  return (
    <>
      <Autocomplete
        size={isMobile ? 'small' : 'medium'}
        multiple
        fullWidth={isMobile}
        options={authors}
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
        sx={{ minWidth: '15%', width: 'auto' }}
      />
      <Autocomplete
        size={isMobile ? 'small' : 'medium'}
        multiple
        fullWidth={isMobile}
        options={categories}
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
        sx={{ minWidth: '15%', width: 'auto' }}
      />
    </>
  );
};

export default Filter;
