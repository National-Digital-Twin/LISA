// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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

export type FieldGroup = Static<typeof FieldGroup>;
