// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Literal, Static, Union } from 'runtypes';

export const FieldType = Union(
  Literal('Select'),
  Literal('SelectMulti'),
  Literal('SelectLogEntry'),
  Literal('YesNo'),
  Literal('Input'),
  Literal('TextArea'),
  Literal('Location'),
  Literal('Date'),
  Literal('DateTime'),
  Literal('Time'),
  Literal('Label')
);

// eslint-disable-next-line no-redeclare
export type FieldType = Static<typeof FieldType>;
