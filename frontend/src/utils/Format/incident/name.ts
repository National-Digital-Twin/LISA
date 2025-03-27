// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
