// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ReactElement, ReactNode } from 'react';
import { Box, Typography, Grid2 as Grid } from '@mui/material';

export const GridListItem = ({
  title,
  text = undefined,
  children = undefined,
  titleEnd = undefined,
}: {
  title: string;
  text?: string;
  children?: ReactElement;
  titleEnd?: ReactNode; 
}) => (
  <Grid component="li" size={{ xs: 12, md: 6 }}>
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" alignItems="center" gap={0.5}>
        <Typography variant="h3" fontSize="1rem" fontWeight="bold">
          {title}
        </Typography>
        {titleEnd && <Box>{titleEnd}</Box>}
      </Box>
      {text && <Typography variant="body1">{text}</Typography>}
      {children}
    </Box>
  </Grid>
);
