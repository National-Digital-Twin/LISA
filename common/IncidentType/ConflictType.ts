// Global imports
import { Literal, Static, Union } from 'runtypes';

export const ConflictType = Union(
  Literal('UKSpaceSystemsDisrupted'),
  Literal('NonNATOAllyAttack'),
  Literal('NuclearMiscalculationNotUK')
);

// eslint-disable-next-line no-redeclare
export type ConflictType = Static<typeof ConflictType>;
