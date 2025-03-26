// Local imports
import { type Field } from 'common/Field';
import { type Incident } from 'common/Incident';
import { type LogEntry } from 'common/LogEntry';
import { type LogEntryType } from 'common/LogEntryType';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import { type OptionType } from '../types';

function getLogEntryTypes(incident?: Partial<Incident>) {
  return Object.keys(LogEntryTypes).map((value: string) => {
    const type = LogEntryTypes[value as LogEntryType];
    if (type.unselectable?.(incident)) {
      return undefined;
    }
    return {
      value,
      label: LogEntryTypes[value as LogEntryType]?.label ?? LogEntryTypes.General.label
    };
  }).filter((t) => !!t) as Array<OptionType>;
}

const DATE_TIME_FIELD: Field = {
  id: 'dateTime',
  label: 'Date and time occurred',
  type: 'DateTime'
};

function getDateTime(logEntry?: Partial<LogEntry>): Field {
  if (logEntry?.type) {
    const label = LogEntryTypes[logEntry.type]?.dateLabel;
    if (label) {
      return { ...DATE_TIME_FIELD, label };
    }
  }
  return { ...DATE_TIME_FIELD };
}

export function getBaseLogEntryFields(
  incident?: Partial<Incident>,
  entry?: Partial<LogEntry>
): Array<Field> {
  return [
    { id: 'type', type: 'Select', label: 'Category', options: getLogEntryTypes(incident) },
    getDateTime(entry)
  ];
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
