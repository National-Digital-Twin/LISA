import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  title: string;
  subtitle?: string;
};

const PageTitle = ({ title, subtitle = undefined, children }: Props) => (
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
    <Box>
      <Typography fontSize="2rem" variant="h1" className="title">
        {title}
      </Typography>
      {subtitle && (
        <Typography fontSize="1.15rem" variant="h2" color="primary">
          {subtitle}
        </Typography>
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
