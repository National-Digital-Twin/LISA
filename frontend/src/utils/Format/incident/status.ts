// Local imports
import { type Incident } from 'common/Incident';

export function status(incident: Incident | undefined): string {
  if (incident) {
    return incident.offline ? ': Offline - Waiting to sync' : '';
  }
  return '';
}
