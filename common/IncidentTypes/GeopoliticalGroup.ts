// Local imports
import { type GeopoliticalType } from '../IncidentType/GeopoliticalType';
import { type Group } from './Group';

type Type = Omit<Group, 'types'> & {
  types: { [key in GeopoliticalType]: {
    index: string, subIndex?: string, label: string
  }}
};

export const GeopoliticalGroup: Type = {
  label: 'Geographic and diplomatic',
  types: {
    OilTradeDisruption: { index: '12', label: 'Disruption to global oil trade routes' }
  }
};
