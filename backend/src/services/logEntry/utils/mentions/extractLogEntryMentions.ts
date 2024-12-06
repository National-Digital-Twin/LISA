// Local imports
import { type LogEntry } from 'common/LogEntry';
import { ns } from '../../../../rdfutil';
import { getMentionsOfType } from './utils';

export function extractLogEntryMentions(entry: LogEntry, entryIdNode: unknown): Array<unknown>[] {
  const logEntryMentions = getMentionsOfType(entry, 'LogEntry');
  const mentionedIds = new Set<string>(logEntryMentions.map((l) => l.id));
  return Array.from(mentionedIds).map((id) => (
    [ns.data(id), ns.lisa.isMentionedBy, entryIdNode]
  ));
}
