// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type LogEntryType } from 'common/LogEntryType';
 
import { LogEntryTypes } from 'common/LogEntryTypes';
import { type FieldValueType } from '../types';

export function getUpdatedFields(entry: Partial<LogEntry>, fieldId?: string, fieldValue?: FieldValueType) {
  const type = LogEntryTypes[entry.type as LogEntryType];
  let fields = entry.fields ?? [];
  // Update the fields first.
  if (fields && fieldId) {
    fields = fields.filter((f) => f.id !== fieldId);
    let field = fields.find((f) => f.id === fieldId);
    if (!field) {
      const typeFields = type?.fields(entry) ?? [];
      field = typeFields.find((f) => f.id === fieldId);
    }
    if (field && fieldValue) {
      fields.push({ ...field, value: fieldValue as string });
    }
  }

  if (fields) {
    // Remove any fields that aren't in the set of fields for this type
    // and make sure all of the fields are appropriately set up.
    const typeFields = type?.fields({ ...entry, fields }) ?? [];
    return fields.map((f) => {
      const typeField = typeFields.find((tf) => tf.id === f.id);
      if (typeField) {
        return { ...typeField, value: f.value };
      }
      return undefined;
    }).filter((f) => !!f);
  }

  return fields;
}

export function updateLogEntry(
  entry: Partial<LogEntry>,
  prop?: string,
  value?: FieldValueType,
  nested = false
): Partial<LogEntry> {
  let updated = entry;
  if (prop && !nested) {
    updated = { ...entry, [prop]: value };
  }
  return {
    ...updated,
    fields: getUpdatedFields(updated, prop, value)
  };
}
