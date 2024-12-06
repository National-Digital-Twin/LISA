// Local imports
import { type Incident } from 'common/Incident';
import { type } from './type';

export function name(incident: Incident | undefined, separator = ':'): string {
  if (incident) {
    const incidentType = type(incident.type);
    if (incident.name) {
      return `${incidentType} ${separator} ${incident.name}`;
    }
    return incidentType;
  }
  return '';
}
