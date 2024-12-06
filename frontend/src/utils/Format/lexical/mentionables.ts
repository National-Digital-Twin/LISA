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
