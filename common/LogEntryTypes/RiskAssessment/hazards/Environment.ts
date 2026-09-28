// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type Hazard } from './types';

export const Environment: Hazard = {
  id: 'Environment',
  label: 'Environment',
  description: 'Broken glass, sharp debris, thorns, brambles.',
  risks: 'Cuts to body, injury to feet / hands.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point' },
    { id: 'PPE', label: 'PPE - Safety boots' }
  ]
};
