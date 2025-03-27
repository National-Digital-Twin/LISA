// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Hazard } from './types';

export const Enclosed: Hazard = {
  id: 'Enclosed',
  label: 'Enclosed Spaces',
  risks: 'Entrapment.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point' },
    { id: 'Cordon', label: 'Do not enter cordon/area(s) deemed unsafe by the Incident Commander' }
  ]
};
