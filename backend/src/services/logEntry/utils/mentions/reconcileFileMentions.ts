// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { type LogEntry } from 'common/LogEntry';
import { EntityContent } from 'common/EntityContent';
import { getMentionsOfType } from './utils';
import { FileNameMapping } from '../types';

function getMentions(content: EntityContent, entryId: string, namesMap: FileNameMapping[]) {
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
