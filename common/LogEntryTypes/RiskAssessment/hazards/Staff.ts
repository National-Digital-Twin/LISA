// Local imports
import { type Hazard } from './types';

export const Staff: Hazard = {
  id: 'Staff',
  label: 'Local Authority Support Staff',
  description: 'Assisting vulnerable  people, situational (i.e. Highways, Building Control).',
  risks: 'Exposure to risks by staff entering areas not deemed “safe”, staff being unaccounted for if area is evacuated.',
  applicableControls: [
    { id: 'Briefing', label: 'Briefing by Liaison Officer' },
    { id: 'PPE', label: 'PPE - Hi Viz vest' },
    { id: 'Register', label: 'Register of staff on site' }
  ]
};
