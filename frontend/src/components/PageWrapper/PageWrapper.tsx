import { Box } from '@mui/material';
import { ReactElement } from 'react';

const PageWrapper = ({ children }: { children: ReactElement[] | ReactElement }) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    paddingY="130px"
    sx={{ paddingLeft: { xs: '20px', md: '60px' }, paddingRight: { xs: '20px', md: '60px' } }}
    minHeight="calc(100vh - 150px)"
  >
    {children}
  </Box>
);

export default PageWrapper;
