// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Boolean, Literal, Record, Static, String, Union } from 'runtypes';
import { LogEntry } from './LogEntry';
import { Task } from './Task';

export const NotificationType = Union(
  Literal('UserMentionNotification'),
  Literal('TaskAssignedNotification')
);

export const BaseNotification = Record({
  id: String,
  recipient: String,
  read: Boolean,
  dateTime: String
});

export const UserMentionNotification = BaseNotification.extend({
  entry: LogEntry.pick('id', 'incidentId', 'author', 'dateTime', 'sequence', 'content')
});

export const TaskAssignedNotification = BaseNotification.extend({
  entry: LogEntry.pick('id', 'incidentId', 'author', 'dateTime', 'sequence').extend({
    task: Task.pick('id', 'name')
  })
});

export const Notification = Union(UserMentionNotification, TaskAssignedNotification);

export type NotificationType = Static<typeof NotificationType>;
export type Notification = Static<typeof Notification>;
export type UserMentionNotification = Static<typeof UserMentionNotification>;
export type TaskAssignedNotification = Static<typeof TaskAssignedNotification>;
