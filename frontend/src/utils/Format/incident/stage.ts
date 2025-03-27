// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { type IncidentStage, IncidentStages } from 'common/IncidentStage';

export function stage(incidentStage: IncidentStage): string {
  return IncidentStages[incidentStage]?.label;
}
