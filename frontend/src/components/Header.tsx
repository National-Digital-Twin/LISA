// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Popover,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
  Modal
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from 'common/User';
// eslint-disable-next-line import/no-webpack-loader-syntax
import LisaLogo from '../assets/images/L!SA_logo.svg';
import { useAuth, useIncidents } from '../hooks';
import { useResponsive } from '../hooks/useResponsiveHook';
import { NotificationsMenu } from './NotificationsMenu';
import { Format } from '../utils';

const HEADER_ITEMS = [
  {
    to: '/',
    label: 'INCIDENTS',
    subItems: [
      { to: 'logbook', label: 'LOG' },
      { to: 'incident', label: 'OVERVIEW' },
      { to: 'files', label: 'FILES' },
      { to: 'location', label: 'LOCATION' },
      { to: 'tasks', label: 'TASKS' }
    ]
  },
  {
    to: '/forms',
    label: 'FORMS',
    subItems: []
  }
];

type NavigationItemsProps = {
  isBelowMd?: boolean;
  pathname: string;
  handleLink: () => void;
};

const NavigationItems = ({ isBelowMd = false, pathname, handleLink }: NavigationItemsProps) => {
  const flexDirection = isBelowMd ? 'column' : 'row';
  const alignItems = isBelowMd ? 'flex-start' : 'center';
  const gap = isBelowMd ? 3 : 4;
  return (
    <Box
      display="flex"
      flexDirection={flexDirection}
      alignItems={alignItems}
      justifyContent="space-between"
      flexGrow={1}
      gap={gap}
    >
      <Box
        component="ul"
        display="flex"
        flexDirection={flexDirection}
        alignItems={alignItems}
        gap={gap}
      >
        <IconButton sx={{ paddingX: 0 }} component={Link} onClick={handleLink} to="/">
          <Box
            component="img"
            width={100}
            src={LisaLogo}
            alt="Local Incident Services Application"
          />
        </IconButton>
        {HEADER_ITEMS.map(({ to, label }) => {
          const selected = pathname.includes(to);
          return (
            <Box component="li" key={to} className={`${selected ? 'selected' : ''}`}>
              <Typography
                variant="body1"
                sx={{
                  color: selected ? 'accent.main' : 'white',
                  textDecorationLine: selected ? 'underline !important' : '',
                  textDecorationThickness: selected ? '2px' : 0,
                  textUnderlineOffset: '0.5rem',
                  transition: 'color 0.3s',
                  '&:hover': { color: 'accent.main' },
                  lineHeight: 0
                }}
                component={Link}
                onClick={handleLink}
                to={to}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const Header = () => {
  const { pathname } = useLocation();
  const { incidentId } = useParams();
  const { user } = useAuth();
  const query = useIncidents();
  const headerRef = useRef<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);
  const [active, setActive] = useState('');
  const [openGuide, setOpenGuide] = useState(false);
  const openNav = Boolean(anchorEl);
  const openAccount = Boolean(accountAnchorEl);

  const incident = query.data?.find((inc) => inc.id === incidentId);

  const cPage = HEADER_ITEMS.find(({ to }) => pathname.includes(to));
  const hasSubItems = Array.isArray(cPage?.subItems) && cPage.subItems.length > 0 && incident;

  useEffect(() => {
    if (hasSubItems) {
      const selected = cPage.subItems.find(({ to }) => pathname.includes(to));
      if (selected) setActive(`${selected.to}/${incident.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSubItems, cPage, pathname]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setActive(newValue);
  };

  const handleNavbutt = () => {
    setAnchorEl(headerRef.current);
  };

  const handleLink = () => {
    setAnchorEl(null);
    document.documentElement.scrollTo(0, 0);
  };

  const signOut = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    user.logout();
  };

  const { isBelowMd } = useResponsive();

  return (
    <Box>
      <AppBar
        ref={headerRef}
        position="static"
        sx={{
          height: 60,
          backgroundColor: 'secondary.main',
          borderColor: 'primary.main'
        }}
      >
        <Toolbar
          variant="dense"
          sx={{ height: '100%', display: 'flex', paddingX: '1rem', flexDirection: 'row' }}
          disableGutters
        >
          {isBelowMd && (
            <IconButton
              sx={{ padding: 0, display: { xs: 'inherit', md: 'none' } }}
              onMouseDown={handleNavbutt}
            >
              <MenuIcon sx={{ color: 'accent.main' }} />
            </IconButton>
          )}
          <Box
            component="nav"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            flexGrow={1}
            gap="10px"
            minHeight="55px"
          >
            {isBelowMd ? (
              <Popover
                open={openNav}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 0,
                  horizontal: 'left'
                }}
                marginThreshold={0}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      width: '100%',
                      backgroundColor: 'secondary.main',
                      border: 0,
                      borderRadius: 0,
                      paddingY: '2rem',
                      paddingX: '1rem',
                      maxWidth: 'none'
                    }
                  }
                }}
              >
                <Box bgcolor="" width="100%">
                  <NavigationItems isBelowMd pathname={pathname} handleLink={handleLink} />
                </Box>
              </Popover>
            ) : (
              <NavigationItems pathname={pathname} handleLink={handleLink} />
            )}
          </Box>
          <Box display="flex" gap={1}>
            <NotificationsMenu />
            <IconButton onClick={(event) => setAccountAnchorEl(event.currentTarget)}>
              {accountAnchorEl ? (
                <AccountCircleIcon sx={{ color: 'accent.main' }} />
              ) : (
                <AccountCircleOutlinedIcon sx={{ color: 'white' }} />
              )}
            </IconButton>
            <Popover
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
            >
              <Box display="flex" flexDirection="column" minWidth={200}>
                <Box borderBottom="1px solid" borderColor="border.main" padding={2}>
                  <Typography variant="body1" color="textDisabled">
                    {Format.user(user.current as User)}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={1} padding={1}>
                  <Box display="flex" flexDirection="row" gap={1} width="100%">
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => setOpenGuide(!openGuide)}
                      startIcon={<AccountBoxOutlinedIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      User guide
                    </Button>
                  </Box>
                  <Box display="flex" flexGrow="row" gap={1}>
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={signOut}
                      startIcon={<LogoutOutlinedIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Sign out
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Popover>
          </Box>
        </Toolbar>
      </AppBar>
      {hasSubItems && (
        <Box
          bgcolor="background.default"
          borderTop="3px solid"
          borderColor="primary.main"
          paddingLeft={isBelowMd ? 2 : '140px'}
          paddingRight={2}
        >
          <Tabs
            value={active}
            onChange={handleChange}
            variant="scrollable"
            TabIndicatorProps={{
              style: { display: 'none' }
            }}
            color="text.primary"
          >
            {cPage.subItems.map(({ to, label }, index) => {
              const isLastItem = index === cPage.subItems.length - 1;
              const value = `${to}/${incident.id}`;
              const selected = value === active;
              return (
                <Tab
                  key={value}
                  aria-controls={`log-tab-${label}`}
                  label={
                    <Box display="flex" gap={2}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{
                          color: selected ? 'primary.main' : 'text.primary',
                          textDecorationLine: selected ? 'underline !important' : '',
                          textDecorationThickness: selected ? '2px !important' : 0,
                          textUnderlineOffset: '0.5rem',
                          transition: 'color 0.3s',
                          '&:hover': { color: 'primary.main' }
                        }}
                        component={Link}
                        onClick={handleLink}
                        to={`${to}/${incident.id}`}
                      >
                        {label}
                      </Typography>
                      {!isLastItem && (
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ borderColor: 'text.primary' }}
                        />
                      )}
                    </Box>
                  }
                  component={Link}
                  to={value}
                  value={value}
                  sx={{ minWidth: 0, padding: 1 }}
                  color="text.primary"
                />
              );
            })}
          </Tabs>
        </Box>
      )}
      <Modal open={openGuide} onClose={() => setOpenGuide(!openGuide)}>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          position="absolute"
          top={isBelowMd ? 0 : '50%'}
          left={isBelowMd ? 0 : '50%'}
          bgcolor="background.paper"
          sx={{
            transform: isBelowMd ? 'translate(0, 0)' : 'translate(-50%, -50%)',
            borderRadius: 1
          }}
          height={isBelowMd ? '100%' : 'auto'}
          justifyContent={isBelowMd ? 'center' : 'none'}
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
            <Button variant="text" onClick={() => setOpenGuide(!openGuide)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              href="/documents/NDTP_L!SA User Guide.pdf"
              download="/documents/NDTP_L!SA User Guide.pdf"
              target="_blank"
              rel="noopender noreferrer"
            >
              Download user guide
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Header;
