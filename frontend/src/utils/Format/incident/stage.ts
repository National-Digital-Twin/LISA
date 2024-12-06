// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { type IncidentStage, IncidentStages } from 'common/IncidentStage';

export function stage(incidentStage: IncidentStage): string {
  return IncidentStages[incidentStage]?.label;
}
