// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useContext } from 'react';
import { OnlineContext } from '../context/OnlineContext';

export function useIsOnline(): boolean {
  const context = useContext(OnlineContext);
  if (context === undefined) {
    throw new Error('useIsOnline must be used within OnlineProvider');
  }
  return context.isOnline;
}
