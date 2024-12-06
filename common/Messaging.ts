import { Literal, Static, Union } from 'runtypes';

export const MessagingAction = Union(
  Literal('Subscribe'),
  Literal('Unsubscribe')
);

export const MessagingTopic = Union(
  Literal('NewNotification'),
  Literal('NewLogEntries')
);

export type MessagingActionType = Static<typeof MessagingAction>;
export type MessagingTopicType = Static<typeof MessagingTopic>;
