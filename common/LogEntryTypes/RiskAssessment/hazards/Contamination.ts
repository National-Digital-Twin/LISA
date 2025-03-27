// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Hazard } from './types';

export const Contamination: Hazard = {
  id: 'Contamination',
  label: 'Hygiene / Welfare - Contamination',
  description: 'Contamination on hands spreading to other parts of the body through touch or ingestion.',
  risks: 'Effect of pollutants.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point' },
    { id: 'PPE', label: 'PPE - gloves' },
    { id: 'WashHands', label: 'Wash hands before eating, drinking or smoking' }
  ]
};
