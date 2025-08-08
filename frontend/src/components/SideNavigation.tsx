// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';

// Local imports
import LisaLogo from '../assets/images/lisa_logo.svg';
import { useNavigation } from '../hooks/useNavigation';

const DRAWER_WIDTH = 320;

interface SideNavigationProps {
  open: boolean;
  onClose: () => void;
}

const SideNavigation = ({ open, onClose }: SideNavigationProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { navigationItems, isActive, handleLink: sharedHandleLink } = useNavigation();

  const handleLink = () => {
    if (isMobile) {
      onClose();
    }
    sharedHandleLink();
  };

  const drawerContent = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'secondary.main'
      }}
    >
      <Box
        sx={{
          height: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingX: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <IconButton component={Link} to="/" onClick={handleLink}>
          <Box
            component="img"
            width={100}
            src={LisaLogo}
            alt="Local Incident Services Application"
          />
        </IconButton>
        {isMobile && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ flex: 1, padding: 1 }}>
        <List sx={{ padding: 0 }}>
          {navigationItems.map(({ to, label }) => {
            const selected = isActive(to);
            return (
              <ListItem key={to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={to}
                  onClick={handleLink}
                  selected={selected}
                  sx={{
                    borderRadius: 1,
                    margin: 0.5,
                    color: selected ? 'accent.main' : 'white',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.12)'
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)'
                    }
                  }}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          border: 'none'
        }
      }}
      ModalProps={{ keepMounted: true }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SideNavigation;
