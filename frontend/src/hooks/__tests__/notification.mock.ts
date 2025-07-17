import { type Notification } from 'common/Notification';

export const previousTestNotifications: Notification[] = [
  {
    id: 'notification-0',
    dateTime: '1970-01-01',
    read: true,
    recipient: 'local.user',
    entry: {
      id: 'entry-0',
      dateTime: '1970-01-01',
      content: { text: '#1234 - Testing 01' },
      incidentId: 'incident-0',
      sequence: '0'
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
  entry: {
    id: 'entry-0',
    dateTime: '1970-01-01',
    content: { text: '#1235 - Testing 02' },
    incidentId: 'incident-0',
    sequence: '0'
  }
});
