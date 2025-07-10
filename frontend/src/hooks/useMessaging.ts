// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
    /* eslint-disable-next-line no-console */
    console.log('hasMessage true');
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
    /* eslint-disable-next-line no-console */
    console.log('hasMessage false');
    setHasMessage(false);
  }, [hasMessage]);

  return hasMessage;
}
