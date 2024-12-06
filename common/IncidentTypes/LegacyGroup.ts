// Local imports
import { type LegacyType } from '../IncidentType/LegacyType';
import { type Group } from './Group';

type Type = Omit<Group, 'types'> & {
  types: { [key in LegacyType]: {
    index: string, subIndex?: string, label: string
  }}
};

export const LegacyGroup: Type = {
  label: 'Legacy',
  legacy: true,
  types: {
    Flooding: { index: '', label: 'Coastal flooding alert' },
    Landslip: { index: '', label: 'Landslip' },
    RTA: { index: '', label: 'Road traffic accident' },
    AnimalHealth: { index: '', label: 'Animal disease' }
  }
};
