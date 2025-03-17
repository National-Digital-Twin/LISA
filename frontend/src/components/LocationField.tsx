import { Button, InputAdornment, TextField } from '@mui/material';
// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { LocationTypes } from 'common/Location';

type Props = {
  id: string;
  value: string | undefined;
  onClick: () => void;
};
export default function LocationField({ id, value, onClick }: Readonly<Props>) {
  return (
    <TextField
      data-testid="location-field"
      id={id}
      hiddenLabel
      fullWidth
      variant="filled"
      value={value === 'View location' ? LocationTypes.coordinates : value}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <Button type="button" onClick={onClick}>
                {value ? 'Change' : 'Set'}
              </Button>
            </InputAdornment>
          )
        }
      }}
    />
  );
}
