// Global imports
import { Array, Boolean, Optional, Record, Static, String, Union } from 'runtypes';

// Local imports
import { FieldType } from './FieldType';
import { LogEntryType } from './LogEntryType';

export const FieldOption = Record({
  index: Optional(String),
  subIndex: Optional(String),
  value: String,
  label: String,
  options: Optional(Array(Record({
    index: Optional(String),
    subIndex: Optional(String),
    value: String,
    label: String
  })))
});

export const Field = Record({
  id: String,
  type: FieldType,
  value: Optional(Union(String, Array(String))),
  optional: Optional(Boolean),
  options: Optional(Array(FieldOption)),
  linkableTypes: Optional(Array(LogEntryType)),

  // These properties are only needed for the UI.
  label: Optional(String),
  hint: Optional(String),
  className: Optional(String)
});

/* eslint-disable no-redeclare */
export type Field = Static<typeof Field>;
export type FieldOption = Static<typeof FieldOption>;
/* eslint-enable no-redeclare */

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
