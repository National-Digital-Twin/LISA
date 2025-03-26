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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
