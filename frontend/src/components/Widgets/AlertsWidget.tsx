// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';
import WidgetBase from './WidgetBase';
import { useNotifications } from '../../hooks/useNotifications';


const AlertsWidget = () => {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.read).length;
  const onNavigate = () => navigate('/notifications');

  return (
    <WidgetBase title="Alerts" onAction={onNavigate} showArrow>
      <Typography variant="body2">
        You have <Typography component="span" color="primary" fontWeight="bold" variant="body2">{unreadCount} unread</Typography> notifications
      </Typography>
    </WidgetBase>
  );
}

export default AlertsWidget;
