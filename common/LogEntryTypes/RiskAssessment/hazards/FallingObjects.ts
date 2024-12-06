// Local imports
import { type Hazard } from './types';

export const FallingObjects: Hazard = {
  id: 'FallingObjects',
  label: 'Falling Objects',
  description: 'Equipment and materials falling from vehicles / buildings, branches & foliage falling from trees.',
  risks: 'Head injury, injury to upper body, limbs.',
  applicableControls: [
    { id: 'EmergencyBriefing', label: 'Briefing from Emergency Control Centre' },
    { id: 'ForwardBriefing', label: 'Briefing from Forward Control Point Cordon' },
    { id: 'PPE', label: 'PPE - Safety helmet' }
  ]
};
