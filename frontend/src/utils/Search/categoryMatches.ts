// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';

export function categoryMatches(e: LogEntry, categories: Array<string>): boolean {
  if (categories.length > 0) {
    return categories.includes(e.type);
  }
  return true;
}
