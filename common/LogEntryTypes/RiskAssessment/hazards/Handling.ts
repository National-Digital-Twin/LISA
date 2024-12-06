// Local imports
import { type Hazard } from './types';

export const Handling: Hazard = {
  id: 'Handling',
  label: 'Manual Handling',
  description: 'Assisting in the positioning of signage, moving equipment.',
  risks: 'Upper body muscle disorders, limb disorders, objects being dropped onto feet.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point' },
    { id: 'Handling', label: 'Manual handling training' },
    { id: 'PPE', label: 'PPE - Safety boots' },
    { id: 'Equipment', label: 'Use of manual handling equipment if available and if trained to do so' }
  ]
};
