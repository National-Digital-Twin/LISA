// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { LogEntryContent } from 'common/LogEntryContent';
import { ns } from '../../../../rdfutil';
import { getMentionsOfType } from './utils';


function getMentions(content: LogEntryContent, entryIdNode) : Array<{ username: string; triple: unknown}> {
  const userMentions = getMentionsOfType(content, 'User');
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

export function extractUserMentionsFromLogContent(entry: LogEntry, entryIdNode: unknown): Array<{ username: string; triple: unknown}> {
  return getMentions(entry.content, entryIdNode);
}
