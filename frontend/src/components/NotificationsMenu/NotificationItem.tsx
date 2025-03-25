import { useNavigate } from 'react-router-dom';

import { type Notification } from 'common/Notification';
import { Box, Typography } from '@mui/material';
import getHandler from './handlers';
import { bem } from '../../utils';

interface Props {
  notification: Notification;
  onClick: (notification: Notification) => void;
}
export default function NotificationItem({ notification, onClick }: Readonly<Props>) {
  const navigate = useNavigate();
  const { read } = notification;

  const { title, Content, clickHandler } = getHandler(notification, navigate);

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
      <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
        <Typography>{title}</Typography>
        {!read && <span className={classes('item-unread')} />}
      </Box>
      <Box display="flex" flexDirection="column" width="100%" gap={1}>
        {Content}
      </Box>
    </Box>
  );
}
