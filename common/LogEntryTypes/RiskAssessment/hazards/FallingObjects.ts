// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Hazard } from './types';

export const FallingObjects: Hazard = {
  id: 'FallingObjects',
  label: 'Falling Objects',
  description: 'Equipment and materials falling from vehicles / buildings, branches & foliage falling from trees.',
  risks: 'Head injury, injury to upper body, limbs.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point Cordon' },
    { id: 'PPE', label: 'PPE - Safety helmet' }
  ]
};
