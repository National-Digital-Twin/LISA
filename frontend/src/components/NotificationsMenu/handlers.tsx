// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  type Notification,
  TaskAssignedNotification,
  UserMentionNotification
} from 'common/Notification';
import { ReactNode } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { NotificationContent } from './NotificationContent';

type Handler = {
  title: string;
  Content: ReactNode;
  clickHandler: (notification: Notification) => void;
};

type HandlerFunction = (notification: Notification, navigate: NavigateFunction) => Handler | null;

function userMention(notification: Notification, navigate: NavigateFunction): Handler | null {
  if (!UserMentionNotification.guard(notification)) {
    return null;
  }

  const { entry } = notification;
  const sequence = entry.sequence ?? '';
  const text = entry.content.text ?? '';

  if (!sequence || !text) {
    return null;
  }

  return {
    title: "You've been mentioned in a Log Entry",
    Content: (
      <NotificationContent
        sequence={sequence}
        text={text}
        author={entry.author}
        dateTime={entry.dateTime}
      />
    ),
    clickHandler: (item) => {
      navigate(`logbook/${item.entry.incidentId}#${item.entry.id}`);
    }
  };
}

function assignedTask(notification: Notification, navigate: NavigateFunction): Handler | null {
  if (!TaskAssignedNotification.guard(notification) || !notification.entry.task) {
    return null;
  }

  const { entry } = notification;
  const sequence = entry.sequence ?? '';
  const text = entry.task.name ?? '';

  if (!sequence || !text) {
    return null;
  }

  return {
    title: "You've been assigned a new Task",
    Content: (
      <NotificationContent
        sequence={sequence}
        text={text}
        author={entry.author}
        dateTime={entry.dateTime}
      />
    ),
    clickHandler: (item) => {
      const taskAssignedNotif = item as TaskAssignedNotification;
      navigate(`tasks/${item.entry.incidentId}#${taskAssignedNotif.entry.task.id}`);
    }
  };
}

const handlerFunctions: HandlerFunction[] = [userMention, assignedTask];

export default function getHandler(
  notification: Notification,
  navigate: NavigateFunction
): Handler {
  const handler: Handler | null = handlerFunctions.reduce(
    (acc, handlerFunction) => {
      if (acc !== null) {
        return acc;
      }
      return handlerFunction(notification, navigate);
    },
    null as Handler | null
  );

  if (handler === null) {
    throw new Error(`No handler found for notification`);
  }

  return handler;
}
