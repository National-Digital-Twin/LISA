// Local imports
import { type LocationType } from 'common/Location';
import { type LogEntry } from 'common/LogEntry';
import { type FullLocationType } from '../types';
import { updateLogEntry } from './updateLogEntry';

function determineLocationType(location: FullLocationType): LocationType {
  if (location.coordinates) {
    if (location.description) {
      return 'both';
    }
    return 'coordinates';
  }
  return location.description ? 'description' : 'none';
}

export function copyIntoLogEntry(
  original: Partial<LogEntry>,
  copyFrom: Partial<LogEntry>
): Partial<LogEntry> {
  const originalFields = original.fields ? [...original.fields] : [];
  const copiedFields = copyFrom.fields ? [...copyFrom.fields] : [];
  const merged = {
    ...original,
    location: {
      ...copyFrom.location,
      type: determineLocationType(copyFrom.location as FullLocationType)
    },
    content: { ...copyFrom.content },
    fields: [...originalFields, ...copiedFields]
  } as Partial<LogEntry>;
  return updateLogEntry(merged);
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
