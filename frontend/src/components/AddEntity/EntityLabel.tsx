// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Typography } from '@mui/material';

type Props = {
  errored: boolean;
  required: boolean;
  value: string | undefined;
  label: string;
};

const getLabelColour = (errored: boolean, required: boolean, value: string | undefined) => {
  if (value) {
    if (errored) {
      return 'red';
    }
    return 'initial';
  }
  if (errored || required) {
    return 'red';
  }
  return 'grey';
};

export const EntityLabel = ({ errored, required, value, label }: Props) => (
  <Typography component="span" sx={{ color: getLabelColour(errored, required, value) }}>
    {label}
  </Typography>
);
