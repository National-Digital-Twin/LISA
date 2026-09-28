// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { LogEntry } from 'common/LogEntry';
import { createSequenceNumber } from '../../utils/Form/sequence';

export function createLogEntryFromSubmittedForm(
  id: string,
  formTitle: string,
  formId: string,
  incidentId: string,
  dateTime?: string,
  entry?: Partial<LogEntry>
): Partial<LogEntry> {
  const logEntry: Partial<LogEntry> = entry ?? {
    id,
    type: 'FormSubmitted',
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
