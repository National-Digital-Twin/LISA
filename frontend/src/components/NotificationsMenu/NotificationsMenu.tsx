import { useEffect, useState } from 'react';

import { type Notification } from 'common/Notification';
import NotificationItem from './NotificationItem';
import { Icons, bem } from '../../utils';
import { useAuth, useNotifications, useOutsideClick, useReadNotification } from '../../hooks';
import useMessaging from '../../hooks/useMessaging';

export default function NotificationsMenu() {
  const [expanded, setExpanded] = useState<boolean>(false);

  const { notifications, invalidate } = useNotifications();
  const readNotification = useReadNotification();
  const { user } = useAuth();
  const hasNewNotifications = useMessaging('NewNotification', user?.current?.username);

  const containerRef = useOutsideClick<HTMLDivElement>(() => {
    setExpanded(false);
  });

  useEffect(() => {
    if (!hasNewNotifications) {
      return;
    }
    invalidate();
  }, [hasNewNotifications, invalidate]);

  const onMenuBtnClick = () => {
    setExpanded((prev) => !prev);
  };

  const onItemClick = (notification: Notification) => {
    setExpanded(false);
    if (!notification.read) {
      readNotification.mutate(notification.id);
    }
  };

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;
  const classes = bem('alerts');

  return (
    <div ref={containerRef} className={classes()}>
      {!expanded && (
        <button type="button" className={classes('btn')} onClick={onMenuBtnClick}>
          {unreadCount > 0 && (
            <span className={classes('badge')}>{unreadCount > 99 ? '99+' : unreadCount}</span>
          )}
          <Icons.Notification />
        </button>
      )}
      {expanded && (
        <div className={classes('menu')}>
          <div className={classes('menu-title')}>
            <span>Notifications</span>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className={classes('menu-close')}
              onClick={() => setExpanded(false)}
            >
              <Icons.Close />
            </button>
          </div>
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
        </div>
      )}
    </div>
  );
}
