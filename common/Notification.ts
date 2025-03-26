import { Boolean, Literal, Record, Static, String, Union } from 'runtypes';
import { LogEntry } from './LogEntry';

export const NotificationType = Union(Literal('UserMentionNotification'));

export const BaseNotification = Record({
  id: String,
  recipient: String,
  read: Boolean,
  dateTime: String
});

export const UserMentionNotification = BaseNotification.extend({
  entry: LogEntry.pick('id', 'incidentId', 'author', 'dateTime', 'sequence', 'content')
});

export const Notification = Union(UserMentionNotification);

// eslint-disable-next-line no-redeclare
export type NotificationType = Static<typeof NotificationType>;
// eslint-disable-next-line no-redeclare
export type Notification = Static<typeof Notification>;
// eslint-disable-next-line no-redeclare
export type UserMentionNotification = Static<typeof UserMentionNotification>;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
