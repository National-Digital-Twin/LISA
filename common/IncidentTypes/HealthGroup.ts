// Local imports
import { type HealthType } from '../IncidentType/HealthType';
import { type Group } from './Group';

type Type = Omit<Group, 'types'> & {
  types: { [key in HealthType]: {
    index: string, subIndex?: string, label: string
  }}
};

export const HealthGroup: Type = {
  label: 'Human, animal and plant health',
  types: {
    Pandemic: { index: '54', label: 'Pandemic' },
    InfectiousOutbreak: { index: '55', label: 'Outbreak of an emerging infectious disease' },
    AnimalHealthFootAndMouth: { index: '56', subIndex: 'a', label: 'Animal disease - major outbreak of foot and mouth disease' },
    AnimalHealthBirdFlu: { index: '56', subIndex: 'b', label: 'Animal disease - major outbreak of highly pathogenic avian influenza' },
    AnimalHealthHorseSickness: { index: '56', subIndex: 'c', label: 'Animal disease - major outbreak of African horse sickness' },
    AnimalHealthSwineFever: { index: '56', subIndex: 'd', label: 'Animal disease - major outbreak of African swine fever' },
    PlantPestXylellaFastidiosa: { index: '57', subIndex: 'a', label: 'Major outbreak of plant pest - Xylella fastidiosa' },
    PlantPestAgrilusPlanipennis: { index: '57', subIndex: 'b', label: 'Major outbreak of plant pest - Agrilus planipennis' }
  }
};
