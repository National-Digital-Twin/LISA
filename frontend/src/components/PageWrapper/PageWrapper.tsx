// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

type PageWrapperProps = PropsWithChildren & {
  backgroundColor?: string;
};

const PageWrapper = ({ children, backgroundColor = 'transparent' }: PageWrapperProps) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    paddingY="1rem"
    sx={{
      backgroundColor,
      '@media print': {
        padding: 0,
        marginTop: '1rem'
      },
      paddingLeft: { xs: '1rem', md: '2rem' },
      paddingRight: { xs: '1rem', md: '2rem' }
    }}
    minHeight="100%"
  >
    {children}
  </Box>
);

export default PageWrapper;
