// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Array, Boolean, Object, Static, String, Number, Union } from 'runtypes';

// Local imports
import { FieldType } from './FieldType';
import { LogEntryType } from './LogEntryType';

export const FieldOption = Object({
  index: String.optional(),
  subIndex: String.optional(),
  value: String,
  label: String,
  options: Array(
    Object({
      index: String.optional(),
      subIndex: String.optional(),
      value: String,
      label: String
    })
  ).optional()
});

export const Field = Object({
  id: String,
  type: FieldType,
  value: Union(String, Array(String)).optional(),
  optional: Boolean.optional(),
  options: Array(FieldOption).optional(),
  linkableTypes: Array(LogEntryType).optional(),

  // These properties are only needed for the UI.
  label: String.optional(),
  hint: String.optional(),
  className: String.optional(),
  multiline: Boolean.optional(),
  rows: Number.optional()
});

export type Field = Static<typeof Field>;
export type FieldOption = Static<typeof FieldOption>;
