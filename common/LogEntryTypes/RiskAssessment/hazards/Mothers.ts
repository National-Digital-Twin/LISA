// Local imports
import { type Hazard } from './types';

export const Mothers: Hazard = {
  id: 'Mothers',
  label: 'New and Expectant Mothers',
  risks: 'Possible harm from environmental effects to mother or unborn children.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point' },
    { id: 'Cordon', label: 'Do not enter areas deemed unsafe' }
  ]
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
