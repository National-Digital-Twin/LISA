// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Field } from 'common/Field';
 
import { LocationTypes } from 'common/Location';
import { type LogEntry } from 'common/LogEntry';
import Format, { VIEW_LOCATION } from '../Format';

type ValueType = string | string[] | undefined;
export function getFieldValue(field: Field, entry: Partial<LogEntry>): ValueType {
  if (field.type === 'Location') {
    const href = Format.entry.locationLink(entry);
    const text = Format.entry.location(entry);
    if (href) {
      return text === VIEW_LOCATION ? LocationTypes.coordinates : text;
    }
    return text === VIEW_LOCATION ? '' : text;
  }
  return entry.fields?.find((f) => f.id === field.id)?.value;
}
