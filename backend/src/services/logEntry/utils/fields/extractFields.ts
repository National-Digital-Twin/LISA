// Local imports
import { type LogEntry } from 'common/LogEntry';
import { getField } from './getField';

export function extractFields(entry: LogEntry, entryIdNode: unknown): Array<unknown> {
  const fields = [];
  entry.fields?.forEach((field) => {
    fields.push(...getField(field, entryIdNode));
  });
  return fields;
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
