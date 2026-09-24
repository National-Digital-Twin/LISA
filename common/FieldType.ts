// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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

export type FieldType = Static<typeof FieldType>;
