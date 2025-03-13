import { ReactNode } from 'react';
import { Box } from '@mui/material';

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    paddingY="1rem"
    maxWidth="1500px"
    margin="auto"
    sx={{
      '@media print': {
        padding: 0,
        marginTop: '1rem'
      },
      paddingLeft: { xs: '20px', md: '60px' },
      paddingRight: { xs: '20px', md: '60px' }
    }}
    minHeight="calc(100vh - 150px)"
  >
    {children}
  </Box>
);

export default PageWrapper;
