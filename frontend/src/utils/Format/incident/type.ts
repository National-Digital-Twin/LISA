// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type IncidentType } from 'common/IncidentType';
 
import { IncidentTypes } from 'common/IncidentTypes';

export function type(incidentType: IncidentType | undefined): string {
  if(!incidentType) {
    return '';
  }
  
  return IncidentTypes[incidentType].label;
}
