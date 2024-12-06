// Local imports
import { IncidentType } from '../IncidentType';

export type Group = {
  label: string;
  legacy?: boolean;
  types: { [key in Partial<IncidentType> ]: {
    index: string, subIndex?: string, label: string
  }}
};
