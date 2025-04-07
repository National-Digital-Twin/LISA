// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { LogEntryContent } from 'common/LogEntryContent';
import { MentionableType, type Mentionable } from 'common/Mentionable';

export function getMentions(content: LogEntryContent): Mentionable[] {
  if (!content?.json) {
    return [];
  }

  const mentions: Mentionable[] = [];
  function findMentions(node: {
    type?: string;
    mentionType?: MentionableType;
    mentionName?: string;
    text: string;
    children?: Array<unknown>;
  }) {
    if (node.type === 'mention') {
      mentions.push({
        id: node.mentionName,
        label: node.text,
        type: node.mentionType
      });
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(findMentions);
    }
  }
  const parsedContent = JSON.parse(content.json);
  findMentions(parsedContent.root);
  return mentions;
}

export function getMentionsOfType(content: LogEntryContent, type: MentionableType): Mentionable[] {
  const allMentions = getMentions(content);
  return allMentions.filter((m) => m.type === type);
}
