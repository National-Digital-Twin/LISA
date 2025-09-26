// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Optional, Record, Static, String } from 'runtypes';

export const EntityContent = Record({
  json: Optional(String),
  text: Optional(String)
});

export type EntityContent = Static<typeof EntityContent>;
