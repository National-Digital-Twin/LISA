// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type ConflictType } from '../IncidentType/ConflictType';
import { type Group } from './Group';

type Type = Omit<Group, 'types'> & {
  types: { [key in ConflictType]: {
    index: string, subIndex?: string, label: string
  }}
};

export const ConflictGroup: Type = {
  label: 'Conflict and instability',
  types: {
    UKSpaceSystemsDisrupted: { index: '61', label: 'Deliberate disruption of UK space systems and space-based services' },
    NonNATOAllyAttack: { index: '62', label: 'Attack on a UK ally or partner outside NATO or a mutual security agreement requiring international assistance' },
    NuclearMiscalculationNotUK: { index: '63', label: 'Nuclear miscalculation not involving the UK' }
  }
};
