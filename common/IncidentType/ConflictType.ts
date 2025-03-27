// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Literal, Static, Union } from 'runtypes';

export const ConflictType = Union(
  Literal('UKSpaceSystemsDisrupted'),
  Literal('NonNATOAllyAttack'),
  Literal('NuclearMiscalculationNotUK')
);

// eslint-disable-next-line no-redeclare
export type ConflictType = Static<typeof ConflictType>;
