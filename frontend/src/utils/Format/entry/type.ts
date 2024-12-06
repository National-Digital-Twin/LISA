// Local imports
import { type LogEntryType } from 'common/LogEntryType';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';

export function type(entryType: LogEntryType): string {
  if (LogEntryTypes[entryType]) {
    return LogEntryTypes[entryType].label;
  }
  return LogEntryTypes.General.label;
}
