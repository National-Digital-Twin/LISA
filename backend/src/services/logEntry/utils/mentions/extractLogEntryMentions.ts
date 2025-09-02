// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { EntryContent } from 'common/EntryContent';
import { ns } from '../../../../rdfutil';
import { getMentionsOfType } from './utils';

function getMentions(content: EntryContent, entryIdNode: unknown) {
  const logEntryMentions = getMentionsOfType(content, 'LogEntry');
  const mentionedIds = new Set<string>(logEntryMentions.map((l) => l.id));
  return Array.from(mentionedIds).map((id) => [ns.data(id), ns.lisa.isMentionedBy, entryIdNode]);
}

export function extractLogEntryMentionsFromLogContent(
  entry: LogEntry,
  entryIdNode: unknown
): Array<unknown>[] {
  const type = LogEntryTypes[entry.type];
  if (type.noContent || !entry.content.json) {
    return [];
  }

  return getMentions(entry.content, entryIdNode);
}
