// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Incident } from 'common/Incident';

export function status(incident: Incident | undefined): string {
  if (incident) {
    return incident.offline ? ': Offline - Waiting to sync' : '';
  }
  return '';
}
