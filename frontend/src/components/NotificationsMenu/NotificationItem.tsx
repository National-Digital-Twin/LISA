// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useNavigate } from 'react-router-dom';

import { type Notification } from 'common/Notification';
import { Box, Typography } from '@mui/material';
import getHandler from './handlers';
import { bem } from '../../utils';
import { time } from '../../utils/Format/date';

interface Props {
  notification: Notification;
  onClick: (notification: Notification) => void;
}
export default function NotificationItem({ notification, onClick }: Readonly<Props>) {
  const navigate = useNavigate();
  const { read } = notification;

  const { title, dateTime, Content, footer, clickHandler } = getHandler(notification, navigate);

  const onItemClick = () => {
    clickHandler(notification);
    onClick(notification);
  };

  const classes = bem('alerts');

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      component="button"
      type="button"
      padding={2}
      onClick={onItemClick}
      className={classes('item', read ? 'read' : undefined)}
    >
      <Box display="flex" gap={1}>
        {!read && <span className={classes('item-unread')} />}
        <Box display="flex" flexDirection="column" width="100%" gap="5px" marginTop="-7px">
          <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
            <Typography>{title}</Typography>
            <Typography>{time(dateTime)}</Typography>
          </Box>
          <Box display="flex" flexDirection="column" width="100%" gap={1}>
            {Content}
          </Box>
          <Box display="flex" flexDirection="column" width="100%" gap={1}>
            {footer}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
