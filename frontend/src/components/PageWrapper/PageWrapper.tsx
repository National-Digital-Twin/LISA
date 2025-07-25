// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ReactNode } from 'react';
import { Box } from '@mui/material';

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    paddingY="2rem"
    sx={{
      '@media print': {
        padding: 0,
        marginTop: '1rem'
      },
      paddingLeft: { xs: '1rem', md: '60px' },
      paddingRight: { xs: '1rem', md: '60px' }
    }}
    minHeight="100%"
  >
    {children}
  </Box>
);

export default PageWrapper;
