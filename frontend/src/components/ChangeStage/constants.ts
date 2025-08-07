// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Field } from 'common/Field';
 
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
