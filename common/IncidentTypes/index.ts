// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type IncidentType } from '../IncidentType';
import { AccidentGroup } from './AccidentGroup';
import { ConflictGroup } from './ConflictGroup';
import { EnvironmentalGroup } from './EnvironmentalGroup';
import { GeopoliticalGroup } from './GeopoliticalGroup';
import { type Group } from './Group';
import { HealthGroup } from './HealthGroup';
import { LegacyGroup } from './LegacyGroup';
import { TerrorismGroup } from './TerrorismGroup';
import { SocietalGroup } from './SocietalGroup';

type Type = {
  index?: string;
  subIndex?: string;
  label: string;
  group?: string;
  legacy?: boolean
};
type TypesDict = { [key in IncidentType]: Type };

function makeGroup(group: Group): Partial<TypesDict> {
  return Object.keys(group.types).reduce((prev: Partial<TypesDict>, key) => {
    const type = group.types[key as IncidentType];
    return {
      ...prev,
      [key]: {
        index: type.index,
        subIndex: type.subIndex,
        label: type.label,
        group: group.label,
        legacy: group.legacy
      }
    };
  }, {});
}

export const IncidentTypes: TypesDict = {
  ...makeGroup(TerrorismGroup as Group),
  ...makeGroup(GeopoliticalGroup as Group),
  ...makeGroup(AccidentGroup as Group),
  ...makeGroup(EnvironmentalGroup as Group),
  ...makeGroup(HealthGroup as Group),
  ...makeGroup(SocietalGroup as Group),
  ...makeGroup(ConflictGroup as Group),
  ...makeGroup(LegacyGroup as Group),
} as TypesDict;
