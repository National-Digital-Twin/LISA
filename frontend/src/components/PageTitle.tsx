import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  title: string;
  subtitle: string;
};

const PageTitle = ({ title, subtitle, children }: Props) => (
  <Box
    className="page-title"
    style={{ alignItems: 'center' }}
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    gap="1rem"
  >
    <Box>
      <Typography fontSize="2rem" variant="h1">
        {title}
      </Typography>
      <Typography fontSize="1.15rem" variant="h2" color="primary">
        {subtitle}
      </Typography>
    </Box>
    {children && <div className="title-children">{children}</div>}
  </Box>
);

export default PageTitle;
