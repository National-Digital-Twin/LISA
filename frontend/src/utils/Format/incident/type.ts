// Local imports
import { type IncidentType } from 'common/IncidentType';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IncidentTypes } from 'common/IncidentTypes';

export function type(incidentType: IncidentType): string {
  return IncidentTypes[incidentType].label;
}
