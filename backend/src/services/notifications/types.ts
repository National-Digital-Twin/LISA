// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

type BaseInput = {
  recipient: string;
}

export type NotificationInput = BaseInput & {
  type: 'UserMentionNotification' | 'TaskAssignedNotification',
  incidentId: string;
  entryId: string;
  taskId?: string;
}
