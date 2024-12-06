// Global imports
import { useCallback, useContext, useEffect, useState } from 'react';

// Local imports
import { type MessagingTopicType } from 'common/Messaging';
import { MessagingContext } from '../context/MessagingContext';
import { MessagingContextType } from '../utils/types';

export default function useMessaging(topic: MessagingTopicType, subject?: string) {
  const { subscribe, unsubscribe } = useContext(MessagingContext) as MessagingContextType;
  const [hasMessage, setHasMessage] = useState<boolean>(false);

  const callback = useCallback(() => {
    setHasMessage(true);
  }, []);

  useEffect(() => {
    if (!subject) {
      return;
    }
    subscribe(topic, subject, callback);
    /* eslint-disable-next-line consistent-return */
    return () => {
      unsubscribe(topic, subject, callback);
    };
  }, [topic, subject, subscribe, unsubscribe, callback]);

  useEffect(() => {
    setHasMessage(false);
  }, [hasMessage]);

  return hasMessage;
}
