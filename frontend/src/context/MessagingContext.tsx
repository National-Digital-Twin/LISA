import { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useRef } from 'react';

import { type MessagingTopicType } from 'common/Messaging';
import { WebSocketClient } from '../api/ws';
import { useAuth } from '../hooks/useAuth';
import { MessagingContextType, MessagingSubscriber } from '../utils/types';

export const MessagingContext = createContext({});

export default function MessagingProvider({ children }: Readonly<PropsWithChildren>) {
  const { user } = useAuth();
  const ws = useRef<WebSocketClient | null>(null);
  const subscribers = useRef<Record<string, MessagingSubscriber[]>>({});

  const handleIncoming = useCallback((msg: string) => {
    const subscribed = subscribers.current[msg] || [];
    subscribed.forEach((fn) => fn());
  }, []);

  const handleConnection = useCallback(() => {
    Object.keys(subscribers.current).forEach((key) => {
      ws.current?.send(`Subscribe::${key}`);
    });
  }, []);

  useEffect(() => {
    if (!user.authenticated || !user.current) {
      return undefined;
    }
    ws.current = new WebSocketClient(handleConnection, handleIncoming);
    return () => {
      ws.current?.close();
      ws.current = null;
    };
  }, [user, handleIncoming, handleConnection]);

  const subscribe = useCallback((
    topic: MessagingTopicType,
    subject: string,
    callback: MessagingSubscriber
  ) => {
    const key = `${topic}::${subject}`;
    if (!subscribers.current[key]) {
      ws.current?.send(`Subscribe::${key}`);
      subscribers.current[key] = [];
    }
    subscribers.current[key].push(callback);
  }, []);

  const unsubscribe = useCallback((
    topic: MessagingTopicType,
    subject: string,
    callback: MessagingSubscriber
  ) => {
    const key = `${topic}::${subject}`;
    subscribers.current[key] = (subscribers.current[key] || [])
      .filter((sub) => sub !== callback);
    if (subscribers.current[key].length === 0) {
      ws.current?.send(`Unsubscribe::${key}`);
      delete subscribers.current[key];
    }
  }, []);

  const value: MessagingContextType = useMemo(() => ({
    subscribe,
    unsubscribe
  }), [subscribe, unsubscribe]);

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}
