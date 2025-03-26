// Local imports
import { type SocietalType } from '../IncidentType/SocietalType';
import { type Group } from './Group';

type Type = Omit<Group, 'types'> & {
  types: { [key in SocietalType]: {
    index: string, subIndex?: string, label: string
  }}
};

export const SocietalGroup: Type = {
  label: 'Societal',
  types: {
    PublicDisorder: { index: '58', label: 'Public disorder' },
    IndustrialAction: { index: '59', label: 'Industrial action' },
    BritishNationalArrival: { index: '60', label: 'Reception and integration of British Nationals arriving from overseas' }
  }
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
