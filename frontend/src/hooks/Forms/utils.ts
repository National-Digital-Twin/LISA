// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from 'common/LogEntry';
import { createSequenceNumber } from '../../utils/Form/sequence';

export function createLogEntryFromSubmittedForm(
  formTitle: string,
  formId: string,
  incidentId: string,
  dateTime?: string,
  entry?: Partial<LogEntry>
): Partial<LogEntry> {
  const logEntry: Partial<LogEntry> = entry ?? {
    type: 'formSubmitted',
    incidentId,
    dateTime: dateTime ?? new Date().toISOString(),
    content: {},
    fields: [],
    sequence: createSequenceNumber(),
    details: {
      submittedFormId: formId,
      submittedFormTitle: formTitle
    }
  };

  return logEntry;
}
