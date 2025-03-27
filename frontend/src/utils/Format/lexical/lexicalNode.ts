// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
