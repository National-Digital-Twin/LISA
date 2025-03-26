// Local imports
import { type Hazard } from './types';

export const Flood: Hazard = {
  id: 'Flood',
  label: 'Flood / water',
  description: 'Coastal / inland flooding, tidal, uncovered drains / manholes concealed by flood water.',
  risks: 'Being swept away by floodwater, drowning, becoming cut off, falling down unseen holes.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point Cordon' },
    { id: 'Cordon', label: 'Do not enter cordon/area(s) deemed unsafe by the Incident Commander' },
    { id: 'PPE', label: 'PPE' }
  ]
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
