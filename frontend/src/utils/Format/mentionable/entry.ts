// Local imports
import { type LogEntry } from 'common/LogEntry';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import { type Mentionable } from 'common/Mentionable';
import { date } from '../date';
import { entry as EntryUtil } from '../entry';
import { time } from '../time';
import { user } from '../user';

function getLabel(logEntry: LogEntry, noType: boolean): string {
  const index = `#${EntryUtil.index(logEntry)} - `;
  if (logEntry.type === 'RiskAssessment' || logEntry.type === 'RiskAssessmentReview') {
    const d = date(logEntry.dateTime);
    const t = time(logEntry.dateTime);
    if (noType) {
      return `${index}${user(logEntry.author)} - ${d} @ ${t}`;
    }
    return `${index}${EntryUtil.type(logEntry.type)} - ${user(logEntry.author)} - ${d} @ ${t}`;
  }

  const type = LogEntryTypes[logEntry.type];
  if (type.noContent) {
    return `${index}${EntryUtil.type(logEntry.type)}`;
  }

  const content = logEntry.content?.text ?? '';
  return `${index}${content.substring(0, 20)}`;
}

export function entry(logEntry: LogEntry, noType = false): Mentionable {
  const id = logEntry.id ?? '';
  return { id, label: getLabel(logEntry, noType), type: 'LogEntry' };
}
