// Local imports
import { type TerrorismType } from '../IncidentType/TerrorismType';
import { type Group } from './Group';

type Type = Omit<Group, 'types'> & {
  types: { [key in TerrorismType]: {
    index: string, subIndex?: string, label: string
  }}
};

export const TerrorismGroup: Type = {
  label: 'Terrorism, cyber and state threats',
  types: {
    TerrorismInternational: { index: '1', label: 'International terrorist attack' },
    TerrorismNI: { index: '2', label: 'Northern Ireland related terrorism' },
    TerrorismPublic: { index: '3', label: 'Terrorist attacks in venues and public spaces' },
    TerrorismTransport: { index: '4', label: 'Terrorist attacks on transport' },
    HostageTaking: { index: '5', label: 'Strategic hostage taking' },
    Assassination: { index: '6', label: 'Assassination of a high-profile public figure' },
    CBRNSmall: { index: '7', label: 'Smaller-scale CBRN attacks' },
    CBRNMedium: { index: '8', label: 'Medium-scale CBRN attacks' },
    CBRNLarge: { index: '9', label: 'Larger-scale CBRN attacks' },
    InfrastructureConventional: { index: '10', label: 'Conventional attacks on infrastructure' },
    InfrastructureCyber: { index: '11', label: 'Cyber attacks on infrastructure' }
  }
};
