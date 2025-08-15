// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
 
import { Incident } from 'common/Incident';
import Stage from './Stage';
import { Format } from '../utils';

type Props = PropsWithChildren & {
  title: string;
  subtitle?: string;
  subtitleComponent?: ReactNode;
  stage?: Incident['stage'];
  titleStart?: ReactNode;
  titleEnd?: ReactNode;
  childrenBelowOnDesktop?: boolean;
};

const PageTitle = ({
  title,
  subtitle = undefined,
  subtitleComponent = undefined,
  stage = undefined,
  children,
  titleStart = undefined,
  titleEnd = undefined,
  childrenBelowOnDesktop = true
}: Props) => (
  <Box
    className="page-title"
    style={{ alignItems: 'center' }}
    display="flex"
    flexDirection="row"
    flexWrap="wrap"
    alignItems="center"
    justifyContent="space-between"
    columnGap="1rem"
    rowGap="0.5rem"
    width="100%"
  >
    <Box display="flex" flexDirection="column" gap={1} sx={{ minWidth: 0, flex: '1 1 auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: 0,
        }}
      >
        {titleStart && <Box sx={{ flex: '0 0 auto' }}>{titleStart}</Box>}

        <Typography
          fontSize="1.5rem"
          variant="h1"
          className="title"
          fontWeight={400}
          sx={{
            m: 0,
            lineHeight: 1.15,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: '1 1 auto',
          }}
          title={typeof title === 'string' ? title : undefined}
        >
          {title}
        </Typography>

        {titleEnd && <Box sx={{ flex: '0 0 auto' }}>{titleEnd}</Box>}
      </Box>

      {subtitle && (
        <Typography fontSize="1.15rem" variant="h2" color="primary" fontWeight={400} sx={{ m: 0 }}>
          {subtitle}
        </Typography>
      )}

      {subtitleComponent && <Box sx={{ flex: '0 0 auto' }}>{subtitleComponent}</Box>}

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
      <Box 
        sx={{ 
          width: childrenBelowOnDesktop ? { xs: '100%', sm: '100%' } : { xs: '100%', sm: 'auto' },
          flexBasis: childrenBelowOnDesktop ? { xs: '100%', sm: '100%' } : undefined,
          order: childrenBelowOnDesktop ? 2 : undefined,
        }} 
        displayPrint="none"
      >
        {children}
      </Box>
    )}
  </Box>
);

export default PageTitle;
