// Local imports
import { type Field } from '../Field';
import { get } from '../Fields';
import { type LogEntry } from '../LogEntry';
import { type LogEntryTypesDictItem } from './types';

const COMMUNICATION_METHOD_LABEL = 'How was this decision communicated?';

function fields(entry: Partial<LogEntry>): Array<Field> {
  return [
    get.communicationMethod(COMMUNICATION_METHOD_LABEL),
    get.contactName(),
    get.contactDetails(entry)
  ].filter((f) => !!f) as Array<Field>;
}

export const Decision: LogEntryTypesDictItem = {
  label: 'Decision',
  colour: 'green',
  fields
};
