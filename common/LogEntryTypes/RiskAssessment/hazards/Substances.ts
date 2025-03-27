// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Hazard } from './types';

export const Substances: Hazard = {
  id: 'Substances',
  label: 'Hazardous Substances',
  description: 'Chemicals / pollutants, smoke, fumes and vapours.',
  risks: 'Breathing difficulties, burns and affecting eyes.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point Cordon' },
    { id: 'Cordon', label: 'Wind direction cordon' },
    { id: 'PPE', label: 'PPE - Face masks/goggles, etc' }
  ]
};
