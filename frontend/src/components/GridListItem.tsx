import { ReactElement } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Typography } from '@mui/material';

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
