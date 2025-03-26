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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
