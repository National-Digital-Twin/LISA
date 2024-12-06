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
