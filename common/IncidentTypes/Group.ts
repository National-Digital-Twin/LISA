// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { IncidentType } from '../IncidentType';

export type Group = {
  label: string;
  legacy?: boolean;
  types: { [key in Partial<IncidentType> ]: {
    index: string, subIndex?: string, label: string
  }}
};
