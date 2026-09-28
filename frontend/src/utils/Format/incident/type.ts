// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type IncidentType } from 'common/IncidentType';
 
import { IncidentTypes } from 'common/IncidentTypes';

export function type(incidentType: IncidentType | undefined): string {
  if(!incidentType) {
    return '';
  }
  
  return IncidentTypes[incidentType].label;
}
