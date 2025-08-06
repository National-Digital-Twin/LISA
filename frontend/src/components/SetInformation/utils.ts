// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type Field } from 'common/Field';
import { type Incident } from 'common/Incident';
import { type LogEntry } from 'common/LogEntry';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import { type ValidationError } from '../../utils/types';
import { Validate } from '../../utils';
import { createSequenceNumber } from '../../utils/Form/sequence';

function getIncidentValue(incident: Incident, field: Field): string | undefined {
  const { id } = field;
  let value: string | undefined;
  if (id.includes('.')) {
    const parts = id.split('.');
    const obj = incident[parts[0] as keyof Incident];
    if (typeof obj === 'object') {
      value = String(obj[parts[1] as keyof typeof obj] ?? '');
    }
  } else {
    value = String(incident[id as keyof Incident] ?? '');
  }
  return !value?.length ? undefined : value;
}

function makeEntryFromIncident(incident: Incident, entry?: Partial<LogEntry>): Partial<LogEntry> {
  const logEntry: Partial<LogEntry> = entry ?? {
    type: 'setIncidentInformation',
    incidentId: incident.id,
    dateTime: '',
    content: {},
    fields: [],
    sequence: createSequenceNumber()
  };
  const type = LogEntryTypes.setIncidentInformation;
  type?.fields(logEntry).forEach((field) => {
    const incidentValue = getIncidentValue(incident, field);
    if (!logEntry.fields?.find((f) => f.id === field.id)) {
      logEntry.fields?.push({
        ...field,
        value: incidentValue
      });
    }
  });
  return logEntry;
}

export function getInitialEntry(incident: Incident): Partial<LogEntry> {
  let entry = makeEntryFromIncident(incident);
  // run again to ensure 'dependent' fields are added
  entry = makeEntryFromIncident(incident, entry);
  return entry;
}

export function getDirtyEntry(entry: Partial<LogEntry>, incident: Incident): Partial<LogEntry> {
  const dirtyEntry: Partial<LogEntry> = {
    ...entry
  };
  dirtyEntry.fields = [];

  const origFields = getInitialEntry(incident).fields ?? [];
  const newFields = entry.fields ?? [];
  origFields.forEach((field) => {
    const newField = newFields.find((f) => f.id === field.id);
    if (!newField) {
      dirtyEntry.fields?.push({
        ...{},
        ...field,
        value: undefined
      });
    } else if (newField && newField?.value !== field.value) {
      dirtyEntry.fields?.push({
        ...{},
        ...newField
      });
    }
  });
  newFields.forEach((field) => {
    const origField = origFields.find((f) => f.id === field.id);
    if (!origField) {
      dirtyEntry.fields?.push({
        ...{},
        ...field
      });
    }
  });

  return dirtyEntry;
}

export function validate(entry: Partial<LogEntry>, incident: Incident): ValidationError[] {
  const validationErrors: ValidationError[] = Validate.entry(entry, []);
  const dirtyEntry = getDirtyEntry(entry, incident);
  if (!dirtyEntry.fields?.length) {
    const origFieldIds = getInitialEntry(incident).fields?.map((f) => f.id) ?? [];
    origFieldIds.forEach((fieldId) => {
      validationErrors.push({
        fieldId,
        error: 'No changes have been made'
      });
    });
  }

  return validationErrors;
}
