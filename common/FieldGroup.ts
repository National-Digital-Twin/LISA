// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Array, Boolean, Object, Static, String } from 'runtypes';

export const FieldGroup = Object({
  id: String,
  label: String.optional(),
  description: String.optional(),
  fieldIds: Array(String),
  defaultOpen: Boolean.optional(),
  className: String.optional()
});

export type FieldGroup = Static<typeof FieldGroup>;
