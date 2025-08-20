// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box } from '@mui/material';
import { TaskStatus } from 'common/Task';

const StatusMini = ({ status }: Readonly<{ status: TaskStatus }>) => {
  let color: string;
  let borderColor: string;

  if (status === 'Done') {
    color = '#9DF5A8';
    borderColor = '#239932';
  } else if (status === 'InProgress') {
    color = '#F5CF9D';
    borderColor = '#FF6D24';
  } else {
    color = '#A5D3F5';
    borderColor = '#3C3DE9';
  }

  return (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: color,
        border: '1px solid',
        borderColor,
        flexShrink: 0
      }}
    />
  );
}

export default StatusMini;
