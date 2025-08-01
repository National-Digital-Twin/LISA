import { type Notification } from 'common/Notification';

export const previousTestNotifications: Notification[] = [
  {
    id: 'notification-0',
    dateTime: '1970-01-01',
    read: true,
    recipient: 'local.user',
    incidentTitle: 'Incident 0',
    entry: {
      id: 'entry-0',
      incidentId: 'incident-0'
    }
  }
];

export const newNotificationGenerator: (notificationId: string) => Notification = (
  notificationId
) => ({
  id: notificationId,
  dateTime: '1970-01-01',
  recipient: 'local.user',
  read: false,
  incidentTitle: 'Incident 0',
  entry: {
    id: 'entry-0',
    incidentId: 'incident-0'
  }
});
