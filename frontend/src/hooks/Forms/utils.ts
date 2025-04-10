// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from "common/LogEntry";
import { createSequenceNumber } from "../../utils/Form/sequence";

export function createLogEntryFromSubmittedForm(formTitle: string, formId: string, incidentId: string, entry? : Partial<LogEntry>): Partial<LogEntry>{
  const logEntry: Partial<LogEntry> = entry ?? {
    type: 'FormSubmitted',
    incidentId,
    dateTime: new Date().toISOString(),
    content: {},
    fields: [],
    sequence: createSequenceNumber(new Date()),
    details: {
      submittedFormId: formId,
      submittedFormTitle: formTitle
    }
  };

  return logEntry;
}