// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
