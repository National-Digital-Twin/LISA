import { useEffect, useState } from 'react';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem
} from '@mui/material';
import { useIsOnline } from '../hooks/useIsOnline';

export function OfflineBanner() {
  const isOnline = useIsOnline();
  const [visible, setVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!isOnline) setVisible(true);
    else setTimeout(() => setVisible(false), 500);
  }, [isOnline]);

  if (!visible && !dialogOpen) return null;

  return (
    <>
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
          py: 1.5,
          position: 'relative'
        }}
      >
        <CloudOffIcon sx={{ fontSize: 18 }} />
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            lineHeight: 1
          }}
        >
          YOU ARE OFFLINE
        </Typography>
        <Typography
          onClick={() => setDialogOpen(true)}
          sx={{
            position: 'absolute',
            right: 12,
            textDecoration: 'underline',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          More Info
        </Typography>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="offline-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="offline-dialog-title" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <CloudOffIcon sx={{ fontSize: 36 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              Offline mode
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Some features need an internet connection and won't be available while you're offline:
          </Typography>
          <List
            dense
            sx={{
              py: 2,
              '& .MuiListItem-root': {
                listStylePosition: 'inside',
                listStyleType: 'disc',
                display: 'list-item'
              }
            }}
          >
            <ListItem>Sign in / Sign out</ListItem>
            <ListItem>Real-time notifications</ListItem>
            <ListItem>Map search & precise location</ListItem>
            <ListItem>File downloads</ListItem>
            <ListItem>Changing an incident status</ListItem>
            <ListItem>Publishing new form templates</ListItem>
          </List>
          <Typography>All updates will sync automatically when you're back online.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
