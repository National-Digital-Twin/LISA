import { useNavigate } from 'react-router-dom';

import { type Notification } from 'common/Notification';
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
    <button
      type="button"
      onClick={onItemClick}
      className={classes('item', read ? 'read' : undefined)}
    >
      <span className={classes('item-title')}>
        <span>{title}</span>
        {!read && (
          <span className={classes('item-unread')} />
        )}
      </span>
      <span className={classes('item-content')}>
        {Content}
      </span>
    </button>
  );
}
