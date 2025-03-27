// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Button, InputAdornment, TextField } from '@mui/material';
// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { LocationTypes } from 'common/Location';
import { ValidationError } from '../utils/types';

type Props = {
  id: string;
  value: string | undefined;
  onClick: () => void;
  error?: ValidationError;
};
export default function LocationField({ id, value, onClick, error }: Readonly<Props>) {
  return (
    <TextField
      data-testid="location-field"
      id={id}
      hiddenLabel
      fullWidth
      variant="filled"
      value={value === 'View location' ? LocationTypes.coordinates : value}
      error={Boolean(error)}
      helperText={error?.error}
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
