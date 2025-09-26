// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

// Local imports
import { PRINTABLE_KEY } from '../utils/constants';
import Header from './Header';
import { OfflineBanner } from './OfflineBanner';
import SideNavigation from './SideNavigation';

export default function Layout() {
  const [printable] = useState<boolean>(sessionStorage.getItem(PRINTABLE_KEY) === 'yes');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  const handleMenuClick = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <div className={`App ${printable ? 'printable' : ''}`}>
      <div className="app-wrapper">
        <Header onMenuClick={handleMenuClick} />
        {isMobile && <SideNavigation open={drawerOpen} onClose={handleDrawerClose} />}
        <Box
          component="main"
          className="app-content"
          sx={{
            width: '100%',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            })
          }}
        >
          <OfflineBanner />
          <Outlet />
        </Box>
      </div>
    </div>
  );
}
