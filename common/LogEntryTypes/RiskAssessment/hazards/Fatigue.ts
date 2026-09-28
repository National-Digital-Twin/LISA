// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type Hazard } from './types';

export const Fatigue: Hazard = {
  id: 'Fatigue',
  label: 'Hygiene / Welfare - Fatigue',
  risks: 'Loss of situational awareness due to fatigue.',
  applicableControls: [
    {
      id: 'EmergencyBriefing',
      label: 'Briefing from Emergency Control Centre, maintaining contact with Emergency Control Centre Shift changes'
    },
    { id: 'CommanderGuidance', label: 'Guidance from Incident Commander' }
  ]
};
