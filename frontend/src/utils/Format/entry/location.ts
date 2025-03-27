// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type FullLocationType } from '../../types';

export const VIEW_LOCATION = 'View location';
export function location(entry: Partial<LogEntry>): string {
  // handle location with description, coordinates, or both
  if (entry.location && entry.location.type !== 'none') {
    const loc = entry.location as FullLocationType;
    return loc.description ?? VIEW_LOCATION;
  }
  return '';
}
