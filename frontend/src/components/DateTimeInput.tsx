// Global imports
import { ChangeEvent, MouseEvent, useState } from 'react';
import { Box, Button, FormControl, FormHelperText, TextField } from '@mui/material';
import { Format } from '../utils';
import { type ValidationError } from '../utils/types';

type Props = {
  id: string;
  value: string | undefined;
  error?: ValidationError;
  onChange: (value: string | undefined) => void;
};
const DateTimeInput = ({ id, value, error = undefined, onChange }: Props) => {
  const [date, setDate] = useState<string>(value ? Format.isoDate(value) : '');
  const [time, setTime] = useState<string>(value ? Format.time(value) : '');

  const dispatchOnChange = (d: string, t: string) => {
    if (d && t) {
      const parseDate = Date.parse(`${d}T${t}`);
      if (!Number.isNaN(parseDate)) {
        return onChange(new Date(`${d}T${t}`).toISOString());
      }
    }
    return onChange(undefined);
  };

  const onDateChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setDate(evt.target.value);
    dispatchOnChange(evt.target.value, time);
  };
  const onTimeChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTime(evt.target.value);
    dispatchOnChange(date, evt.target.value);
  };
  const onSetNow = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const now = new Date().toISOString();
    const d = Format.isoDate(now);
    const t = Format.time(now);
    setDate(d);
    setTime(t);
    dispatchOnChange(d, t);
  };

  return (
    <FormControl id={id}>
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          data-testid="date-input"
          hiddenLabel
          variant="filled"
          fullWidth
          type="date"
          value={date}
          onChange={onDateChange}
          error={Boolean(error)}
        />
        <TextField
          data-testid="time-input"
          hiddenLabel
          variant="filled"
          fullWidth
          type="time"
          value={time}
          onChange={onTimeChange}
          error={Boolean(error)}
        />
        <Button
          type="button"
          variant="text"
          disableRipple
          disableTouchRipple
          onClick={onSetNow}
          sx={{ fontWeight: 600, textTransform: 'none' }}
        >
          &lt; Now
        </Button>
      </Box>
      <FormHelperText error={Boolean(error)}>{error?.error}</FormHelperText>
    </FormControl>
  );
};

export default DateTimeInput;
