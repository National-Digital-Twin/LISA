// Global imports
import { Literal, Static, Union } from 'runtypes';

export const SocietalType = Union(
  Literal('PublicDisorder'),
  Literal('IndustrialAction'),
  Literal('BritishNationalArrival')
);

// eslint-disable-next-line no-redeclare
export type SocietalType = Static<typeof SocietalType>;
