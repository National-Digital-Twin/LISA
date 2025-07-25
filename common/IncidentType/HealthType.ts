// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
