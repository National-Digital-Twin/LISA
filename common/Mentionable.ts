// Global imports
import { Literal, Record, Static, String, Union } from 'runtypes';

export const MentionableType = Union(
  Literal('User'),
  Literal('LogEntry'),
  Literal('File'),
);

// eslint-disable-next-line no-redeclare
export type MentionableType = Static<typeof MentionableType>;

export const Mentionable = Record({
  id: String,
  label: String,
  type: MentionableType
});

// eslint-disable-next-line no-redeclare
export type Mentionable = Static<typeof Mentionable>;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
