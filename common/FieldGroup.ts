// Global imports
import { Array, Boolean, Optional, Record, Static, String } from 'runtypes';

export const FieldGroup = Record({
  id: String,
  label: Optional(String),
  description: Optional(String),
  fieldIds: Array(String),
  defaultOpen: Optional(Boolean),
  className: Optional(String)
});

// eslint-disable-next-line no-redeclare
export type FieldGroup = Static<typeof FieldGroup>;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
