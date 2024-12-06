// Local imports
import { type Incident } from 'common/Incident';
import { date } from '../date';
import { name } from './name';
import { time } from '../time';

export function title(incident: Incident | undefined): string {
  if (incident) {
    const iName = name(incident, ':');
    const iDate = date(incident.startedAt);
    const iTime = time(incident.startedAt);
    return `${iName} - ${iDate} @ ${iTime}`;
  }
  return '';
}
