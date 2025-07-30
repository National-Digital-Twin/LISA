// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { ReactNode } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

// Local imports
import { type Notification, UserMentionNotification, TaskAssignedNotification } from 'common/Notification';
import { Format } from '../../utils';

type Handler = {
  title: string;
  Content: ReactNode;
  clickHandler: (notification: Notification) => void;
};

type HandlerFunction = (notification: Notification, navigate: NavigateFunction) => Handler | null;

// Reusable components to eliminate duplication
const NotificationContent = ({ 
  sequence, 
  text, 
  author, 
  dateTime 
}: { 
  sequence: string; 
  text: string; 
  author: any; 
  dateTime: string; 
}) => (
  <>
    <Box>
      <Typography component="span" variant="body1">{`#${sequence} - `}</Typography>
      <Typography component="span" variant="body1">
        {text.substring(0, 100)}
      </Typography>
    </Box>
    <Box display="flex" flexDirection="row" gap={2} alignItems="center">
      <Box display="flex" gap={1} alignItems="center">
        <PersonIcon fontSize="small" />
        <Typography fontSize="small" variant="body1">
          {Format.user(author)}
        </Typography>
      </Box>
      <Box display="flex" gap={1} alignItems="center">
        <CalendarMonthIcon fontSize="small" />
        <Typography fontSize="small" variant="body1">
          {Format.date(dateTime)}
        </Typography>
      </Box>
      <Box display="flex" gap={1} alignItems="center">
        <AccessTimeFilledIcon fontSize="small" />
        <Typography fontSize="small" variant="body1">
          {Format.time(dateTime)}
        </Typography>
      </Box>
    </Box>
  </>
);

function userMention(notification: Notification, navigate: NavigateFunction): Handler | null {
  if (!UserMentionNotification.guard(notification)) {
    return null;
  }

  const { entry } = notification;
  return {
    title: "You've been mentioned in a Log Entry",
    Content: (
      <NotificationContent
        sequence={entry.sequence ?? ''}
        text={entry.content.text ?? ''}
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

  return {
    title: "You've been assigned a new Task",
    Content: (
      <NotificationContent
        sequence={entry.sequence ?? ''}
        text={entry.task.name ?? ''}
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
