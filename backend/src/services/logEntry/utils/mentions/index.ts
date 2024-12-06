import { extractLogEntryMentions } from './extractLogEntryMentions';
import { extractUserMentions } from './extractUserMentions';
import { parseLogEntryMentions } from './parseLogEntryMentions';
import { parseUserMentions } from './parseUserMentions';
import { reconcileFileMentions } from './reconcileFileMentions';

export const extract = {
  logEntry: extractLogEntryMentions,
  user: extractUserMentions
};

export const parse = {
  logEntry: parseLogEntryMentions,
  user: parseUserMentions
};

export const reconcile = {
  file: reconcileFileMentions
};
