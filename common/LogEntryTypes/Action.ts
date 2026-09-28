// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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

export const Action: LogEntryTypesDictItem = {
  label: 'Action',
  colour: 'turquoise',
  fields
};
