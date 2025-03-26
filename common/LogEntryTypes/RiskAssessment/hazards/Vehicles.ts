// Local imports
import { type Hazard } from './types';

export const Vehicles: Hazard = {
  id: 'Vehicles',
  label: 'Vehicles',
  description: 'Coming into contact with fast / slow moving vehicles, vehicles reversing, large vehicles operating in confined spaces.',
  risks: 'Injury to torso, feet, limbs.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point Cordon' },
    { id: 'PPE', label: 'PPE - Hi Viz vest, safety boots' }
  ]
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
