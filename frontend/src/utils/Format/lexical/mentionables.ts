import { type Mentionable } from 'common/Mentionable';
import { Node } from './types';

export function mentionables(json: string): Array<Mentionable> {
  const mentions: Mentionable[] = [];

  function findMentions(node: Node) {
    if (node.type === 'mention' && node.mentionName && node.mentionType && node.text) {
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
  const parsedContent = JSON.parse(json);
  findMentions(parsedContent.root);
  return mentions;
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
