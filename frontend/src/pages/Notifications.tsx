// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Box, List, ListItem, Tab, Tabs, Typography } from '@mui/material';
import { type Notification } from 'common/Notification';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getHandler from '../components/NotificationsMenu/handlers';
import { useNotifications, useReadNotification } from '../hooks';
import { Format } from '../utils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

function EmptyState({
  icon: Icon,
  title
}: {
  icon: React.ComponentType<{ sx?: Record<string, unknown> }>;
  title: string;
}) {
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
        marginTop: 1,
        width: 10,
        height: 10,
        borderRadius: '9999px',
        backgroundColor: 'primary.main'
      }}
    />
  );
}

function NotificationSpacer() {
  return <Box sx={{ width: 12, flexShrink: 0 }} />;
}

export default function Notifications() {
  const [tabValue, setTabValue] = useState(0);
  const { notifications } = useNotifications();
  const readNotification = useReadNotification();
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const unreadNotifications = notifications?.filter((n) => !n.read) ?? [];
  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      readNotification.mutate(notification.id);
    }

    try {
      const handler = getHandler(notification, navigate);
      handler.clickHandler(notification);
    } catch {
      console.error('No handler found for notification:', notification);
    }
  };

  const renderNotificationItem = (notification: Notification) => {
    try {
      const handler = getHandler(notification, navigate);
      return (
        <ListItem
          key={notification.id}
          sx={{
            padding: 2,
            cursor: 'pointer',
            backgroundColor: 'background.paper',
            '&:hover': { backgroundColor: 'action.hover' }
          }}
          onClick={() => handleNotificationClick(notification)}
        >
          <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
            {!notification.read ? <NotificationDot /> : <NotificationSpacer />}

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                >
                  {handler.title}
                </Typography>
                <Typography color="text.secondary">
                  {Format.relativeTime(notification.dateTime)}
                </Typography>
              </Box>

              <Box>{handler.Content}</Box>

              {notification.incidentTitle && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', fontWeight: 500 }}
                >
                  {handler.footer}
                </Typography>
              )}
            </Box>
          </Box>
        </ListItem>
      );
    } catch {
      return null;
    }
  };

  const filteredNotifications = tabValue === 0 ? (notifications ?? []) : unreadNotifications;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ padding: { xs: 2, md: 3 } }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Notifications
        </Typography>
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
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: 'background.default' }}>
        <TabPanel value={tabValue} index={0}>
          {filteredNotifications.length === 0 ? (
            <EmptyState icon={NotificationsNoneOutlinedIcon} title="There are no notifications" />
          ) : (
            <List sx={{ display: 'flex', flexDirection: 'column', padding: 0, gap: '1px' }}>
              {filteredNotifications.map((notification) => (
                <Box key={notification.id}>{renderNotificationItem(notification)}</Box>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {unreadNotifications.length === 0 ? (
            <EmptyState icon={NotificationsIcon} title="You have no unread notifications" />
          ) : (
            <List sx={{ display: 'flex', flexDirection: 'column', padding: 0, gap: '1px' }}>
              {unreadNotifications.map((notification) => (
                <Box key={notification.id}>{renderNotificationItem(notification)}</Box>
              ))}
            </List>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
}
