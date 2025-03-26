// Global imports
import { Optional, Record, Static, String } from 'runtypes';

export const LogEntryContent = Record({
  json: Optional(String),
  text: Optional(String)
});

// eslint-disable-next-line no-redeclare
export type LogEntryContent = Static<typeof LogEntryContent>;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
