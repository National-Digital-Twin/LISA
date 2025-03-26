// Local imports
import { type Hazard } from './types';

export const Height: Hazard = {
  id: 'Height',
  label: 'Working at height',
  description: 'This includes working above any drop including stairs or e.g. the top of a cliff.',
  risks: 'Falls leading to injury.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point' },
    { id: 'Cordon', label: 'Do not enter cordon/area(s) deemed unsafe by the Incident Commander' }
  ]
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
