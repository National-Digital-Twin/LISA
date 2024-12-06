// Local imports
import { type Hazard } from './types';

export const Fire: Hazard = {
  id: 'Fire',
  label: 'Fire',
  description: 'Internal / external, effect of wind direction.',
  risks: 'Burns / smoke inhalation.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point Cordon' },
    { id: 'Cordon', label: 'Wind direction cordon' }
  ]
};
