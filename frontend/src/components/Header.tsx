// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { MouseEvent, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from 'common/User';
import LisaLogo from '../assets/images/lisa_logo.svg';
import LisaLogoMobile from '../assets/images/lisa_logo_mobile.svg';
import { useAuth, useNotifications } from '../hooks';
import { useNavigation } from '../hooks/useNavigation';
import { Format } from '../utils';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const { pathname } = useLocation();
  const { navigationItems, isActive, handleLink: sharedHandleLink } = useNavigation();
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);
  const [openGuide, setOpenGuide] = useState(false);

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const openAccount = Boolean(accountAnchorEl);

  const handleAccountClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const signOut = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    user.logout();
  };

  const handleLink = () => {
    setAccountAnchorEl(null);
    document.documentElement.scrollTo(0, 0);
  };

  const handleUserGuideClick = () => {
    setOpenGuide(true);
    setAccountAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        height: 60,
        backgroundColor: 'secondary.main',
        borderColor: 'primary.main'
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          height: '100%',
          display: 'flex',
          paddingX: '1rem',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
        disableGutters
      >
        <Box display="flex" alignItems="center" gap={3}>
          <Box display="flex" alignItems="center" gap={1}>
            {isMobile && (
              <IconButton
                onClick={onMenuClick}
                sx={{
                  padding: 0,
                  display: { xs: 'inherit', md: 'none' },
                  color: 'accent.main'
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <IconButton component={Link} to="/" onClick={handleLink}>
              <Box
                component="img"
                height={24}
                width={100}
                src={isMobile ? LisaLogoMobile : LisaLogo}
                alt="Local Incident Services Application"
              />
            </IconButton>
          </Box>

          {!isMobile && (
            <Box display="flex" gap={3}>
              {navigationItems.map(({ to, label }) => {
                const selected = isActive(to);
                return (
                  <Box
                    key={to}
                    component={Link}
                    to={to}
                    onClick={sharedHandleLink}
                    className={selected ? 'selected' : ''}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      fontWeight: 'normal',
                      '&:hover': {
                        color: 'accent.main'
                      },
                      '&.selected': {
                        color: 'accent.main',
                        textDecoration: 'underline',
                        textUnderlineOffset: '0.5rem',
                        textDecorationThickness: '2px'
                      }
                    }}
                  >
                    {label}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <IconButton component={Link} to="/notifications" onClick={handleLink}>
            <Badge badgeContent={pathname === '/notifications' ? 0 : unreadCount} color="error">
              <NotificationsNoneOutlinedIcon
                sx={{
                  color: pathname === '/notifications' ? 'accent.main' : 'white'
                }}
              />
            </Badge>
          </IconButton>

          <IconButton onClick={handleAccountClick}>
            {accountAnchorEl ? (
              <AccountCircleIcon sx={{ color: 'accent.main' }} />
            ) : (
              <AccountCircleOutlinedIcon sx={{ color: 'white' }} />
            )}
          </IconButton>

          <Menu
            open={openAccount}
            anchorEl={accountAnchorEl}
            onClose={() => setAccountAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: -1,
              horizontal: 'left'
            }}
            slotProps={{
              paper: { sx: { minWidth: 200, padding: '4px' } }
            }}
          >
            <MenuItem disabled sx={{ padding: '8px 12px', '&.Mui-disabled': { opacity: 1 } }}>
              <Typography variant="body1" color="textDisabled">
                {Format.user(user.current as User)}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleUserGuideClick} sx={{ padding: '8px 12px' }}>
              <AccountBoxOutlinedIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
              <Typography variant="body2" color="secondary">
                User guide
              </Typography>
            </MenuItem>
            <MenuItem onClick={signOut} sx={{ padding: '8px 12px' }}>
              <LogoutOutlinedIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
              <Typography variant="body2" color="secondary">
                Sign out
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      <Modal open={openGuide} onClose={() => setOpenGuide(false)}>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          position="absolute"
          top={isMobile ? 0 : '50%'}
          left={isMobile ? 0 : '50%'}
          bgcolor="background.paper"
          sx={{
            transform: isMobile ? 'translate(0, 0)' : 'translate(-50%, -50%)',
            borderRadius: 1
          }}
          height={isMobile ? '100%' : 'auto'}
          justifyContent={isMobile ? 'center' : 'none'}
          maxWidth={600}
          padding={4}
          border={0}
        >
          <Typography variant="h5" component="h2">
            Download L!SA user guide
          </Typography>
          <Typography variant="body1" color="textSecondary">
            The user guide contains information on the different features and functionality of the
            L!SA tool, as well as a troubleshooting guide. The troubleshooting guide is there to
            help with any issues you might encounter when using the tool.
          </Typography>
          <Box
            display="flex"
            justifyContent="flex-end"
            flexDirection="row"
            flexWrap="wrap"
            gap={1}
            mt={2}
          >
            <Button variant="text" onClick={() => setOpenGuide(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              href="/documents/NDTP_L!SA User Guide.pdf"
              download="/documents/NDTP_L!SA User Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download user guide
            </Button>
          </Box>
        </Box>
      </Modal>
    </AppBar>
  );
};

export default Header;
