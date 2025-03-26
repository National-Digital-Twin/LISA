// Local imports
import { type Hazard } from './types';

export const Weather: Hazard = {
  id: 'Weather',
  label: 'Weather Conditions',
  description: 'Temperature / Light / Ventilation / Rain / Body temperature (cold / hot), poor light / visibility.',
  risks: 'Heat exhaustion, effects of prolonged exposure to heat, windchill, lowering of body temperature, contact with vehicles / equipment, slips, trips and falls.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre (current and forecast weather)' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point' },
    { id: 'PPE', label: 'PPE - Waterproof coat, gloves, hat, bottled water' }
  ]
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
