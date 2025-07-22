import { useEffect, useState } from 'react';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { Box, Typography } from '@mui/material';
import { useIsOnline } from '../hooks/useIsOnline';

export function OfflineBanner() {
  const isOnline = useIsOnline();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isOnline) setVisible(true);
    else setTimeout(() => setVisible(false), 500);
  }, [isOnline]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#938e8e',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        height: 26,
        fontSize: '0.75rem',
        fontWeight: 600,
        borderBottom: '1px solid #ddd',
        zIndex: 1,
        px: 2,
      }}
    >
      <CloudOffIcon sx={{ fontSize: 16, mt: '1px' }} />
      <Typography
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
    YOU ARE OFFLINE
      </Typography>
    </Box>
  );
}
