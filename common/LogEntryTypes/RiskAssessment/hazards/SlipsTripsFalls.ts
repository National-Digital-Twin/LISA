// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Hazard } from './types';

export const SlipsTripsFalls: Hazard = {
  id: 'SlipsTripsFalls',
  label: 'Slips, trips and Falls',
  description: 'Equipment, uneven ground, debris, slippery surfaces.',
  risks: 'Lower limb sprains and strains.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point Cordon' },
    { id: 'PPE', label: 'PPE - Safety boots' },
    { id: 'Torch', label: 'Torch' },
    { id: 'PlanRoute', label: 'Plan route' }
  ]
};
