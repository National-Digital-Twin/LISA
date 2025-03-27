// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { WebSocket } from 'ws';

import { MessagingAction, MessagingTopic, type MessagingTopicType } from 'common/Messaging';
import { User } from '../auth/user';

type Subscriber = {
  topic: MessagingTopicType;
  subject: string;
  id: string;
  ws: WebSocket;
  username: string;
};
export default class PubSubManager {
  public static readonly instance = new PubSubManager();

  private subscribers: Subscriber[] = [];

  // eslint-disable-next-line no-useless-constructor, no-empty-function
  private constructor() {}

  public publish(topic: MessagingTopicType, subject: string, performer?: string) {
    const subs = this.subscribers.filter((sub) => sub.topic === topic && sub.subject === subject);
    subs.forEach((sub) => {
      if (sub.ws.readyState === WebSocket.OPEN && sub.username !== performer) {
        sub.ws.send(`${topic}::${subject}`);
      }
    });
  }

  public processMessage(id: string, user: User, ws: WebSocket, message: string) {
    const [action, topic, subject] = message.split('::');

    const actionResult = MessagingAction.validate(action);
    if (!actionResult.success) {
      console.warn('invalid messaging action', action, 'received - ignoring');
      return;
    }

    const eventResult = MessagingTopic.validate(topic);
    if (!eventResult.success) {
      console.warn('invalid messaging topic', topic, 'received - ignoring');
      return;
    }

    if (actionResult.value === 'Subscribe') {
      if (!this.subscribers.find((sub) => sub.id === id && sub.topic === topic && sub.subject === subject)) {
        this.subscribers.push({
          id,
          subject,
          topic: topic as MessagingTopicType,
          ws,
          username: user.username
        });
      }
    } else {
      this.subscribers = this.subscribers
        .filter((sub) => sub.id !== id && sub.topic !== topic && sub.subject !== subject);
    }
  }

  public removeById(id: string) {
    this.subscribers = this.subscribers.filter((sub) => sub.id !== id);
  }

  public clear() {
    this.subscribers = [];
  }

  public static getInstance(): PubSubManager {
    return PubSubManager.instance;
  }
}
