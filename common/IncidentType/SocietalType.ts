// Global imports
import { Literal, Static, Union } from 'runtypes';

export const SocietalType = Union(
  Literal('PublicDisorder'),
  Literal('IndustrialAction'),
  Literal('BritishNationalArrival')
);

// eslint-disable-next-line no-redeclare
export type SocietalType = Static<typeof SocietalType>;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
