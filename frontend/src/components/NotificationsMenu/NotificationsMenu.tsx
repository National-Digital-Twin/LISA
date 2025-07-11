// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useEffect, useState } from 'react';

import { type Notification } from 'common/Notification';
import { Badge, Box, IconButton, Popover } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import NotificationItem from './NotificationItem';
import { bem } from '../../utils';
import { useAuth, useNotifications, useReadNotification } from '../../hooks';
import useMessaging from '../../hooks/useMessaging';
import { useResponsive } from '../../hooks/useResponsiveHook';
import { pollForTotalNotifications } from '../../hooks/useNotifications';

export default function NotificationsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const expanded = Boolean(anchorEl);

  const { notifications, invalidate } = useNotifications();
  const readNotification = useReadNotification();
  const { user } = useAuth();
  const [hasNewNotifications, resetNewNotifications] = useMessaging(
    'NewNotification',
    user?.current?.username
  );

  useEffect(() => {
    if (hasNewNotifications) {
      setTimeout(
        () =>
          pollForTotalNotifications(
            notifications?.length ?? 0,
            1,
            invalidate,
            resetNewNotifications
          ),
        1000
      );
    }
  }, [hasNewNotifications, notifications, invalidate, resetNewNotifications]);

  const onItemClick = (notification: Notification) => {
    setAnchorEl(null);
    if (!notification.read) {
      readNotification.mutate(notification.id);
    }
  };

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const classes = bem('alerts');

  const { isMobile } = useResponsive();

  return (
    <div className={classes()}>
      <IconButton type="button" onClick={(event) => setAnchorEl(event.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error" overlap="circular" max={99}>
          {!expanded ? (
            <NotificationsNoneOutlinedIcon sx={{ color: 'white' }} />
          ) : (
            <NotificationsIcon sx={{ color: 'accent.main' }} />
          )}
        </Badge>
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        open={expanded}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{
          vertical: -1,
          horizontal: 'right'
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: isMobile ? 'auto' : '480px',
              maxWidth: isMobile ? 'auto' : '480px',
              maxHeight: '600px'
            }
          }
        }}
      >
        <Box className={classes('menu')}>
          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection="row"
            width="100%"
            alignItems="center"
            borderBottom="1px solid"
            paddingX={1}
            paddingY={1}
            borderColor="border.main"
          >
            <span>Notifications</span>
            <IconButton onClick={() => setAnchorEl(null)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <div className={classes('menu-list')}>
            {notifications?.length === 0 && (
              <span className={classes('empty')}>No notifications</span>
            )}
            {notifications?.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onItemClick}
              />
            ))}
          </div>
        </Box>
      </Popover>
    </div>
  );
}
