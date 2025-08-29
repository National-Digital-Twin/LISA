// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { type Notification } from 'common/Notification';

import { get } from '../api';
import { useAuth } from '../hooks';
import useMessaging from '../hooks/useMessaging';
import { NotificationContext } from '../context/NotificationContext';

interface NotificationProviderProps {
  children: ReactNode;
}

const MAX_POLLING_ATTEMPTS = 10;
const TOTAL_RETRY_ATTEMPTS = 3;
const POLLING_INTERVAL = 5000;
const DEBUG_LOGGING = true;

const debugLog = (message: string) => {
  if (DEBUG_LOGGING) {
    console.log(`[NotificationProvider] ${message}`);
  }
};

export default function NotificationProvider({ children }: Readonly<NotificationProviderProps>) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [hasNewNotification, resetNewNotification] = useMessaging(
    'NewNotification',
    user.current?.username
  );

  const [isPolling, setIsPolling] = useState(false);
  const pendingChanges = useRef(new Map<string, (notifications: Notification[]) => boolean>());
  const timeoutId = useRef<number | null>(null);
  const attemptNumber = useRef(1);
  const retryAttemptNumber = useRef(0);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  const invalidateQueryAndStopPolling = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    stopPolling();
  };

  const pollRef = useRef<(() => Promise<void>) | null>(null);
  pollRef.current = async () => {
    if (pendingChanges.current.size === 0) {
      stopPolling();
      return;
    }

    try {
      // Direct API call to avoid updating the cache and wiping out our optimistic updates
      const notifications = await get<Notification[]>('/notifications');

      const completedChanges: string[] = [];
      for (const [id, condition] of pendingChanges.current) {
        if (condition(notifications)) {
          completedChanges.push(id);
        }
      }
      completedChanges.forEach((id) => pendingChanges.current.delete(id));

      if (pendingChanges.current.size === 0) {
        debugLog('All notification changes confirmed, invalidating cache');
        invalidateQueryAndStopPolling();
        return;
      }

      if (attemptNumber.current > MAX_POLLING_ATTEMPTS) {
        debugLog('Max polling attempts reached, invalidating cache');
        invalidateQueryAndStopPolling();
        return;
      }

      debugLog(`Polling, attempt: ${attemptNumber.current}; pending: ${pendingChanges.current.size}`);
      attemptNumber.current++;
      timeoutId.current = window.setTimeout(() => pollRef.current?.(), POLLING_INTERVAL);
    } catch (error) {
      const retryAttemptsLeft = TOTAL_RETRY_ATTEMPTS - retryAttemptNumber.current;
      console.error(
        `Error occurred while polling for notification updates: ${error}. Retry attempts left: ${retryAttemptsLeft}`
      );

      if (retryAttemptsLeft > 0) {
        retryAttemptNumber.current++;
        timeoutId.current = window.setTimeout(() => pollRef.current?.(), POLLING_INTERVAL);
      } else {
        invalidateQueryAndStopPolling();
      }
    }
  };

  const addPendingChange = useCallback(
    (id: string, condition: (notifications: Notification[]) => boolean) => {
      pendingChanges.current.set(id, condition);
      if (!isPolling) {
        setIsPolling(true);
        pollRef.current?.();
      }

      // Reset to allow new changes the full cycle of polling
      attemptNumber.current = 1;
      retryAttemptNumber.current = 0;
    },
    [isPolling]
  );

  // Handle new notifications from WebSocket, this message is sent when a new notification
  // is created for the user, but it is not confirmed in the database yet, so we poll for it.
  useEffect(() => {
    if (hasNewNotification) {
      debugLog('New notification for user has been created, polling for new notifications');

      const currentNotifications =
        queryClient.getQueryData<Notification[]>(['notifications']) || [];
      addPendingChange(`new-${Date.now()}`, (notifications) => {
        return notifications.length > currentNotifications.length;
      });

      resetNewNotification();
    }
  }, [hasNewNotification, resetNewNotification, queryClient, addPendingChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const contextValue = useMemo(
    () => ({
      addPendingChange,
      isPolling
    }),
    [addPendingChange, isPolling]
  );

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
}
