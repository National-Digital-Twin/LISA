// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { useContext } from 'react';
import { OnlineContext } from '../context/OnlineContext';

export function useIsOnline(): boolean {
  const context = useContext(OnlineContext);
  if (context === undefined) {
    throw new Error('useIsOnline must be used within OnlineProvider');
  }
  return context.isOnline;
}
