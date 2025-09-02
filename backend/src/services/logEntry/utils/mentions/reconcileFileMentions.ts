// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
import { EntryContent } from 'common/EntryContent';
import { getMentionsOfType } from './utils';
import { FileNameMapping } from '../types';

function getMentions(content: EntryContent, entryId: string, namesMap: FileNameMapping[]) {
  const fileMentions = getMentionsOfType(content, 'File');
  if (!fileMentions.length) {
    return;
  }

  fileMentions.forEach((mention) => {
    if (mention.id.startsWith('this::')) {
      const fileName = mention.id.split('::')[1];
      const mapping = namesMap.find((map) => map.originalname === fileName);
      content.json = content.json.replace(
        mention.id,
        `${entryId}::${mapping?.storedName || fileName}`
      );
    }
  });
}

export function reconcileFileMentionsFromLogContent(
  entry: LogEntry,
  entryId: string,
  namesMap: FileNameMapping[]
) {
  const { content } = entry;
  if (!content.json) {
    return;
  }

  getMentions(content, entryId, namesMap);
}
