import { ReactNode } from 'react';
import { NavigateFunction } from 'react-router-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { type Notification, UserMentionNotification } from 'common/Notification';
import { type LogEntry } from 'common/LogEntry';
import { Format, Icons } from '../../utils';

type Handler = {
  title: string;
  Content: ReactNode;
  clickHandler: (notification: Notification) => void;
}

interface HandlerFunction {
  (notification: Notification, navigate: NavigateFunction): Handler | null;
}

function userMention(notification: Notification, navigate: NavigateFunction): Handler | null {
  if (!UserMentionNotification.guard(notification)) {
    return null;
  }

  const { entry } = notification;
  return {
    title: 'You\'ve been mentioned in a Log Entry',
    Content: (
      <>
        <span className="user-mention-name">
          <span>{`#${Format.entry.index(entry as LogEntry)} - `}</span>
          <span>{(entry.content.text ?? '').substring(0, 100)}</span>
        </span>
        <span className="user-mention-info">
          <span>
            <Icons.Person />
            {Format.user(entry.author)}
          </span>
          <span>
            <Icons.Calendar />
            {Format.date(entry.dateTime)}
          </span>
          <span>
            <Icons.Clock />
            {Format.time(entry.dateTime)}
          </span>
        </span>
      </>
    ),
    clickHandler: (item) => {
      navigate(`logbook/${item.entry.incidentId}#${item.entry.id}`);
    }
  };
}

const handlerFunctions: HandlerFunction[] = [
  userMention
];

export default function getHandler(
  notification: Notification,
  navigate: NavigateFunction
): Handler {
  const handler: Handler | null = handlerFunctions
    .reduce((result: Handler| null, fn: HandlerFunction) => {
      if (result) {
        return result;
      }
      return fn(notification, navigate);
    }, null);

  return handler || {
    title: 'Error: Unhandled notification type',
    clickHandler: () => {},
    Content: <span>what</span>,
  };
}
