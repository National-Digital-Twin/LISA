// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Literal, Static, Union } from 'runtypes';

export const EnvironmentalType = Union(
  Literal('Wildfire'),
  Literal('VolcanicEruption'),
  Literal('Earthquake'),
  Literal('NaturalHumanitarianCrisisOverseas'),
  Literal('DisasterResponseOverseas'),
  Literal('SevereSpaceWeather'),
  Literal('Storms'),
  Literal('Heatwaves'),
  Literal('ColdAndSnow'),
  Literal('FloodingCoastal'),
  Literal('FloodingFluvial'),
  Literal('FloodingSurface'),
  Literal('Drought'),
  Literal('PoorAirQuality')
);

// eslint-disable-next-line no-redeclare
export type EnvironmentalType = Static<typeof EnvironmentalType>;
