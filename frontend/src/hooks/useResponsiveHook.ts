import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isBelowMd = useMediaQuery('(max-width:899px)');

  return { theme, isMobile, isBelowMd };
};
