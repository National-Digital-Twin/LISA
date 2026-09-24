// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Global imports
import { Literal, Static, Union } from 'runtypes';

export const HealthType = Union(
  Literal('Pandemic'),
  Literal('InfectiousOutbreak'),
  Literal('AnimalHealthFootAndMouth'),
  Literal('AnimalHealthBirdFlu'),
  Literal('AnimalHealthHorseSickness'),
  Literal('AnimalHealthSwineFever'),
  Literal('PlantPestXylellaFastidiosa'),
  Literal('PlantPestAgrilusPlanipennis')
);

export type HealthType = Static<typeof HealthType>;
