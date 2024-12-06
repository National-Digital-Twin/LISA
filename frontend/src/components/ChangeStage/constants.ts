// Local imports
import { type Field } from 'common/Field';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IncidentStages, type IncidentStage } from 'common/IncidentStage';
import { Format } from '../../utils';

export const STAGE_FIELD: Field = {
  id: 'stage',
  label: 'New stage',
  type: 'Select',
  options: Object.keys(IncidentStages).map((value: string) => (
    { value, label: Format.incident.stage(value as IncidentStage) }
  ))
};
