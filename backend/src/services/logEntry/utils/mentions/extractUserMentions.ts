// Local imports
import { type LogEntry } from 'common/LogEntry';
import { ns } from '../../../../rdfutil';
import { getMentionsOfType } from './utils';

export function extractUserMentions(entry: LogEntry, entryIdNode: unknown): Array<{ username: string; triple: unknown}> {
  const userMentions = getMentionsOfType(entry, 'User');
  const mentionedUsers = new Set<string>(userMentions.map((u) => u.id));
  const userNames = Array.from(mentionedUsers);
  return userNames.reduce((list, userName) => {
    list.push({
      username: userName,
      triple: [ns.data(userName), ns.lisa.isMentionedIn, entryIdNode]
    });
    return list;
  }, []);
}
