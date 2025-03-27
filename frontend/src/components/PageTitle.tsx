// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Incident } from 'common/Incident';
import Stage from './Stage';
import { Format } from '../utils';

type Props = PropsWithChildren & {
  title: string;
  subtitle?: string;
  stage?: Incident['stage'];
};

const PageTitle = ({ title, subtitle = undefined, stage = undefined, children }: Props) => (
  <Box
    className="page-title"
    style={{ alignItems: 'center' }}
    display="flex"
    flexDirection="row"
    flexWrap="wrap"
    alignItems="center"
    justifyContent="space-between"
    gap="1rem"
    width="100%"
  >
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography fontSize="1.5rem" variant="h1" className="title" fontWeight={400}>
        {title}
      </Typography>
      {subtitle && (
        <Typography fontSize="1.15rem" variant="h2" color="primary" fontWeight={400}>
          {subtitle}
        </Typography>
      )}

      {stage && (
        <Box>
          <Stage
            label={Format.incident.stage(stage).toUpperCase()}
            stage={stage}
            size="medium"
            width="auto"
          />
        </Box>
      )}
    </Box>

    {children && (
      <Box sx={{ width: { xs: '100%', sm: 'auto' } }} displayPrint="none">
        {children}
      </Box>
    )}
  </Box>
);

export default PageTitle;
