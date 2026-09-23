// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { createContext } from 'react';
import { type Notification } from 'common/Notification';

interface NotificationContextType {
  addPendingChange: (id: string, condition: (notifications: Notification[]) => boolean) => void;
  isPolling: boolean;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
