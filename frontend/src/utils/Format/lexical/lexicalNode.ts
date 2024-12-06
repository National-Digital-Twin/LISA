// Global imports
import { ReactNode } from 'react';

// Local imports
import { Key, Node } from './types';
import { text } from './text';
import { linebreak } from './linebreak';
import { mention } from './mention';
import { paragraph } from './paragraph';

export function lexicalNode(node: Node, key: Key): ReactNode {
  switch (node.type) {
  case 'text':
    return text(node, key);
  case 'paragraph':
    return paragraph(node, key, lexicalNode);
  case 'mention':
    return mention(node, key);
  case 'linebreak':
    return linebreak(key);
  default:
    return null;
  }
}
