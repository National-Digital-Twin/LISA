// Local imports
import { IncidentType } from '../IncidentType';

export type Group = {
  label: string;
  legacy?: boolean;
  types: { [key in Partial<IncidentType> ]: {
    index: string, subIndex?: string, label: string
  }}
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
