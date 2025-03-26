// Local imports
import { type LogEntry } from 'common/LogEntry';

export function authorMatches(e: LogEntry, authors: Array<string>): boolean {
  if (authors.length > 0 && e.author?.username) {
    return authors.includes(e.author.username);
  }
  return true;
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
