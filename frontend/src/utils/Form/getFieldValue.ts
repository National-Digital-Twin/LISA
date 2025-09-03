// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Field } from 'common/Field';
 
import { type LogEntry } from 'common/LogEntry';

type ValueType = string | string[] | undefined;

// SH TODO - A lot of the location functionality here was removed to support the new way of generating location links (passing state)
// is this correct? does it break anything? 
export function getFieldValue(field: Field, entry: Partial<LogEntry>): ValueType {
  return entry.fields?.find((f) => f.id === field.id)?.value;
}
