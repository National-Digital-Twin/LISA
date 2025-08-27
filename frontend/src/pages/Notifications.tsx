// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { type Notification } from 'common/Notification';
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import getHandler from '../components/Notifications/handlers';
import { useNotifications, useReadNotification, useMarkAllAsSeen } from '../hooks';
import { Format } from '../utils';
import DataList, { ListRow } from '../components/DataList';
import { PageTitle } from '../components';

interface TabPanelProps {
  readonly children?: React.ReactNode;
  readonly index: number;
  readonly value: number;
}

function TabPanel({ children = null, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

interface EmptyStateProps {
  readonly icon: React.ComponentType<{ sx?: Record<string, unknown> }>;
  readonly title: string;
}

function EmptyState({ icon: Icon, title }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        padding: 4,
        flexDirection: 'column',
        alignItems: 'center',
        color: 'text.secondary'
      }}
    >
      <Icon sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
}

function NotificationDot() {
  return (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: 'primary.main',
      }}
    />
  );
}

export default function Notifications() {
  const location = useLocation();
  const { notifications } = useNotifications();
  const readNotification = useReadNotification();
  const markAllAsSeen = useMarkAllAsSeen();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 1) {
      navigate('#unread', { replace: true });
    } else {
      navigate('/notifications', { replace: true });
    }
  };

  useEffect(() => {
    if (location.hash === '#unread') {
      setTabValue(1); // Unread tab index
    } else {
      setTabValue(0); // All tab index
    }
  }, [location.hash]);

  const hasCalledMarkSeenRef = useRef(false);
  useEffect(() => {
    if (notifications && !hasCalledMarkSeenRef.current) {
      const hasUnseenNotifications = notifications.some(n => !n.seen);
      if (hasUnseenNotifications) {
        hasCalledMarkSeenRef.current = true;
        markAllAsSeen.mutate();
      }
    }
  }, [notifications, markAllAsSeen]);

  const notificationsArray = useMemo(() => notifications ?? [], [notifications]);
  const unreadNotifications = useMemo(() => notificationsArray.filter((n) => !n.read), [notificationsArray]);
  const unreadCount = useMemo(() => unreadNotifications.length, [unreadNotifications]);

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.read) {
      readNotification.mutate(notification.id);
    }

    try {
      const handler = getHandler(notification, navigate);
      handler.clickHandler(notification);
    } catch {
      console.error('No handler found for notification:', notification);
    }
  }, [navigate, readNotification]);

  const toRow = useCallback((n: Notification): ListRow => {
    const handler = getHandler(n, navigate);
    return {
      key: n.id,
      title: handler.title,
      content: handler.Content,
      footer: handler.footer,
      metaRight: Format.relativeTime(n.dateTime),
      titleDot: !n.read ? <NotificationDot /> : undefined,
      emphasizeTitle: !n.read,
      onClick: () => handleNotificationClick(n)
    };
  }, [navigate, handleNotificationClick]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'white',
          paddingX: { xs: '1rem', md: '60px' },
          paddingY: '1.3rem'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
            textDecoration: 'none',
            mr: 2
          }}
        >
          <PageTitle title="Notifications" />
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="notifications tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              backgroundColor: 'background.paper',
              '&.Mui-selected': {
                backgroundColor: 'background.paper'
              }
            }
          }}
        >
          <Tab label="All" sx={{ textTransform: 'none' }} />
          <Tab
            label={unreadCount > 0 ? `Unread (${unreadCount})` : 'Unread'}
            sx={{ 
              textTransform: 'none', 
              color: unreadCount > 0 ? 'red' : 'inherit'
            }}
          />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: 'background.default' }}>
        <TabPanel value={tabValue} index={0}>
          {notificationsArray.length === 0 ? (
            <EmptyState icon={NotificationsNoneOutlinedIcon} title="There are no notifications" />
          ) : (
            <DataList items={notificationsArray.map(toRow)} />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {unreadNotifications.length === 0 ? (
            <EmptyState icon={NotificationsIcon} title="You have no unread notifications" />
          ) : (
            <DataList items={unreadNotifications.map(toRow)} />
          )}
        </TabPanel>
      </Box>
    </Box>
  );
}
