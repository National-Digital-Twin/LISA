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

// eslint-disable-next-line no-redeclare
export type HealthType = Static<typeof HealthType>;
