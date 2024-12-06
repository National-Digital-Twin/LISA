// Local imports
import { type Hazard } from './types';

export const Biological: Hazard = {
  id: 'Biological',
  label: 'Biological',
  description: 'Persons coming in to contact with and being infected by Hep B & C, TB, HIV.',
  risks: 'Effects of Hep B & C, TB, HIV.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point' },
    { id: 'Needles', label: 'Do not touch needles, etc.' },
    { id: 'PPE', label: 'PPE - Gloves, etc.' }
  ]
};
