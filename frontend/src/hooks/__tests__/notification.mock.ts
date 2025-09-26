// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type Notification } from 'common/Notification';

export const previousTestNotifications: Notification[] = [
  {
    id: 'notification-0',
    dateTime: '1970-01-01',
    read: true,
    seen: true,
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
  seen: false,
  incidentTitle: 'Incident 0',
  entry: {
    id: 'entry-0',
    incidentId: 'incident-0'
  }
});
