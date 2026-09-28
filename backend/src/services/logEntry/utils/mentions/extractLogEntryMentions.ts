// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { EntityContent } from 'common/EntityContent';
import { ns } from '../../../../rdfutil';
import { getMentionsOfType } from './utils';

function getMentions(content: EntityContent, entryIdNode: unknown) {
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
