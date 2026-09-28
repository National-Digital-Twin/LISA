// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Global imports
import { Literal, Record, Static, String, Union } from 'runtypes';

export const MentionableType = Union(
  Literal('User'),
  Literal('LogEntry'),
  Literal('File'),
  Literal('Task'),
);

export type MentionableType = Static<typeof MentionableType>;

export const Mentionable = Record({
  id: String,
  label: String,
  type: MentionableType
});

export type Mentionable = Static<typeof Mentionable>;
