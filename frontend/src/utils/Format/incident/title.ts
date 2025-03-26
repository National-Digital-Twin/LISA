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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
