// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Field } from '../Field';
import { get } from '../Fields';
import { type LogEntry } from '../LogEntry';
import { type LogEntryTypesDictItem } from './types';

function fields(entry: Partial<LogEntry>): Array<Field> {
  return [
    get.communicationMethod(),
    get.contactName(),
    get.contactDetails(entry)
  ].filter((f) => !!f) as Array<Field>;
}

export const Communication: LogEntryTypesDictItem = {
  label: 'Communication',
  fields
};
