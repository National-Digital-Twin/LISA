// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { Task } from 'common/Task';
import { type FullLocationType } from '../../types';

export const VIEW_LOCATION = 'View location';
export function location(entity: LogEntry | Task): string {
  // handle location with description, coordinates, or both
  if (entity.location && entity.location.type !== 'none') {
    const loc = entity.location as FullLocationType;
    return loc.description ?? VIEW_LOCATION;
  }
  return '';
}
