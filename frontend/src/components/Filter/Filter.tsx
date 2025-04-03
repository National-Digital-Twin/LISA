import {
  Autocomplete,
  Box,
  Chip,
  TextField,
  Typography
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { type FieldOption } from 'common/Field';
import { type FieldValueType } from '../../utils/types';

type FilterFieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'multiselect' | 'chip-group';
  options?: FieldOption[];
};

type Props = {
  filters: FilterFieldConfig[];
  appliedFilters: Record<string, FieldValueType>;
  onChange: (id: string, value: FieldValueType) => void;
  isMobile: boolean;
};

const Filter = ({ filters, appliedFilters, onChange, isMobile }: Props) => (
  <>
    {filters.map(({ id, label, type, options = [] }) => {
      const currentValue = appliedFilters[id];

      if (type === 'text') {
        return (
          <TextField
            key={id}
            size={isMobile ? 'small' : 'medium'}
            fullWidth
            label={label}
            value={(currentValue as string) ?? ''}
            onChange={(e) => onChange(id, e.target.value)}
            variant="outlined"
            sx={{ maxWidth: isMobile ? 'none' : 200 }}
          />
        );
      }

      if (type === 'multiselect') {
        const selected = (currentValue as string[]) ?? [];
        const selectedOptions = selected
          .map((val) => options.find((opt) => opt.value === val))
          .filter(Boolean) as FieldOption[];

        return (
          <Autocomplete
            key={id}
            size={isMobile ? 'small' : 'medium'}
            multiple
            fullWidth
            options={options}
            value={selectedOptions}
            onChange={(_, selection) =>
              onChange(id, selection.map((s) => s.value))
            }
            renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField {...params} label={label} variant="outlined" />
            )}
            sx={{ maxWidth: isMobile ? 'none' : 200 }}
          />
        );
      }

      if (type === 'chip-group') {
        return (
          <Box
            key={id}
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            alignItems="center"
            gap={1}
            mt={1}
            sx={{ width: '100%' }}
          >
            {options.map((opt) => {
              const isActive = currentValue === opt.value;
      
              return (
                <Chip
                  key={opt.value}
                  icon={
                    isActive ? (
                      <CheckIcon
                        sx={{
                          fontSize: 18,
                          color: 'text.primary',
                          ml: '4px',
                        }}
                      />
                    ) : undefined
                  }
                  label={
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      {opt.label}
                    </Typography>
                  }
                  onClick={() => onChange(id, isActive ? '' : opt.value)}
                  size={isMobile ? 'small' : 'medium'}
                  variant="outlined"
                  sx={{
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.5,
                    fontWeight: 'bold',
                    backgroundColor: isActive ? 'primary.light' : 'transparent',
                    borderColor: isActive ? 'primary.main' : 'grey.400',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.light' : 'grey.100',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              );
            })}
          </Box>
        );
      }      

      return null;
    })}
  </>
);

export default Filter;
export type { FilterFieldConfig };
