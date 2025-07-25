// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Object, Static, String } from 'runtypes';

export const LogEntryContent = Object({
  json: String.optional(),
  text: String.optional()
});

export type LogEntryContent = Static<typeof LogEntryContent>;
