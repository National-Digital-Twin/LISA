import { MenuItem, TextField, useTheme } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { OptionType } from '../../utils/types';

type Props = {
  options: OptionType[];
  value: string | undefined;
  onChange: (value: string) => void;
};

export const EntityTypeDropdown = ({ options, value, onChange }: Props) => {
  const theme = useTheme();

  return (
    <TextField
      select
      variant="filled"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        select: {
          sx: {
            color: theme.palette.primary.main,
            '.MuiSelect-select': { paddingTop: '17px', paddingBottom: '16px' }
          },
          IconComponent: (props) => (
            <ArrowDropDownIcon
              {...{ ...props, sx: { '&.MuiSvgIcon-root': { color: theme.palette.primary.main } } }}
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
          sx={{ paddingTop: '17px', paddingBottom: '16px', borderBottom: '1px solid #CAC4D0' }}
          disabled={option.disabled}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
