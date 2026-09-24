// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Global imports
import { Optional, Record, Static, String } from 'runtypes';

export const EntityContent = Record({
  json: Optional(String),
  text: Optional(String)
});

export type EntityContent = Static<typeof EntityContent>;
