// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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
