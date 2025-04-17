// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import React from 'react';
import { Typography } from '@mui/material';
import { FieldProps } from '@rjsf/utils';

const CustomLabelField: React.FC<FieldProps> = ({ schema }) => (
  <Typography
    variant="body1"
    sx={{
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
    }}
  >
    {schema.title ?? '<Missing Label>'}
  </Typography>
);

export default CustomLabelField;
