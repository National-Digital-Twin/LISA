// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';

export function authorMatches(e: LogEntry, authors: Array<string>): boolean {
  if (authors.length > 0 && e.author?.username) {
    return authors.includes(e.author.username);
  }
  return true;
}
