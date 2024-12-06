// Local imports
import { type FieldOption, type Field } from '../../../Field';
import { type FieldGroup } from '../../../FieldGroup';
import { type LogEntry } from '../../../LogEntry';
import { Biological } from './Biological';
import { Contamination } from './Contamination';
import { Enclosed } from './Enclosed';
import { Environment } from './Environment';
import { FallingObjects } from './FallingObjects';
import { Fatigue } from './Fatigue';
import { Fire } from './Fire';
import { Flood } from './Flood';
import { Handling } from './Handling';
import { Height } from './Height';
import { Mothers } from './Mothers';
import { RelevantHazards } from './RelevantHazards';
import { SlipsTripsFalls } from './SlipsTripsFalls';
import { Staff } from './Staff';
import { Substances } from './Substances';
import { Hazard } from './types';
import { hazardFields, hazardGroup } from './utils';
import { Vehicles } from './Vehicles';
import { Weather } from './Weather';

const HAZARDS: Array<Hazard> = [
  Flood,
  Fire,
  Substances,
  SlipsTripsFalls,
  Vehicles,
  FallingObjects,
  Biological,
  Environment,
  Handling,
  Weather,
  Contamination,
  Fatigue,
  Height,
  Enclosed,
  Mothers,
  Staff
];

function getHazardTypes(): Array<FieldOption> {
  return HAZARDS.map((hazard) => ({ value: hazard.id, label: hazard.label }));
}

export function getHazardFields(entry: Partial<LogEntry>): Array<Field> {
  return HAZARDS.flatMap((h) => hazardFields(entry, h));
}

export function getHazardGroups(): Array<FieldGroup> {
  return HAZARDS.map(hazardGroup);
}

export function getRelevantHazards(): Field {
  return { ...RelevantHazards, options: getHazardTypes() };
}
