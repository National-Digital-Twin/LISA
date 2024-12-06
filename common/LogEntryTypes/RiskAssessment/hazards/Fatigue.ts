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
