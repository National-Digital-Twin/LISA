// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ReactElement } from 'react';
import { Box, Typography, Grid } from '@mui/material';

export const GridListItem = ({
  title,
  text = undefined,
  children = undefined
}: {
  title: string;
  text?: string;
  children?: ReactElement;
}) => (
  <Grid component="li" size={{ xs: 12, md: 6 }}>
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h3" fontSize="1rem" fontWeight="bold">
        {title}
      </Typography>
      {text && <Typography variant="body1">{text}</Typography>}
      {children}
    </Box>
  </Grid>
);
