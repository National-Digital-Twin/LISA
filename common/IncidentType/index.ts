// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Static } from 'runtypes';

// Local imports
import { AccidentType } from './AccidentType';
import { ConflictType } from './ConflictType';
import { EnvironmentalType } from './EnvironmentalType';
import { GeopoliticalType } from './GeopoliticalType';
import { HealthType } from './HealthType';
import { LegacyType } from './LegacyType';
import { SocietalType } from './SocietalType';
import { TerrorismType } from './TerrorismType';

const SUFFIX = 'Incident';

export const IncidentType = TerrorismType
  .Or(GeopoliticalType)
  .Or(AccidentType)
  .Or(EnvironmentalType)
  .Or(HealthType)
  .Or(SocietalType)
  .Or(ConflictType)
  .Or(LegacyType);

// eslint-disable-next-line no-redeclare
export type IncidentType = Static<typeof IncidentType>;

export function addIncidentSuffix(type: IncidentType): string {
  return `${type}${SUFFIX}`;
}

export function removeIncidentSuffix(value: string): IncidentType {
  return value.substring(0, value.indexOf(SUFFIX)) as IncidentType;
}
