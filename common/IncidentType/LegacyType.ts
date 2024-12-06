// Global imports
import { Literal, Static, Union } from 'runtypes';

export const LegacyType = Union(
  Literal('Flooding'),
  Literal('Landslip'),
  Literal('RTA'),
  Literal('AnimalHealth')
);

// eslint-disable-next-line no-redeclare
export type LegacyType = Static<typeof LegacyType>;
