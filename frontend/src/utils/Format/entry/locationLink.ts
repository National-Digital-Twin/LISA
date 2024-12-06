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
