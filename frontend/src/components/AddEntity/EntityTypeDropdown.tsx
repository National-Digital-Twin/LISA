import { MenuItem, TextField, useTheme } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { OptionType } from '../../utils/types';

type Props = {
  options: OptionType[];
  value: string | undefined;
  onChange: (value: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DropdownIconComponent = (iconProps: any, color: string) => (
  <ArrowDropDownIcon {...{ ...iconProps, sx: { '&.MuiSvgIcon-root': { color } } }} />
);

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
          IconComponent: (props) => DropdownIconComponent(props, theme.palette.primary.main)
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
