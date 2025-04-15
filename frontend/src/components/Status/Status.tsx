// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Chip } from '@mui/material';
import { type TaskStatus } from 'common/Task';

const Status = ({
  status,
  size = 'medium',
  width = 120
}: {
  status: TaskStatus;
  size?: 'small' | 'medium';
  width?: string | number;
}) => {
  const color = status.toLowerCase();
  let label = status.toUpperCase();

  if (label === 'INPROGRESS') {
    label = 'IN PROGRESS';
  } else if (label === 'TODO') {
    label = 'TO DO';
  }


  return (
    <Chip
      label={label}
      size={size}
      sx={{
        width,
        border: 1,
        borderColor: `status.${color}.primary`,
        backgroundColor: `status.${color}.secondary`
      }}
      variant="filled"
    />
  );
};

export default Status;
