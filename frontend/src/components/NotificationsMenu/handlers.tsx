import { ReactNode } from 'react';
import { NavigateFunction } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

// eslint-disable-next-line import/no-extraneous-dependencies
import { type Notification, UserMentionNotification } from 'common/Notification';
import { Box, Typography } from '@mui/material';
import { Format } from '../../utils';

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
  return {
    title: "You've been mentioned in a Log Entry",
    Content: (
      <>
        <Box>
          <Typography component="span" variant="body1">{`#${entry.sequence} - `}</Typography>
          <Typography component="span" variant="body1">
            {(entry.content.text ?? '').substring(0, 100)}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" gap={2} alignItems="center">
          <Box display="flex" gap={1} alignItems="center">
            <PersonIcon fontSize="small" />
            <Typography fontSize="small" variant="body1">
              Robert Sinclair{Format.user(entry.author)}
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <CalendarMonthIcon fontSize="small" />
            <Typography fontSize="small" variant="body1">
              {Format.date(entry.dateTime)}
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <AccessTimeFilledIcon fontSize="small" />
            <Typography fontSize="small" variant="body1">
              {Format.time(entry.dateTime)}
            </Typography>
          </Box>
        </Box>
      </>
    ),
    clickHandler: (item) => {
      navigate(`logbook/${item.entry.incidentId}#${item.entry.id}`);
    }
  };
}

const handlerFunctions: HandlerFunction[] = [userMention];

export default function getHandler(
  notification: Notification,
  navigate: NavigateFunction
): Handler {
  const handler: Handler | null = handlerFunctions.reduce(
    (result: Handler | null, fn: HandlerFunction) => {
      if (result) {
        return result;
      }
      return fn(notification, navigate);
    },
    null
  );

  return (
    handler || {
      title: 'Error: Unhandled notification type',
      clickHandler: () => {},
      Content: <span>what</span>
    }
  );
}
