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
