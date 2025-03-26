// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type FullLocationType } from '../../types';

export function locationLink(entry: Partial<LogEntry>): string | undefined {
  // Handle location with description, coordinates, or both
  if (entry.location) {
    const { coordinates } = entry.location as FullLocationType;
    if (coordinates) {
      return `/location/${entry.incidentId}#${entry.id}`;
    }
  }
  return undefined;
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
