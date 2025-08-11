// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useNavigate } from 'react-router-dom';

import { Button, Typography } from '@mui/material';
import WidgetBase from './WidgetBase';
import { useNotifications } from '../../hooks/useNotifications';


const AlertsWidget = () => {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const onNavigateAlertsHeader = () => navigate('/notifications');
  const onNavigateUnread = () => navigate('/notifications#unread')

  return (
    <WidgetBase title="Alerts" onAction={onNavigateAlertsHeader} actionAriaLabel="Open Alerts" showArrow>
      <Typography variant="body2">
        You have{' '}
        {unreadCount > 0 ? (
          <Button
            onClick={onNavigateUnread}
            variant="text"
            color="primary"
            sx={{
              padding: 0,
              minWidth: 0,
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: 'inherit',
              verticalAlign: 'baseline',
            }}
            aria-label="View unread notifications"
          >
            {unreadCount} unread
          </Button>
        ) : (
          <Typography
            component="span"
            fontWeight="bold"
            variant="body2"
            color="text.primary"
          >
            {unreadCount} unread
          </Typography>
        )}{' '}
        notifications
      </Typography>
    </WidgetBase>
  );
};

export default AlertsWidget;